import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LocaleProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "GABLILY PREMIER | GP 珈珮 — 东方珍珠，恒久光华",
  description:
    "GABLILY PREMIER (GP 珈珮) 传承东方珍珠之美，以匠心工艺诠释恒久光华。探索高端珍珠首饰系列。",
  keywords: ["珍珠", "珠宝", "GP珈珮", "GABLILY PREMIER", "高端首饰", "东方珍珠"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-text-primary font-sans">
        <LocaleProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
