import type { Metadata } from "next";

// Next.js replaces (doesn't merge) a parent's openGraph/twitter blocks when a
// page sets its own, so every page builds the full set through this helper.
// That way the link-preview image and site name show up on every page.
export const siteUrl = "https://sushnt.dev";
export const siteName = "Sushant Pulipati";

export function pageMeta({
  path,
  title,
  description,
}: {
  path: string; // "/", "/projects", ...
  title?: string; // page name, e.g. "Projects"; omit for the home page
  description: string;
}): Metadata {
  const fullTitle = title ? `${title} · ${siteName}` : `${siteName} · Software Engineer`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: `${siteUrl}${path === "/" ? "" : path}`,
      siteName,
      title: fullTitle,
      description,
      locale: "en_IN",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Sushant Pulipati, I learn by building things from scratch" }],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@sushantpulipat",
      title: fullTitle,
      description,
      images: ["/twitter-image.png"],
    },
  };
}
