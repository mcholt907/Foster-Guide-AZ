import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /en/setup and /es/setup (onboarding) are kept out of search results with
    // a `noindex` robots meta tag in their layout, not a Disallow here: a
    // crawler that is blocked from a page can never see its noindex, and the
    // URL can still get listed from links alone.
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.fosterhubaz.com/sitemap.xml",
    host: "https://www.fosterhubaz.com",
  };
}
