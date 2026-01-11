import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Balique.az - Promo kod qazan",
  description: "Get your promo code at Balique.az",
};

export default function PromoCodeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <Head>
        {/* Page-specific title & meta */}
        <title>Promo kod qazan - Balique.az</title>
        <meta name="description" content="Get your promo code at Balique.az" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        id="promo-page"
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-promo bg-cover bg-center min-h-screen`}
      >
        {/* Optional header/logo */}
        <div className="absolute top-4 left-4 z-10 flex items-center">
          <Link href="https://balique.az/" target="_blank">
            <Image src="/logo.png" alt="Balique Logo" width={100} height={40} />
          </Link>
        </div>

        {/* Page content */}
        <div className="relative z-0">{children}</div>
      </body>
    </html>
  );
}
