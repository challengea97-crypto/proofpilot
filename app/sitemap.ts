import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/pricing`, priority: 0.8 },
    { url: `${base}/login`, priority: 0.5 },
  ];
}
