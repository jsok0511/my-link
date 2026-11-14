import type { LinkItem } from "@/types/mylink";

export interface LinkStatEntry {
  id: string;
  title: string;
  shortTitle: string;
  url: string;
  icon: string;
  badge?: string;
  category?: LinkItem["category"];
  enabled: boolean;
  clickCount: number;
  sharePercent: number;
  rank: number;
}

export interface LinkStatsSummary {
  totalClicks: number;
  totalLinks: number;
  activeLinks: number;
  averageClicks: number;
  topLink: LinkStatEntry | null;
  rankedLinks: LinkStatEntry[];
  chartData: LinkStatEntry[];
}

const MAX_CHART_ITEMS = 8;

/**
 * Normalizes a link's raw `clickCount` into a safe non-negative integer.
 */
export function normalizeClickCount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }
  return 0;
}

/**
 * Truncates long link titles for compact chart axis labels.
 */
export function truncateChartLabel(label: string, maxLength = 8): string {
  const trimmed = label.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength - 1)}…`;
}

/**
 * Aggregates click statistics across all of a user's links.
 */
export function computeLinkStats(links: LinkItem[]): LinkStatsSummary {
  const totalLinks = links.length;
  const activeLinks = links.filter((link) => link.enabled).length;

  const normalized = links.map((link) => ({
    link,
    clickCount: normalizeClickCount(link.clickCount),
  }));

  const totalClicks = normalized.reduce((sum, entry) => sum + entry.clickCount, 0);
  const averageClicks =
    totalLinks > 0 ? Math.round((totalClicks / totalLinks) * 10) / 10 : 0;

  const sorted = [...normalized].sort((a, b) => b.clickCount - a.clickCount);

  const rankedLinks: LinkStatEntry[] = sorted.map(({ link, clickCount }, index) => {
    const sharePercent =
      totalClicks > 0 ? Math.round((clickCount / totalClicks) * 1000) / 10 : 0;
    const title = link.title.trim() || "제목 없는 링크";

    return {
      id: link.id,
      title,
      shortTitle: truncateChartLabel(title),
      url: link.url,
      icon: link.icon ?? "link",
      badge: link.badge,
      category: link.category,
      enabled: link.enabled,
      clickCount,
      sharePercent,
      rank: index + 1,
    };
  });

  const topLink =
    rankedLinks.length > 0 && rankedLinks[0].clickCount > 0
      ? rankedLinks[0]
      : null;

  const chartData = rankedLinks.slice(0, MAX_CHART_ITEMS);

  return {
    totalClicks,
    totalLinks,
    activeLinks,
    averageClicks,
    topLink,
    rankedLinks,
    chartData,
  };
}
