import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AgrivalueLogo from "../components/ui/AgrivalueLogo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AgriValue",
  description: "Post-harvest and Cold Chain solutions for Sustainable Livelihood",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AgriValue",
  },
  themeColor: undefined,
};

// Export viewport separately to satisfy Next.js metadata rules
export const viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#22c55e" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <AgrivalueLogo />
        {children}
      </body>
    </html>
  );
}