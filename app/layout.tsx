import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import { CartProvider } from "./context/CartContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dapur Minul",
  description: "Pesan makanan favoritmu 🍜",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },

  openGraph: {
    title: "Dapur Minul",
    description: "Pesan makanan favoritmu 🍜",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Dapur Minul",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Dapur Minul",
    description: "Pesan makanan favoritmu 🍜",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <Toaster
            position="top-center"
            richColors
          />
        </CartProvider>
      </body>
    </html>
  );
}