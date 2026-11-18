import type { Metadata } from "next";
import localFont from "next/font/local";
import Nav from "@/components/Nav";
import CustomCursor from "@/components/CustomCursor";
import Starfield from "@/components/Starfield";
import Decryptor from "@/components/Decryptor";
import Footer from "@/components/Footer";
import { profile } from "@/data/content";
import { pageMeta, siteUrl } from "@/lib/seo";
import "./globals.css";

// Headings: Instrument Serif. Body: Hanken Grotesk. Labels and code: JetBrains Mono.
// The font files live in app/fonts (all free, OFL-licensed), so builds never
// depend on downloading from Google Fonts.
const display = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});
const sans = localFont({
  src: [
    { path: "./fonts/hanken-grotesk-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/hanken-grotesk-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/hanken-grotesk-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});
const mono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

// Default title/description and link-preview tags. Pages override them via pageMeta().
// The preview image itself is app/opengraph-image.png (and app/twitter-image.png).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMeta({
    path: "/",
    description:
      "Sushant Pulipati, a software engineer in Pune building backend systems in Go and Android and iOS apps.",
  }),
  title: {
    default: `${profile.name} · Software Engineer`,
    template: `%s · ${profile.name}`, // pages set just their own name, e.g. "Projects"
  },
};

// Runs before the page paints so there's no light-to-dark flash.
// Uses the saved choice if there is one; otherwise starts in dark (night sky) mode.
// It also sets data-js, which lets text start "encrypted" (see Decryptor),
// with a safety net that shows everything if the scripts never load.
const themeScript = `
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("theme");
    root.setAttribute("data-theme", saved === "light" ? "light" : "dark");
  } catch (e) {
    root.setAttribute("data-theme", "dark");
  }
  root.setAttribute("data-js", "");
  setTimeout(function () { root.setAttribute("data-dx-fallback", ""); }, 4000);
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Starfield />
        <CustomCursor />
        <Decryptor />
        <div className="container">
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
