import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import CustomCursor from "@/components/CustomCursor";
import { profile } from "@/data/content";
import { pageMeta, siteUrl } from "@/lib/seo";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-display" });
const sans = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

// Default title/description and link-preview tags. Pages override them via pageMeta().
// The preview image itself is app/opengraph-image.png (and app/twitter-image.png).
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMeta({
    path: "/",
    description:
      "Sushant Pulipati is a software engineer and CS student in Pune who builds backend systems in Go, Android and iOS apps, and the interfaces on top.",
  }),
  title: {
    default: `${profile.name} · Software Engineer`,
    template: `%s · ${profile.name}`, // pages set just their own name, e.g. "Projects"
  },
};

// Runs before the page paints so there's no light-to-dark flash.
// Uses the saved choice if there is one, otherwise the OS setting.
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <CustomCursor />
        <div className="container">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
