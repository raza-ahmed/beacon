import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Serif, Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import "@/tokens/generated/index.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design System Beacon",
  description: "Design system documentation and reference",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${ibmPlexSerif.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('design-system-theme') || 'dark';
                  var hue = localStorage.getItem('design-system-hue') || 'hue-sky';
                  var root = document.documentElement;
                  root.setAttribute('data-theme', theme);
                  root.setAttribute('data-hue', hue);
                  var metaThemeColor = document.querySelector('meta[name="theme-color"]');
                  if (metaThemeColor) {
                    metaThemeColor.setAttribute('content', theme === 'dark' ? '#151414' : '#f7fafc');
                  }
                } catch (e) {
                  // Fallback to dark theme if localStorage access fails
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.setAttribute('data-hue', 'hue-sky');
                }
              })();
            `,
          }}
        />
        <meta name="theme-color" content="#f7fafc" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
