import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/jury/score"] }, sitemap: "https://40u40-main.vercel.app/sitemap.xml" };
}
