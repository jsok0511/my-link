"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Link2,
  MousePointerClick,
  Plus,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BottomCTA,
  LinkClickChart,
  LinkIcon,
  Toast,
  TopBar,
} from "@/components/mylink";
import { computeLinkStats } from "@/lib/link-stats";
import { useCurrentUserProfileData } from "@/lib/use-mylink-queries";
import { useMyLinkStore } from "@/store/useMyLinkStore";

const emptySubscribe = () => () => {};
const useHasMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
};

function StatsLoadingSkeleton() {
  return (
    <div className="pt-6 space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded-lg bg-[#E5E8EB]" />
        <div className="h-7 w-36 animate-pulse rounded-lg bg-[#E5E8EB]" />
        <div className="h-4 w-56 animate-pulse rounded-lg bg-[#F2F4F6]" />
      </div>
      <div className="h-40 w-full animate-pulse rounded-[24px] border border-[#E5E8EB] bg-white" />
      <div className="h-[296px] w-full animate-pulse rounded-[24px] border border-[#E5E8EB] bg-white" />
      <div className="h-48 w-full animate-pulse rounded-[24px] border border-[#E5E8EB] bg-white" />
    </div>
  );
}

/**
 * Interactive link click statistics view for signed-in users on `/stats`.
 */
export function StatsPageClient() {
  const router = useRouter();
  const hasMounted = useHasMounted();
  const authLoading = useMyLinkStore((state) => state.authLoading);
  const {
    user,
    links,
    isLinksLoading,
    isLinksError,
    refetchLinks,
  } = useCurrentUserProfileData();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const isAuthReady = hasMounted && !authLoading;

  useEffect(() => {
    if (isAuthReady && !user) {
      router.replace("/");
    }
  }, [isAuthReady, user, router]);

  const stats = useMemo(() => computeLinkStats(links), [links]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] font-sans antialiased selection:bg-[#E8F3FF] selection:text-[#3182F6]">
      <TopBar onShowToast={showToast} />

      <main className="mx-auto w-full max-w-md px-4 sm:max-w-lg sm:px-6 pb-10">
        {!isAuthReady || !user ? (
          <StatsLoadingSkeleton />
        ) : (
          <>
            {/* Page Header */}
            <section className="pt-6 pb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-lg py-1 text-[13px] font-medium text-[#6B7684] transition-colors hover:text-[#191F28] no-underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>내 링크로 돌아가기</span>
              </Link>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F3FF] text-[#3182F6]">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <h1 className="text-[22px] font-bold tracking-tight text-[#191F28]">
                  링크 통계
                </h1>
              </div>
              <p className="mt-1.5 text-[14px] text-[#6B7684] break-keep">
                내 마이링크에 모인 총 클릭수와 링크별 성과를 한눈에 확인해 보세요.
              </p>
            </section>

            {isLinksLoading ? (
              <div className="space-y-4">
                <div className="h-40 w-full animate-pulse rounded-[24px] border border-[#E5E8EB] bg-white" />
                <div className="h-[296px] w-full animate-pulse rounded-[24px] border border-[#E5E8EB] bg-white" />
              </div>
            ) : isLinksError ? (
              <Card className="rounded-[24px] border border-[#E5E8EB] bg-white p-6 text-center shadow-2xs">
                <p className="text-[14px] font-medium text-[#4E5968]">
                  통계 데이터를 불러오지 못했어요.
                </p>
                <div className="mt-3 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void refetchLinks()}
                    className="rounded-xl border-[#E5E8EB] text-[13px] font-semibold text-[#333D4B] hover:bg-[#F2F4F6] cursor-pointer"
                  >
                    다시 시도
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* 1. Primary KPI Card: Total Clicks */}
                <Card className="rounded-[24px] border border-[#E5E8EB] bg-white p-5 sm:p-6 shadow-2xs gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7684]">
                      <MousePointerClick className="h-4 w-4 text-[#3182F6]" />
                      총 클릭수
                    </span>
                    <Badge
                      variant="secondary"
                      className="rounded-full border-0 bg-[#E8F3FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#3182F6] hover:bg-[#E8F3FF] tabular-nums"
                    >
                      전체 링크 {stats.totalLinks}개 합산
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[34px] sm:text-[38px] font-bold leading-none tracking-tight text-[#191F28] tabular-nums">
                      {stats.totalClicks.toLocaleString("ko-KR")}
                    </span>
                    <span className="text-[18px] font-bold text-[#4E5968]">
                      회
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="rounded-2xl bg-[#F9FAFB] px-3.5 py-3 border border-[#F2F4F6]">
                      <span className="text-[12px] font-medium text-[#8B95A1]">
                        활성 링크
                      </span>
                      <p className="mt-1 text-[16px] font-bold text-[#191F28] tabular-nums">
                        {stats.activeLinks.toLocaleString("ko-KR")}개
                        <span className="ml-1 text-[12px] font-medium text-[#8B95A1]">
                          / {stats.totalLinks}개
                        </span>
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F9FAFB] px-3.5 py-3 border border-[#F2F4F6]">
                      <span className="text-[12px] font-medium text-[#8B95A1]">
                        링크당 평균 클릭
                      </span>
                      <p className="mt-1 text-[16px] font-bold text-[#191F28] tabular-nums">
                        {stats.averageClicks.toLocaleString("ko-KR")}회
                      </p>
                    </div>
                  </div>

                  {stats.topLink && (
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#E8F3FF]/60 px-3.5 py-2.5">
                      <div className="flex min-w-0 items-center gap-2">
                        <Trophy className="h-4 w-4 shrink-0 text-[#3182F6]" />
                        <span className="shrink-0 text-[12px] font-semibold text-[#3182F6]">
                          인기 1위
                        </span>
                        <span className="truncate text-[13px] font-semibold text-[#191F28]">
                          {stats.topLink.title}
                        </span>
                      </div>
                      <span className="shrink-0 text-[13px] font-bold text-[#3182F6] tabular-nums">
                        {stats.topLink.clickCount.toLocaleString("ko-KR")}회
                      </span>
                    </div>
                  )}
                </Card>

                {/* 2. Chart & Detailed Breakdown */}
                {stats.totalLinks === 0 ? (
                  <Card className="rounded-[24px] border border-dashed border-[#E5E8EB] bg-white p-8 text-center shadow-2xs gap-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2F4F6] text-[#6B7684]">
                      <Link2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#191F28]">
                        아직 등록된 링크가 없어요
                      </p>
                      <p className="mt-1 text-[13px] text-[#8B95A1] break-keep">
                        첫 번째 링크를 추가하면 이곳에서 클릭 통계를 바로 확인할 수 있어요.
                      </p>
                    </div>
                    <div className="pt-1">
                      <Button
                        type="button"
                        onClick={() => router.push("/")}
                        className="h-11 rounded-2xl bg-[#3182F6] px-5 text-[14px] font-bold text-white hover:bg-[#1B64DA] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Plus className="mr-1.5 h-4 w-4" />
                        링크 추가하러 가기
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <>
                    {/* shadcn BarChart */}
                    <LinkClickChart
                      data={stats.chartData}
                      totalLinks={stats.totalLinks}
                      totalClicks={stats.totalClicks}
                    />

                    {/* Detailed Ranked Breakdown */}
                    <Card className="rounded-[24px] border border-[#E5E8EB] bg-white p-5 sm:p-6 shadow-2xs gap-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[16px] font-bold tracking-tight text-[#191F28]">
                          링크별 상세 클릭수
                        </h2>
                        <span className="text-[12px] font-medium text-[#8B95A1] tabular-nums">
                          총 {stats.totalLinks}개
                        </span>
                      </div>

                      <ul className="space-y-3">
                        {stats.rankedLinks.map((entry) => {
                          const isTop =
                            entry.rank === 1 && entry.clickCount > 0;
                          return (
                            <li
                              key={entry.id}
                              className="rounded-2xl border border-[#F2F4F6] bg-[#F9FAFB]/70 p-3.5"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <span
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold tabular-nums ${
                                      isTop
                                        ? "bg-[#E8F3FF] text-[#3182F6]"
                                        : "bg-[#F2F4F6] text-[#6B7684]"
                                    }`}
                                  >
                                    {entry.rank}
                                  </span>

                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E5E8EB] text-[#333D4B]">
                                    <LinkIcon
                                      name={entry.icon}
                                      className="h-4 w-4"
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="truncate text-[14px] font-semibold text-[#191F28]">
                                        {entry.title}
                                      </span>
                                      {!entry.enabled && (
                                        <span className="shrink-0 rounded-full bg-[#F2F4F6] px-2 py-0.5 text-[10px] font-semibold text-[#8B95A1]">
                                          숨김
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="shrink-0 text-right tabular-nums">
                                  <span
                                    className={`text-[14px] font-bold ${
                                      isTop
                                        ? "text-[#3182F6]"
                                        : "text-[#191F28]"
                                    }`}
                                  >
                                    {entry.clickCount.toLocaleString("ko-KR")}회
                                  </span>
                                  <span className="ml-1.5 text-[12px] font-medium text-[#8B95A1]">
                                    ({entry.sharePercent}%)
                                  </span>
                                </div>
                              </div>

                              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E8EB]">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isTop ? "bg-[#3182F6]" : "bg-[#B0B8C1]"
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.max(0, entry.sharePercent))}%`,
                                  }}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </Card>
                  </>
                )}
              </div>
            )}

            <BottomCTA
              label="내 링크 관리하기"
              onAction={() => router.push("/")}
            />
          </>
        )}
      </main>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
