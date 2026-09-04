import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://noorwatches.com"
  ),
  title: {
    default: "NOOR — Premium Women's Watches",
    template: "%s | NOOR Watches",
  },
  description:
    "Discover NOOR's collection of elegant women's watches. Premium timepieces designed to complement every moment. Shop online with Cash on Delivery or Advance Payment across Pakistan.",
  keywords: [
    "women's watches",
    "ladies watches",
    "NOOR watches",
    "premium watches Pakistan",
    "elegant watches",
    "buy watches online Pakistan",
  ],
  authors: [{ name: "NOOR" }],
  creator: "NOOR",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://noorwatches.com",
    siteName: "NOOR Watches",
    title: "NOOR — Premium Women's Watches",
    description:
      "Elegant watches designed to complement every moment. Shop online across Pakistan.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NOOR — Premium Women's Watches",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOOR — Premium Women's Watches",
    description:
      "Elegant watches designed to complement every moment. Shop online across Pakistan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              border: "1px solid #E0DCD5",
              color: "#0D0D0D",
            },
          }}
        />
      </body>
    </html>
  );
}
