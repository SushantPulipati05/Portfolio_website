import type { MetadataRoute } from "next";

// Served at https://sushnt.dev/robots.txt
// Lets every search engine crawl the whole site and points them to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://sushnt.dev/sitemap.xml",
    host: "https://sushnt.dev",
  };
}
