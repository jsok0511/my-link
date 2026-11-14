import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { FirebaseAnalytics } from "@/components/FirebaseAnalytics";
import { QueryProvider } from "@/components/QueryProvider";
import { AuthProvider } from "@/components/AuthProvider";

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  OG_DEFAULT_DESCRIPTION,
  SITE_NAME,
  buildSocialMetadata,
  getMetadataBase,
} from "@/lib/seo";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: SITE_NAME,
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: "이지성", url: "https://github.com/jsok0511" }],
  creator: "이지성",
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...buildSocialMetadata({
    title: DEFAULT_TITLE,
    description: OG_DEFAULT_DESCRIPTION,
  }),
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
