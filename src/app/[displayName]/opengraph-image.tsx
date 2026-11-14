import { ImageResponse } from "next/og";
import {
  fetchUserByDisplayName,
  safeDecodeDisplayName,
} from "@/lib/firestore-users";
import { fetchUserLinks } from "@/lib/firestore-links";
import {
  OG_COLORS,
  OG_FONT_FAMILY,
  OG_SIZE,
  OgBrandMark,
  OgLinkSvgIcon,
  extractDomain,
  fetchAvatarDataUrl,
  loadOgFonts,
  truncateText,
} from "@/lib/og-utils";

export const dynamic = "force-dynamic";
export const alt = "MyLink 사용자 프로필";
export const size = OG_SIZE;
export const contentType = "image/png";

function renderNotFoundFallback(
  rawDisplayName: string,
  fonts: Awaited<ReturnType<typeof loadOgFonts>>
) {
  const decoded = truncateText(safeDecodeDisplayName(rawDisplayName), 22);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: OG_COLORS.grey50,
          fontFamily: OG_FONT_FAMILY,
          padding: "46px 56px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 999,
            backgroundColor: OG_COLORS.blue50,
            opacity: 0.85,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <OgBrandMark />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: OG_COLORS.white,
              border: `1px solid ${OG_COLORS.grey200}`,
              borderRadius: 999,
              padding: "9px 18px",
              fontSize: 16,
              color: OG_COLORS.grey600,
            }}
          >
            <span>mylink / {decoded || "profile"}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: OG_COLORS.white,
            borderRadius: 32,
            border: `1px solid ${OG_COLORS.grey200}`,
            padding: "56px 48px",
            boxShadow: "0 20px 48px rgba(25, 31, 40, 0.06)",
            gap: 16,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 72,
              height: 72,
              borderRadius: 24,
              backgroundColor: OG_COLORS.blue50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OgLinkSvgIcon
              name="link"
              size={32}
              color={OG_COLORS.blue500}
            />
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 700,
              color: OG_COLORS.grey900,
              letterSpacing: "-0.025em",
            }}
          >
            페이지를 찾을 수 없어요
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 500,
              color: OG_COLORS.grey600,
            }}
          >
            MyLink에서 10초 만에 나만의 링크 허브를 만들어 보세요.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <span style={{ fontSize: 16, color: OG_COLORS.grey600 }}>
            흩어진 내 모든 링크, 하나의 주소로
          </span>
          <span
            style={{ fontSize: 16, fontWeight: 700, color: OG_COLORS.blue500 }}
          >
            MyLink 시작하기 →
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName } = await params;

  const userProfile = await fetchUserByDisplayName(displayName).catch(
    () => null
  );

  if (!userProfile) {
    const fallbackFonts = await loadOgFonts(
      `MYLINK 페이지를 찾을 수 없어요 MyLink에서 10초 만에 나만의 링크 허브를 만들어 보세요. 흩어진 내 모든 링크, 하나의 주소로 MyLink 시작하기 → ${safeDecodeDisplayName(
        displayName
      )}`
    );
    return renderNotFoundFallback(displayName, fallbackFonts);
  }

  const [allLinks, avatarDataUrl] = await Promise.all([
    fetchUserLinks(userProfile.uid).catch(() => []),
    fetchAvatarDataUrl(userProfile.photoURL),
  ]);

  const activeLinks = allLinks.filter((link) => link.enabled !== false);
  const previewLinks = activeLinks.slice(0, 3);
  const remainingCount = Math.max(0, activeLinks.length - previewLinks.length);

  const nameText = truncateText(userProfile.displayName, 20);
  const handleText = truncateText(`@${userProfile.displayName}`, 24);
  const urlSlugText = truncateText(userProfile.displayName, 22);
  const bioText = truncateText(
    userProfile.bio || `${userProfile.displayName}님의 마이링크 페이지예요.`,
    68
  );
  const avatarInitials = userProfile.displayName.slice(0, 2);

  const linkTexts = previewLinks.flatMap((link) => [
    truncateText(link.title, 22),
    extractDomain(link.url),
    link.badge ? truncateText(link.badge, 10) : "",
  ]);

  const fontText = [
    "MYLINK",
    "LINK HUB",
    "mylink /",
    urlSlugText,
    nameText,
    handleText,
    bioText,
    avatarInitials,
    `등록된 링크 ${activeLinks.length}개`,
    "대표 링크",
    `${activeLinks.length}개`,
    ...linkTexts,
    remainingCount > 0 ? `+ ${remainingCount}개의 링크 더 보기` : "",
    activeLinks.length === 0 ? "아직 등록된 링크가 없어요" : "",
    "흩어진 내 모든 링크, 하나의 주소로",
    "MyLink에서 바로 만나보세요 →",
  ].join(" ");

  const fonts = await loadOgFonts(fontText);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundColor: OG_COLORS.grey50,
          fontFamily: OG_FONT_FAMILY,
          padding: "42px 54px",
          overflow: "hidden",
        }}
      >
        {/* Subtle TDS Ambient Background Glows */}
        <div
          style={{
            position: "absolute",
            top: -170,
            right: -110,
            width: 540,
            height: 540,
            borderRadius: 999,
            backgroundColor: OG_COLORS.blue50,
            opacity: 0.9,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -190,
            left: -130,
            width: 440,
            height: 440,
            borderRadius: 999,
            backgroundColor: OG_COLORS.blue50,
            opacity: 0.6,
            display: "flex",
          }}
        />

        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <OgBrandMark />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              backgroundColor: OG_COLORS.white,
              border: `1px solid ${OG_COLORS.grey200}`,
              borderRadius: 999,
              padding: "9px 18px",
              boxShadow: "0 2px 10px rgba(25, 31, 40, 0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 8,
                height: 8,
                borderRadius: 999,
                backgroundColor: OG_COLORS.blue500,
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 16,
              }}
            >
              <span style={{ color: OG_COLORS.grey500, fontWeight: 500 }}>
                mylink /
              </span>
              <span style={{ color: OG_COLORS.grey900, fontWeight: 700 }}>
                {urlSlugText}
              </span>
            </div>
          </div>
        </div>

        {/* Center Unified TDS Profile Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            backgroundColor: OG_COLORS.white,
            borderRadius: 32,
            border: `1px solid ${OG_COLORS.grey200}`,
            padding: "36px 40px",
            boxShadow: "0 20px 48px rgba(25, 31, 40, 0.07)",
            gap: 36,
            height: 416,
            position: "relative",
          }}
        >
          {/* Left Column: Profile Identity */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 470,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {/* Avatar + Hub Pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 96,
                    height: 96,
                    borderRadius: 999,
                    backgroundColor: OG_COLORS.blue50,
                    border: `3px solid ${OG_COLORS.white}`,
                    boxShadow: `0 0 0 1px ${OG_COLORS.grey200}`,
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {avatarDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarDataUrl}
                      alt={nameText}
                      width={96}
                      height={96}
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: 999,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 700,
                        color: OG_COLORS.blue500,
                      }}
                    >
                      {avatarInitials}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: OG_COLORS.blue50,
                    color: OG_COLORS.blue500,
                    borderRadius: 999,
                    padding: "7px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  <OgLinkSvgIcon
                    name="sparkles"
                    size={14}
                    color={OG_COLORS.blue500}
                  />
                  <span>LINK HUB</span>
                </div>
              </div>

              {/* Name + Handle */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 40,
                    fontWeight: 700,
                    color: OG_COLORS.grey900,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.18,
                  }}
                >
                  {nameText}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    fontWeight: 500,
                    color: OG_COLORS.blue500,
                  }}
                >
                  {handleText}
                </div>
              </div>

              {/* Bio */}
              <div
                style={{
                  display: "flex",
                  fontSize: 19,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: OG_COLORS.grey700,
                }}
              >
                {bioText}
              </div>
            </div>

            {/* Link Count Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: OG_COLORS.grey100,
                  borderRadius: 999,
                  padding: "7px 14px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: OG_COLORS.grey700,
                }}
              >
                <OgLinkSvgIcon
                  name="link"
                  size={15}
                  color={OG_COLORS.blue500}
                />
                <span>등록된 링크 {activeLinks.length}개</span>
              </div>
            </div>
          </div>

          {/* Subtle Vertical Divider */}
          <div
            style={{
              display: "flex",
              width: 1,
              backgroundColor: OG_COLORS.grey200,
            }}
          />

          {/* Right Column: Link Cards Preview */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: OG_COLORS.grey600,
                }}
              >
                대표 링크
              </span>
              <div
                style={{
                  display: "flex",
                  backgroundColor: OG_COLORS.blue50,
                  color: OG_COLORS.blue500,
                  borderRadius: 999,
                  padding: "4px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {activeLinks.length}개
              </div>
            </div>

            {previewLinks.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                {previewLinks.map((link) => {
                  const linkTitle = truncateText(link.title, 22);
                  const linkDomain = truncateText(extractDomain(link.url), 28);
                  const linkBadge = link.badge
                    ? truncateText(link.badge, 10)
                    : null;

                  return (
                    <div
                      key={link.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: OG_COLORS.grey50,
                        border: `1px solid ${OG_COLORS.grey200}`,
                        borderRadius: 18,
                        padding: "14px 18px",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: 42,
                            height: 42,
                            borderRadius: 13,
                            backgroundColor: OG_COLORS.blue50,
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <OgLinkSvgIcon
                            name={link.icon}
                            size={19}
                            color={OG_COLORS.blue500}
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: OG_COLORS.grey900,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {linkTitle}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: OG_COLORS.grey500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {linkDomain}
                          </span>
                        </div>
                      </div>

                      {linkBadge ? (
                        <div
                          style={{
                            display: "flex",
                            backgroundColor: OG_COLORS.blue50,
                            color: OG_COLORS.blue500,
                            borderRadius: 999,
                            padding: "4px 11px",
                            fontSize: 12,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {linkBadge}
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: 22,
                            fontWeight: 500,
                            color: OG_COLORS.grey400,
                            flexShrink: 0,
                          }}
                        >
                          ›
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: OG_COLORS.grey50,
                  border: `1px dashed ${OG_COLORS.grey200}`,
                  borderRadius: 20,
                  marginTop: 14,
                  marginBottom: 14,
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: OG_COLORS.blue50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <OgLinkSvgIcon
                    name="link"
                    size={20}
                    color={OG_COLORS.blue500}
                  />
                </div>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: OG_COLORS.grey500,
                  }}
                >
                  아직 등록된 링크가 없어요
                </span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                minHeight: 20,
              }}
            >
              {remainingCount > 0 && (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: OG_COLORS.grey600,
                  }}
                >
                  + {remainingCount}개의 링크 더 보기
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: OG_COLORS.grey600,
            }}
          >
            흩어진 내 모든 링크, 하나의 주소로
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: OG_COLORS.blue500,
            }}
          >
            MyLink에서 바로 만나보세요 →
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length > 0 ? { fonts } : {}),
    }
  );
}
