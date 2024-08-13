import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import Footer from "./components/Footer";

export const quicksand = Quicksand({ subsets: ["latin"] }); // default font
export const redHat = Red_Hat_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
title: "DSMLC",
  description: "Data Science and Machine Learning Club at UCalgary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
