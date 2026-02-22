import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TalkInvoice - 声で作る、現場の請求書アプリ",
  description: "現場の帰り道、声だけで請求書が完成。PC不要、スマホひとつで完結する個人事業主のための請求書アプリ。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased bg-[#0A0A0A] text-white`}>
        {children}
      </body>
    </html>
  );
}
