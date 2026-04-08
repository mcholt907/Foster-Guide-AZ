import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.fosterhubaz.com";

  // The base paths available for each language.
  // Do NOT include /setup — it's onboarding UI, not indexable content.
  const routes = [
    "",
    "/ask",
    "/case",
    "/future",
    "/resources",
    "/rights",
    "/wellness",
  ];

  const langs = ["en", "es"];

  // Start with the root level domain (language selector page)
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // Add all the localized routes
  langs.forEach((lang) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 0.9 : 0.8, // Slightly higher priority for the homepage of each language
      });
    });
  });

  return sitemap;
}
