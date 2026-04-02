import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.fosterhubaz.com";

  // The base paths available for each language
  const routes = [
    "",
    "/setup",
    "/ask",
    "/case",
    "/future",
    "/resources",
    "/rights",
    "/wellness",
  ];

  const langs = ["en", "es"];

  const sitemap: MetadataRoute.Sitemap = [];

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
