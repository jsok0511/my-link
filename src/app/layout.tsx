import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "이지성 | Lee Ji-seong • 프로필",
  description: "토스 디자인 시스템(TDS) 스타일로 구성된 대학생 & 바이브 코더 이지성의 개인 링크 허브예요.",
  keywords: ["이지성", "Lee Ji-seong", "바이브 코딩", "Vibe Coding", "Next.js", "TDS", "토스 디자인 시스템", "프로필"],
  authors: [{ name: "이지성", url: "https://github.com/jsok0511" }],
  openGraph: {
    title: "이지성 | Lee Ji-seong • 프로필",
    description: "토스 디자인 시스템(TDS) 스타일로 구성된 대학생 & 바이브 코더 이지성의 개인 링크 허브예요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#191F28] selection:bg-[#E8F3FF] selection:text-[#3182F6]">
        {children}
      </body>
    </html>
  );
}
