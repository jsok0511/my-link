import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { FirebaseAnalytics } from "@/components/FirebaseAnalytics";
import { QueryProvider } from "@/components/QueryProvider";
import { AuthProvider } from "@/components/AuthProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "MyLink | 흩어진 내 모든 링크, 하나의 주소로",
  description:
    "블로그, GitHub, 포트폴리오부터 1:1 커피챗까지. Google 로그인 한 번으로 10초 만에 만드는 나만의 링크 허브예요.",
  keywords: ["마이링크", "MyLink", "링크 허브", "프로필 링크", "포트폴리오", "TDS", "Next.js"],
  authors: [{ name: "이지성", url: "https://github.com/jsok0511" }],
  openGraph: {
    title: "MyLink | 흩어진 내 모든 링크, 하나의 주소로",
    description:
      "Google 로그인 한 번으로 10초 만에 완성하는 나만의 디지털 명함 & 링크 허브예요.",
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
        <QueryProvider>
          <AuthProvider>
            <FirebaseAnalytics />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
