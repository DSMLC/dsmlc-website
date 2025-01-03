import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import Background from "./components/Background";
import { ThemeProvider } from "./ThemeProvider";
import NeuralNetworkScene from "./components/NeuralNetworkScene";
import dynamic from "next/dynamic";

const NeuralNetworkAnimation = dynamic(
  () => import("./components/NeuralNetworkAnimation"),
  { ssr: false }
);

export const quicksand = Quicksand({ subsets: ["latin"] }); // default font
export const redHat = Red_Hat_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Science Machine Learning Club",
  description: "Data Science Machine Learning Club Webpage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${quicksand.className} relative dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <Header />
          <Background />
          <NeuralNetworkScene />
          <NeuralNetworkAnimation />
          <main className="flex-grow pt-24">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
