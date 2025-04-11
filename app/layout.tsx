"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientProviders from "@/app/ClientProviders";
import Nav from "./nav";
import "./globals.css";
import { usePathname } from "next/navigation";

// Initialize the fonts
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="flex flex-col min-h-screen">
        {!isAdminRoute && (
          <header className="fixed top-0 left-0 right-0 z-50">
            <Nav />
          </header>
        )}
        <ClientProviders>
          <main className="flex-grow">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
