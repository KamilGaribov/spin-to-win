import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spin to Win - Balique.az",
  description: "Spin to Win - Balique.az",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="relative min-h-screen">
          <div className="absolute top-4 left-4 z-10 border border-white h-[60px] px-2 bg-[ff,ff,ff] rounded-md flex items-center">
            <Link href="https://balique.az/" target="_blank">
              <Image src="/logo.png" alt="Balique Logo" width={100} height={40} />
            </Link>
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}
