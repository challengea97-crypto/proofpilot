import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/pricing`, priority: 0.8 },
    { url: `${base}/faq`, priority: 0.6 },
    { url: `${base}/about`, priority: 0.5 },
    { url: `${base}/contact`, priority: 0.5 },
    { url: `${base}/login`, priority: 0.4 },
    { url: `${base}/terms`, priority: 0.2 },
    { url: `${base}/privacy`, priority: 0.2 },
  ];
}
