import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { AIStylist } from "@/components/stylist/AIStylist";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DripNest | Your Drip. Your Nest.",
  description: "DripNest - Modern fashion store. Bold, youthful, streetwear-meets-luxury.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${manrope.variable} font-sans antialiased text-black bg-cream selection:bg-violet selection:text-white flex flex-col min-h-screen pt-20`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <MobileMenu />
          <SearchOverlay />
          <AIStylist />
        </Providers>
      </body>
    </html>
  );
}
