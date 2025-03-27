import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI沃宝 - 智能物流助手",
  description: "基于Cargoware云物流平台设计的智能助手方案",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
} 