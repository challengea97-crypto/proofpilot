import { lookup } from "dns/promises";
import { isIP } from "net";

/**
 * SSRF protection for user-supplied URLs that the server will fetch.
 * - `staticUrlCheck`: cheap synchronous checks (scheme, obvious private hosts) —
 *   safe to use in client-adjacent code paths like form validation.
 * - `assertPublicUrl`: full check including DNS resolution — every resolved
 *   address must be public. Server-only (imports dns).
 */

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, part) => (acc << 8) + Number(part), 0) >>> 0;
}

const PRIVATE_V4_RANGES: [number, number][] = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
].map(([base, bits]) => {
  const baseInt = ipv4ToInt(base as string);
  const mask = bits === 0 ? 0 : (~0 << (32 - (bits as number))) >>> 0;
  return [baseInt & mask, mask] as [number, number];
});

export function isPrivateIp(address: string): boolean {
  const version = isIP(address);
  if (version === 4) {
    const ip = ipv4ToInt(address);
    return PRIVATE_V4_RANGES.some(([base, mask]) => (ip & mask) === base);
  }
  if (version === 6) {
    const lower = address.toLowerCase();
    if (lower === "::" || lower === "::1") return true;
    if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true; // link-local
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique-local
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return isPrivateIp(mapped[1]);
    return false;
  }
  return false;
}

/** Synchronous sanity checks. Returns an error message, or null when OK. */
export function staticUrlCheck(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return "Enter a valid URL.";
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "Only http(s) URLs can be watched.";
  }
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    return "Internal hosts can't be watched.";
  }
  if (isIP(host.replace(/^\[|\]$/g, "")) && isPrivateIp(host.replace(/^\[|\]$/g, ""))) {
    return "Private IP addresses can't be watched.";
  }
  return null;
}

/**
 * Full server-side check: static checks + DNS resolution, rejecting any URL
 * whose hostname resolves to a private/loopback/link-local address.
 */
export async function assertPublicUrl(raw: string): Promise<URL> {
  const staticError = staticUrlCheck(raw);
  if (staticError) throw new Error(staticError);
  const url = new URL(raw);
  const bareHost = url.hostname.replace(/^\[|\]$/g, "");

  if (isIP(bareHost)) {
    if (isPrivateIp(bareHost)) throw new Error("Private address blocked.");
    return url;
  }

  const addresses = await lookup(bareHost, { all: true, verbatim: true });
  if (addresses.length === 0) throw new Error("Host did not resolve.");
  for (const { address } of addresses) {
    if (isPrivateIp(address)) throw new Error("Host resolves to a private address.");
  }
  return url;
}
