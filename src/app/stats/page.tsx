import type { Metadata } from "next";
import { StatsPageClient } from "@/components/mylink";
import { SITE_NAME, buildSocialMetadata } from "@/lib/seo";

const STATS_TITLE = "링크 통계";
const STATS_FULL_TITLE = `${STATS_TITLE} | ${SITE_NAME}`;
const STATS_DESCRIPTION =
  "내 마이링크에 모인 총 클릭수와 링크별 성과를 차트와 순위로 한눈에 확인해 보세요.";

export const metadata: Metadata = {
  title: STATS_TITLE,
  description: STATS_DESCRIPTION,
  alternates: {
    canonical: "/stats",
  },
  robots: {
    index: false,
    follow: false,
  },
  ...buildSocialMetadata({
    title: STATS_FULL_TITLE,
    description: STATS_DESCRIPTION,
    url: "/stats",
    images: ["/opengraph-image"],
  }),
};

export default function StatsPage() {
  return <StatsPageClient />;
}
