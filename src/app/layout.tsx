import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";
import "@/tokens/generated/index.css";

export const metadata: Metadata = {
  title: "Design System Beacon",
  description: "Design system documentation and reference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f7fafc" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
