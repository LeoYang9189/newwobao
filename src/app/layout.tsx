import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI沃宝 - 智能物流助手",
  description: "基于Cargoware云物流平台设计的智能助手方案",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
