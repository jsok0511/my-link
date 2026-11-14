import { ImageResponse } from "next/og";
import {
  OG_COLORS,
  OG_FONT_FAMILY,
  OG_SIZE,
  OgBrandMark,
  OgLinkSvgIcon,
  loadOgFonts,
} from "@/lib/og-utils";

export const alt = "MyLink | 흩어진 내 모든 링크, 하나의 주소로";
export const size = OG_SIZE;
export const contentType = "image/png";

const FEATURE_PILLS = [
  "Google 3초 로그인",
  "실시간 클릭 통계",
  "모바일 최적화",
];

const SERVICE_CARDS = [
  {
    title: "흩어진 링크를 한곳에",
    subtitle: "블로그 · 포트폴리오 · GitHub · 커피챗",
    badge: "카테고리 정리",
    icon: "link",
  },
  {
    title: "한눈에 보는 클릭 통계",
    subtitle: "링크별 인기 순위와 총 클릭수 분석",
    badge: "실시간 차트",
    icon: "sparkles",
  },
  {
    title: "나만의 짧은 주소 공유",
    subtitle: "mylink / 내-닉네임 으로 바로 연결",
    badge: "10초 완성",
    icon: "globe",
  },
];

export default async function Image() {
  const fontText = [
    "MYLINK",
    "10초 만에 완성하는 나만의 링크 허브",
    "흩어진 내 모든 링크, 하나의 페이지로 딱.",
    "블로그, GitHub, 포트폴리오부터 1:1 커피챗까지",
    "Google 로그인 한 번으로 깔끔하게 정리해요.",
    ...FEATURE_PILLS,
    "mylink / your-handle",
    ...SERVICE_CARDS.flatMap((c) => [c.title, c.subtitle, c.badge]),
    "Google로 무료 시작하기 →",
  ].join(" ");

  const fonts = await loadOgFonts(fontText);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: OG_COLORS.grey50,
          fontFamily: OG_FONT_FAMILY,
          padding: "54px 60px",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        {/* Subtle TDS Ambient Background Glows */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: 999,
            backgroundColor: OG_COLORS.blue50,
            opacity: 0.9,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -140,
            width: 440,
            height: 440,
            borderRadius: 999,
            backgroundColor: OG_COLORS.blue50,
            opacity: 0.55,
            display: "flex",
          }}
        />

        {/* Left Copy Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 590,
            height: "100%",
            position: "relative",
          }}
        >
          {/* Top Brand + Pill */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <OgBrandMark />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: OG_COLORS.blue50,
                color: OG_COLORS.blue500,
                borderRadius: 999,
                padding: "9px 18px",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              <OgLinkSvgIcon
                name="sparkles"
                size={18}
                color={OG_COLORS.blue500}
              />
              <span>10초 만에 완성하는 나만의 링크 허브</span>
            </div>
          </div>

          {/* Main Headline & Subcopy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 52,
                fontWeight: 700,
                lineHeight: 1.24,
                letterSpacing: "-0.03em",
                color: OG_COLORS.grey900,
              }}
            >
              <span>흩어진 내 모든 링크,</span>
              <div style={{ display: "flex" }}>
                <span style={{ color: OG_COLORS.blue500 }}>하나의 페이지</span>
                <span>로 딱.</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 21,
                fontWeight: 500,
                lineHeight: 1.5,
                color: OG_COLORS.grey700,
              }}
            >
              <span>블로그, GitHub, 포트폴리오부터 1:1 커피챗까지</span>
              <span>Google 로그인 한 번으로 깔끔하게 정리해요.</span>
            </div>
          </div>

          {/* Bottom Feature Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {FEATURE_PILLS.map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: OG_COLORS.white,
                  border: `1px solid ${OG_COLORS.grey200}`,
                  borderRadius: 999,
                  padding: "9px 16px",
                  fontSize: 16,
                  fontWeight: 500,
                  color: OG_COLORS.grey800,
                  boxShadow: "0 2px 8px rgba(25, 31, 40, 0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    backgroundColor: OG_COLORS.blue500,
                  }}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Showcase Card (Service Overview Card without any personal name) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 444,
            backgroundColor: OG_COLORS.white,
            borderRadius: 32,
            border: `1px solid ${OG_COLORS.grey200}`,
            padding: "26px 26px 24px 26px",
            boxShadow: "0 20px 48px rgba(25, 31, 40, 0.08)",
            position: "relative",
            gap: 16,
          }}
        >
          {/* Generic URL Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: OG_COLORS.grey50,
              border: `1px solid ${OG_COLORS.grey200}`,
              borderRadius: 14,
              padding: "11px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 15,
              }}
            >
              <span style={{ color: OG_COLORS.grey500, fontWeight: 500 }}>
                mylink /
              </span>
              <span style={{ color: OG_COLORS.blue500, fontWeight: 700 }}>
                your-handle
              </span>
            </div>
            <div
              style={{
                display: "flex",
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: OG_COLORS.blue500,
              }}
            />
          </div>

          {/* Service Feature Cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 11,
            }}
          >
            {SERVICE_CARDS.map((card) => (
              <div
                key={card.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: OG_COLORS.grey50,
                  border: `1px solid ${OG_COLORS.grey200}`,
                  borderRadius: 18,
                  padding: "15px 16px",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: OG_COLORS.blue50,
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <OgLinkSvgIcon
                      name={card.icon}
                      size={19}
                      color={OG_COLORS.blue500}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: OG_COLORS.grey900,
                      }}
                    >
                      {card.title}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: OG_COLORS.grey500,
                      }}
                    >
                      {card.subtitle}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    backgroundColor: OG_COLORS.blue50,
                    color: OG_COLORS.blue500,
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: 11.5,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {card.badge}
                </div>
              </div>
            ))}
          </div>

          {/* Primary CTA Bar */}
          <div
            style={{
              display: "flex",
              height: 48,
              width: "100%",
              borderRadius: 16,
              backgroundColor: OG_COLORS.blue500,
              color: OG_COLORS.white,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Google로 무료 시작하기 →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  );
}
