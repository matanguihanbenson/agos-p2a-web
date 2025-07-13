import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AGOS - Autonomous Garbage-cleaning Operation System",
  description: "Revolutionary bot technology for river cleanup and water quality monitoring",
  openGraph: {
    title: "AGOS - Autonomous Garbage-cleaning Operation System",
    description: "Revolutionary bot technology for river cleanup and water quality monitoring",
    url: "https://p2a-agos-web.vercel.app/", 
    siteName: "AGOS",
    images: [
      {
        url: "https://p2a-agos-web.vercel.app/og-image.png", 
        width: 1200,
        height: 630,
        alt: "AGOS bot cleaning river",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGOS - Autonomous Garbage-cleaning Operation System",
    description: "Revolutionary bot technology for river cleanup and water quality monitoring",
    images: ["https://p2a-agos-web.vercel.app/og-image.png"], // Same image as above
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
