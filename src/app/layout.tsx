import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import NextTopLoader from "nextjs-toploader";
import { AuthProvider } from "@/providers/AuthProvider";
import SideBarWrapper from "@/components/layout/SideBarWrapper";
import MobileNavWrapper from "@/components/layout/MobileNavWrapper";

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
    default: "Beats Music",
    template: "%s | Beats Music",
  },
  description: "Beats Music — The Multi-Universal Music Playlist",
  applicationName: "Beats Music",
  icons: {
    icon: [{ url: "/icons/left-logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NextTopLoader
            color="#17DCF5"
            initialPosition={0.2}
            crawlSpeed={250}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #17DCF5,0 0 5px #17DCF5"
            zIndex={2000}
          />
          <HeaderWrapper />
          <main className="pb-mobile-nav md:pb-0">
            {children}
          </main>
          <SideBarWrapper />
          <MobileNavWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
