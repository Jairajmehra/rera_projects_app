import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | PropView.AI',
    default: 'PropView.AI | Premier Property Search Platform in Gujarat, India',
  },
  description: "Discover 30,000+ residential, commercial and agricultural properties across Gujarat. Search from 14,000+ real estate projects with PropView.AI's advanced property finder.",
  keywords: ["real estate", "property search", "Gujarat properties", "residential properties", "commercial properties", "agricultural land", "India real estate"],
  metadataBase: new URL('https://www.propview.ai'),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'PropView.AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropView.AI | Property Search Platform',
    description: 'Search 30,000+ properties across Gujarat, India',
  },
};

export default function RootLayout({children,}: Readonly<
  {
  children: React.ReactNode;
  }>) 
  {
  return (
  
    <html lang="en">

    <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        {/* Use "default" so that the status bar area shows your background color */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
        {children}
        </QueryProvider>
      </body>
    </html>
 
    
  );
}
