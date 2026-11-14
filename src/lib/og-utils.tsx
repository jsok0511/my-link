import React from "react";

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

export const OG_COLORS = {
  blue500: "#3182F6",
  blue600: "#1B64DA",
  blue50: "#E8F3FF",
  grey900: "#191F28",
  grey800: "#333D4B",
  grey700: "#4E5968",
  grey600: "#6B7684",
  grey500: "#8B95A1",
  grey400: "#B0B8C1",
  grey200: "#E5E8EB",
  grey100: "#F2F4F6",
  grey50: "#F9FAFB",
  white: "#FFFFFF",
} as const;

export const OG_FONT_FAMILY = '"Noto Sans KR", sans-serif';

export type OgFontWeight = 400 | 500 | 700;

export interface OgFontConfig {
  name: string;
  data: ArrayBuffer;
  weight: OgFontWeight;
  style: "normal";
}

const GOOGLE_FONTS_TTF_USER_AGENT =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

const DEFAULT_FALLBACK_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789·→›+/@._-!?()[]~,:";

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
]);

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const MAX_FONT_CACHE_ENTRIES = 48;
const fontCache = new Map<string, ArrayBuffer>();

function setBoundedFontCache(key: string, value: ArrayBuffer): void {
  if (fontCache.size >= MAX_FONT_CACHE_ENTRIES) {
    const oldestKey = fontCache.keys().next().value;
    if (oldestKey) {
      fontCache.delete(oldestKey);
    }
  }
  fontCache.set(key, value);
}

async function fetchSubsetGoogleFont(
  weight: OgFontWeight,
  uniqueChars: string
): Promise<OgFontConfig | null> {
  const cacheKey = `${weight}:${uniqueChars}`;
  const cached = fontCache.get(cacheKey);
  if (cached) {
    return {
      name: "Noto Sans KR",
      data: cached,
      weight,
      style: "normal",
    };
  }

  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(
      uniqueChars
    )}`;
    const cssRes = await fetch(cssUrl, {
      headers: { "User-Agent": GOOGLE_FONTS_TTF_USER_AGENT },
      signal: AbortSignal.timeout(4000),
    });
    if (!cssRes.ok) {
      return null;
    }

    const css = await cssRes.text();
    const match = css.match(
      /src:\s*url\(([^)]+)\)\s*format\(['"](?:opentype|truetype)['"]\)/
    );
    const fontUrl = match?.[1]?.replace(/^['"]|['"]$/g, "");
    if (!fontUrl) {
      return null;
    }

    const fontRes = await fetch(fontUrl, {
      signal: AbortSignal.timeout(4000),
    });
    if (!fontRes.ok) {
      return null;
    }

    const data = await fontRes.arrayBuffer();
    if (data.byteLength === 0) {
      return null;
    }

    setBoundedFontCache(cacheKey, data);
    return {
      name: "Noto Sans KR",
      data,
      weight,
      style: "normal",
    };
  } catch {
    return null;
  }
}

/**
 * Loads subsetted Noto Sans KR TTF fonts for weights 400, 500, and 700.
 * Falls back gracefully to an empty list if offline or timed out.
 */
export async function loadOgFonts(text: string): Promise<OgFontConfig[]> {
  const uniqueChars = Array.from(new Set(text + DEFAULT_FALLBACK_CHARS))
    .sort()
    .join("");

  const weights: OgFontWeight[] = [400, 500, 700];
  const results = await Promise.all(
    weights.map((weight) => fetchSubsetGoogleFont(weight, uniqueChars))
  );

  return results.filter((font): font is OgFontConfig => font !== null);
}

/**
 * Safely fetches an external avatar image and converts it to a base64 data URI
 * in formats supported by Satori/Resvg (PNG, JPEG, GIF). Returns null on error.
 */
export async function fetchAvatarDataUrl(
  photoURL?: string
): Promise<string | null> {
  if (!photoURL) {
    return null;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(photoURL);
  } catch {
    return null;
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    return null;
  }

  try {
    const res = await fetch(parsedUrl.toString(), {
      headers: {
        Accept: "image/png,image/jpeg,image/gif;q=0.9",
      },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) {
      return null;
    }

    const contentTypeHeader = res.headers.get("content-type") ?? "";
    const mimeType = contentTypeHeader.split(";")[0]?.trim().toLowerCase();
    if (!mimeType || !ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
      return null;
    }

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength === 0 || buffer.byteLength > MAX_AVATAR_BYTES) {
      return null;
    }

    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
}

/**
 * Truncates text cleanly without breaking layout inside fixed-height OG cards.
 */
export function truncateText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(1, maxLength - 1)).trimEnd()}…`;
}

/**
 * Extracts a clean display hostname from a link URL for OG preview cards.
 */
export function extractDomain(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return rawUrl.replace(/^https?:\/\//, "").split("/")[0] || "mylink";
  }
}

/**
 * Shared TDS brand signature rendered across general and dynamic OG images.
 */
export function OgBrandMark({ compact = false }: { compact?: boolean }) {
  const dotSize = compact ? 11 : 14;
  const fontSize = compact ? 18 : 22;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 8 : 10,
      }}
    >
      <div
        style={{
          display: "flex",
          width: dotSize,
          height: dotSize,
          borderRadius: 999,
          backgroundColor: OG_COLORS.blue500,
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: OG_COLORS.grey900,
        }}
      >
        MYLINK
      </div>
    </div>
  );
}

/**
 * Satori-compatible inline SVG icons matching `LinkIcon` presets.
 */
export function OgLinkSvgIcon({
  name = "link",
  size = 20,
  color = OG_COLORS.blue500,
}: {
  name?: string;
  size?: number;
  color?: string;
}) {
  const normalized = name.toLowerCase().trim();
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (normalized) {
    case "github":
      return (
        <svg {...commonProps}>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    case "blog":
    case "velog":
    case "file-text":
    case "resume":
      return (
        <svg {...commonProps}>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </svg>
      );
    case "portfolio":
    case "folder":
      return (
        <svg {...commonProps}>
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
      );
    case "email":
    case "mail":
      return (
        <svg {...commonProps}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "coffee":
      return (
        <svg {...commonProps}>
          <path d="M10 2v2" />
          <path d="M14 2v2" />
          <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
          <path d="M6 2v2" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...commonProps}>
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3v6Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...commonProps}>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      );
    case "message-circle":
    case "chat":
    case "kakao":
      return (
        <svg {...commonProps}>
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      );
    case "linkedin":
    case "twitter":
    case "x":
    case "website":
    case "globe":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...commonProps}>
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      );
  }
}
