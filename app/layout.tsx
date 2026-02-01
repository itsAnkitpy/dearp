import type { Metadata } from "next";
import { Playfair_Display, Inter, Kalam } from "next/font/google";
import MusicToggle from "./components/MusicToggle";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-handwritten",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "dearP 💝 Our Little Internet Home",
  description: "A private space for us, filled with love and memories.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${kalam.variable}`}>
      <body>
        {children}
        <MusicToggle />
      </body>
    </html>
  );
}

