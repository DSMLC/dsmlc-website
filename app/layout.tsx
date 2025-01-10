import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import Background from "./components/Background";
import { ThemeProvider } from "./ThemeProvider";
import MovingCircles2DBounce from "./components/MovingCircles2DBounce";
import dynamic from "next/dynamic";
import Script from "next/script";
import NetlifyIdentityProvider from "./NetlifyIdentityProvider";

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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NJX31X00DN"
        ></Script>
        <Script id="google-analytics">
          {`
        window.dataLayer = window.dataLayer || []; function gtag()
      {dataLayer.push(arguments);}
      gtag('js', new Date()); gtag('config', 'G-NJX31X00DN');
      `}
        </Script>
      </head>
      <body
        className={`${quicksand.className} overflow-x-hidden relative dark:bg-dark-dsmlcWhite bg-light-dsmlcWhite flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <Header />
          <Background />
          <MovingCircles2DBounce />
          <NeuralNetworkAnimation />{" "}
          <NetlifyIdentityProvider>
            <main className="flex-grow pt-32">{children}</main>{" "}
          </NetlifyIdentityProvider>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
