import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { SiteFooter } from "@/components/organisms/site-footer";
import { SiteHeader } from "@/components/organisms/site-header";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { site } from "@/content/pt-BR/site";
import { siteTitle } from "@/lib/seo/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Mono aparece acima da dobra (header, hero), por isso com preload.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1c" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: siteTitle,
    template: `%s · ${site.person.name}`,
  },
  description: site.description,
  applicationName: site.domain,
  authors: [{ name: site.person.fullName, url: site.url }],
  creator: site.person.fullName,
  // Canonical e og:url ficam em cada página: no layout seriam herdados por
  // rotas que não os definem (ex.: 404) e apontariam todas para "/".
  openGraph: {
    type: "website",
    siteName: site.domain,
    locale: site.locale,
    title: siteTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable}`}
      lang="pt-BR"
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          <a
            className="sr-only z-[200] rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            href="#conteudo"
          >
            {site.a11y.skipToContent}
          </a>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="relative z-0 min-w-0 flex-1" id="conteudo">
              {children}
            </main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
