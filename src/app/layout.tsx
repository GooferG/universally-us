import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Universally Us — Support for Women Healing from Narcissistic Relationships",
    template: "%s | Universally Us",
  },
  description:
    "A support community for women healing from narcissistic relationships. You are not alone — find understanding, strength, and healing here.",
  keywords: [
    "narcissistic relationship support",
    "healing from narcissism",
    "women support community",
    "emotional abuse recovery",
  ],
  openGraph: {
    title: "Universally Us",
    description: "Support community for women healing from narcissistic relationships.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#FAF5EE] text-[#2D2A27]">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
