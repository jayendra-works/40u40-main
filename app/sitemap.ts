import type { MetadataRoute } from "next";

const baseUrl = "https://40u40-main.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/contenders", "/finalists", "/jury", "/nominate", "/summit", "/program", "/agenda", "/faq", "/winners"].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));
}
