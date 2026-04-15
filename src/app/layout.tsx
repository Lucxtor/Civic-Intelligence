import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

import { GlobalNav } from "@/components/layout/GlobalNav";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ipê Civic Intelligence Platform",
  description: "Data-driven community consensus and governance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark antialiased h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Web3Provider>
          <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
              <Link href="/" className="font-heading font-bold text-xl tracking-tight text-foreground hover:opacity-80 transition-opacity">
                Ipê <span className="text-ipe-green">Civic</span>
              </Link>
              <div className="flex items-center gap-4">
                <GlobalNav />
                <ConnectButton />
              </div>
            </div>
          </header>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}
