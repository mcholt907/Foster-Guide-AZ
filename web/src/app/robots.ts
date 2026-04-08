import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Onboarding flow — not indexable content
      disallow: ["/en/setup", "/es/setup"],
    },
    sitemap: "https://www.fosterhubaz.com/sitemap.xml",
  };
}
