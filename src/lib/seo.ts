import type { Metadata } from "next";

export const SITE_NAME = "MyLink";
export const DEFAULT_TITLE = "MyLink | 흩어진 내 모든 링크, 하나의 주소로";
export const DEFAULT_DESCRIPTION =
  "블로그, GitHub, 포트폴리오부터 1:1 커피챗까지. Google 로그인 한 번으로 10초 만에 만드는 나만의 링크 허브예요.";
export const OG_DEFAULT_DESCRIPTION =
  "Google 로그인 한 번으로 10초 만에 완성하는 나만의 디지털 명함 & 링크 허브예요.";

export const DEFAULT_KEYWORDS = [
  "마이링크",
  "MyLink",
  "링크 허브",
  "프로필 링크",
  "포트폴리오",
  "디지털 명함",
  "링크 모음",
  "링크 관리",
];

/**
 * Resolves the canonical site URL from environment variables with localhost fallback.
 */
export function getSiteUrl(): string {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    "http://localhost:3000";

  return rawUrl.replace(/\/+$/, "");
}

/**
 * Returns the `URL` instance used as `metadataBase` in the root layout.
 */
export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

interface BuildSocialMetadataOptions {
  title: string;
  description: string;
  url?: string;
  type?: "website" | "profile";
  username?: string;
  images?: string[];
}

/**
 * Builds consistent Open Graph and Twitter metadata for a page without
 * overriding file-based `opengraph-image.tsx` routes.
 */
export function buildSocialMetadata({
  title,
  description,
  url,
  type = "website",
  username,
  images,
}: BuildSocialMetadataOptions): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      ...(url ? { url } : {}),
      ...(images ? { images } : {}),
      siteName: SITE_NAME,
      locale: "ko_KR",
      ...(type === "profile"
        ? { type: "profile", ...(username ? { username } : {}) }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
