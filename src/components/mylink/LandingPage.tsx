"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  BarChart3,
  Check,
  Copy,
  Layers,
  MonitorSmartphone,
  PencilLine,
  Plus,
  Share2,
  Sparkles,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGoogleAuth } from "@/lib/use-google-auth";
import { GoogleIcon } from "./GoogleIcon";
import { LinkIcon } from "./LinkIcon";
import {
  LANDING_PERSONAS,
  LandingPhonePreview,
  type LandingPersonaId,
} from "./LandingPhonePreview";

interface LandingPageProps {
  onShowToast: (msg: string) => void;
}

type DemoCategory = "all" | "dev" | "career" | "social";

interface BentoSampleLink {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<DemoCategory, "all">;
  icon: string;
  badge: string;
}

const BENTO_SAMPLE_LINKS: BentoSampleLink[] = [
  {
    id: "sample-github",
    title: "GitHub 오픈소스 저장소",
    subtitle: "진행 중인 사이드 프로젝트 코드 모음",
    category: "dev",
    icon: "github",
    badge: "개발",
  },
  {
    id: "sample-portfolio",
    title: "2026 웹 포트폴리오",
    subtitle: "주요 프로젝트와 UI 개선 회고록",
    category: "career",
    icon: "portfolio",
    badge: "커리어",
  },
  {
    id: "sample-youtube",
    title: "YouTube 개발 & 작업 브이로그",
    subtitle: "매주 올리는 코딩 타임랩스 영상",
    category: "social",
    icon: "youtube",
    badge: "소셜",
  },
];

const DEMO_CATEGORIES: { id: DemoCategory; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "dev", label: "개발" },
  { id: "career", label: "커리어" },
  { id: "social", label: "소셜" },
];

const CHART_DEMO_BARS = [
  { id: "portfolio", label: "포트폴리오", clicks: 58, heightPercent: 100 },
  { id: "blog", label: "기술 블로그", clicks: 42, heightPercent: 72 },
  { id: "github", label: "GitHub", clicks: 31, heightPercent: 53 },
  { id: "coffee", label: "커피챗", clicks: 19, heightPercent: 33 },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Google로 3초 로그인",
    description:
      "복잡한 회원가입이나 비밀번호 없이 기존 Google 계정으로 바로 내 공간을 만들어요.",
  },
  {
    step: "02",
    title: "링크와 소개 채우기",
    description:
      "한 줄 소개, 자주 쓰는 링크, 카테고리까지 원하는 대로 깔끔하게 정리해요.",
  },
  {
    step: "03",
    title: "공유하고 클릭 확인하기",
    description:
      "내 전용 주소를 인스타·GitHub·이력서에 올리고 실시간 클릭 통계를 확인해요.",
  },
];

const USE_CASE_PILLS = [
  "🎓 대학생 포트폴리오",
  "🚀 사이드 프로젝트 홍보",
  "💻 개발자 기술 블로그 허브",
  "☕ 1:1 커피챗 신청 창구",
  "🎨 디자이너 작업물 아카이브",
  "📱 SNS 통합 프로필 링크",
];

/**
 * Interactive, responsive TDS-styled landing page shown on `/` when signed out.
 */
export function LandingPage({ onShowToast }: LandingPageProps) {
  const { isSigningIn, handleSignIn } = useGoogleAuth({ onShowToast });
  const [customHandle, setCustomHandle] = useState("");
  const [activePersonaId, setActivePersonaId] =
    useState<LandingPersonaId>("coder");
  const [bentoCategory, setBentoCategory] = useState<DemoCategory>("all");
  const [selectedBarId, setSelectedBarId] = useState<string>("portfolio");
  const [urlCopied, setUrlCopied] = useState(false);

  const activePersona = useMemo(
    () =>
      LANDING_PERSONAS.find((item) => item.id === activePersonaId) ??
      LANDING_PERSONAS[0],
    [activePersonaId]
  );

  const effectiveHandle = customHandle.trim() || activePersona.defaultHandle;

  const filteredBentoLinks = useMemo(() => {
    if (bentoCategory === "all") return BENTO_SAMPLE_LINKS;
    return BENTO_SAMPLE_LINKS.filter((item) => item.category === bentoCategory);
  }, [bentoCategory]);

  const selectedBar = useMemo(
    () =>
      CHART_DEMO_BARS.find((bar) => bar.id === selectedBarId) ??
      CHART_DEMO_BARS[0],
    [selectedBarId]
  );

  const handleCopyPreviewUrl = async () => {
    const shareText =
      typeof window !== "undefined"
        ? `${window.location.origin}/${encodeURIComponent(effectiveHandle)}`
        : `mylink/${effectiveHandle}`;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
      setUrlCopied(true);
      onShowToast(`내 예시 주소(${effectiveHandle})가 복사되었어요`);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch {
      onShowToast("주소 복사에 실패했어요");
    }
  };

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* 1. Hero Section */}
      <section
        id="preview"
        className="pt-6 sm:pt-10 lg:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center"
      >
        {/* Left Copy & Interactive Handle Builder */}
        <div className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F3FF] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#3182F6]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>10초 만에 완성하는 나만의 링크 허브</span>
          </div>

          <h1 className="mt-4 text-[30px] sm:text-[38px] lg:text-[42px] font-bold leading-[1.24] tracking-tight text-[#191F28] break-keep">
            흩어진 내 모든 링크,
            <br />
            <span className="text-[#3182F6]">하나의 페이지</span>로 딱.
          </h1>

          <p className="mt-3.5 max-w-lg text-[15px] sm:text-[17px] leading-relaxed text-[#4E5968] break-keep">
            블로그, GitHub, 포트폴리오부터 1:1 커피챗까지.
            <br className="hidden sm:inline" /> 복잡한 꾸미기 없이 Google 로그인 한
            번으로 깔끔하게 정리해요.
          </p>

          {/* Interactive Handle Previewer */}
          <div className="mt-6 w-full max-w-md rounded-[22px] border border-[#E5E8EB] bg-white p-3.5 sm:p-4 shadow-2xs text-left">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label
                htmlFor="landing-handle-input"
                className="text-[12.5px] font-semibold text-[#4E5968]"
              >
                먼저 내 주소를 미리 써볼까요?
              </label>
              <span className="text-[11px] font-medium text-[#3182F6]">
                실시간 미리보기
              </span>
            </div>

            <div className="flex h-12 items-center gap-1.5 rounded-xl border border-[#E5E8EB] bg-[#F9FAFB] px-3.5 transition-all focus-within:border-[#3182F6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3182F6]/15">
              <span className="shrink-0 text-[13.5px] font-semibold text-[#8B95A1]">
                mylink/
              </span>
              <input
                id="landing-handle-input"
                type="text"
                maxLength={24}
                value={customHandle}
                onChange={(e) => setCustomHandle(e.target.value)}
                placeholder={activePersona.defaultHandle}
                className="min-w-0 flex-1 bg-transparent text-[14.5px] font-semibold text-[#191F28] placeholder:text-[#B0B8C1] focus:outline-none"
              />
              {customHandle && (
                <button
                  type="button"
                  onClick={() => setCustomHandle("")}
                  aria-label="입력 초기화"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E5E8EB] text-[#4E5968] hover:bg-[#D1D6DB] cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Quick Fun Persona Chips */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-[#8B95A1] mr-0.5">
                테마 체험:
              </span>
              {LANDING_PERSONAS.map((persona) => {
                const isActive = persona.id === activePersonaId;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setActivePersonaId(persona.id)}
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold transition-all active:scale-95 cursor-pointer ${
                      isActive
                        ? "bg-[#E8F3FF] text-[#3182F6] ring-1 ring-[#3182F6]/25"
                        : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                    }`}
                  >
                    {persona.chipLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="mt-6 flex w-full max-w-md flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <Button
              type="button"
              disabled={isSigningIn}
              onClick={handleSignIn}
              className="flex h-[52px] flex-1 items-center justify-center gap-2.5 rounded-2xl bg-[#3182F6] px-6 text-[15px] font-bold text-white shadow-sm transition-all hover:bg-[#1B64DA] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                <GoogleIcon className="h-3.5 w-3.5" />
              </span>
              <span>
                {isSigningIn ? "Google 로그인 중..." : "Google로 무료 시작하기"}
              </span>
            </Button>

            <a
              href="#features"
              className="inline-flex h-[52px] items-center justify-center gap-1.5 rounded-2xl border border-[#E5E8EB] bg-white px-5 text-[14.5px] font-semibold text-[#333D4B] transition-all hover:bg-[#F2F4F6] active:scale-[0.98] no-underline"
            >
              <span>기능 구경하기</span>
              <ArrowDown className="h-4 w-4 text-[#6B7684]" />
            </a>
          </div>

          <p className="mt-3 text-[12px] font-medium text-[#8B95A1]">
            가입비 0원 · 별도 앱 설치 없이 웹에서 바로 시작해요
          </p>
        </div>

        {/* Right Interactive Phone Preview */}
        <div className="lg:col-span-6">
          <LandingPhonePreview
            customHandle={customHandle}
            activePersonaId={activePersonaId}
            onSelectPersona={setActivePersonaId}
            onShowToast={onShowToast}
          />
        </div>
      </section>

      {/* 2. Quick Highlights Strip */}
      <section aria-label="마이링크 핵심 장점">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="rounded-[22px] border border-[#E5E8EB] bg-white p-5 shadow-2xs flex-row items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F3FF] text-[#3182F6]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#191F28]">
                10초 만에 완성
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[#6B7684] break-keep">
                Google 로그인 한 번으로 나만의 링크 페이지가 바로 열려요.
              </p>
            </div>
          </Card>

          <Card className="rounded-[22px] border border-[#E5E8EB] bg-white p-5 shadow-2xs flex-row items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F3FF] text-[#3182F6]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#191F28]">
                실시간 클릭 통계
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[#6B7684] break-keep">
                어떤 링크가 가장 인기 있는지 차트와 순위로 한눈에 봐요.
              </p>
            </div>
          </Card>

          <Card className="rounded-[22px] border border-[#E5E8EB] bg-white p-5 shadow-2xs flex-row items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F3FF] text-[#3182F6]">
              <MonitorSmartphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-[#191F28]">
                어디서나 완벽한 비율
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[#6B7684] break-keep">
                모바일 인앱 브라우저부터 태블릿, 데스크톱까지 깔끔하게 보여요.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Interactive Bento Feature Grid */}
      <section id="features" className="scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-[#E8F3FF] px-3 py-1 text-[12px] font-semibold text-[#3182F6]"
          >
            FEATURES
          </Badge>
          <h2 className="mt-3 text-[24px] sm:text-[30px] font-bold tracking-tight text-[#191F28] break-keep">
            꼭 필요한 기능만 담아,
            <br className="sm:hidden" /> 쓰는 재미를 더했어요
          </h2>
          <p className="mt-2 text-[14.5px] sm:text-[15.5px] text-[#6B7684] break-keep">
            아래 카드 안의 버튼과 차트를 직접 눌러보며 마이링크를 미리 경험해
            보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
          {/* Bento Card 1: Interactive Category Filtering */}
          <Card className="lg:col-span-3 rounded-[24px] border border-[#E5E8EB] bg-white p-5 sm:p-6 shadow-2xs justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#4E5968]">
                <Layers className="h-3.5 w-3.5 text-[#3182F6]" />
                <span>카테고리 필터</span>
              </div>
              <h3 className="mt-3 text-[19px] font-bold tracking-tight text-[#191F28]">
                카테고리별로 깔끔하게 골라봐요
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#6B7684] break-keep">
                개발, 커리어, 연락처, 소셜까지. 방문자가 궁금한 주제만 탭해서
                빠르게 찾을 수 있어요.
              </p>
            </div>

            {/* Interactive Filter Demo Box */}
            <div className="rounded-2xl border border-[#F2F4F6] bg-[#F9FAFB] p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {DEMO_CATEGORIES.map((cat) => {
                  const isActive = bentoCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setBentoCategory(cat.id)}
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-[12px] font-semibold transition-all active:scale-95 cursor-pointer ${
                        isActive
                          ? "bg-[#191F28] text-white"
                          : "bg-white text-[#4E5968] border border-[#E5E8EB] hover:bg-[#F2F4F6]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                {filteredBentoLinks.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2.5 rounded-xl border border-[#E5E8EB] bg-white px-3 py-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F4F6] text-[#4E5968]">
                        <LinkIcon name={item.icon} className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold text-[#191F28]">
                          {item.title}
                        </p>
                        <p className="truncate text-[11.5px] text-[#8B95A1]">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[11px] font-semibold text-[#3182F6]">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Bento Card 2: Interactive Click Analytics */}
          <Card className="lg:col-span-3 rounded-[24px] border border-[#E5E8EB] bg-white p-5 sm:p-6 shadow-2xs justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#4E5968]">
                <BarChart3 className="h-3.5 w-3.5 text-[#3182F6]" />
                <span>클릭 통계 대시보드</span>
              </div>
              <h3 className="mt-3 text-[19px] font-bold tracking-tight text-[#191F28]">
                인기 링크를 차트로 바로 확인해요
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#6B7684] break-keep">
                총 클릭수와 평균 클릭, 인기 1위 링크까지. 막대를 눌러 각 링크의
                성과를 확인해 보세요.
              </p>
            </div>

            {/* Interactive Mini Bar Chart */}
            <div className="rounded-2xl border border-[#F2F4F6] bg-[#F9FAFB] p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-[#E8F3FF] px-2.5 py-1 text-[11.5px] font-semibold text-[#3182F6]">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>선택됨: {selectedBar.label}</span>
                </div>
                <span className="text-[14px] font-bold text-[#191F28] tabular-nums">
                  {selectedBar.clicks}회 클릭
                </span>
              </div>

              <div className="grid grid-cols-4 items-end gap-2.5 pt-3 h-[126px]">
                {CHART_DEMO_BARS.map((bar) => {
                  const isSelected = bar.id === selectedBar.id;
                  return (
                    <button
                      key={bar.id}
                      type="button"
                      onClick={() => setSelectedBarId(bar.id)}
                      className="group flex h-full flex-col items-center justify-end gap-1.5 cursor-pointer"
                    >
                      <span
                        className={`text-[11px] font-bold tabular-nums transition-colors ${
                          isSelected ? "text-[#3182F6]" : "text-[#8B95A1]"
                        }`}
                      >
                        {bar.clicks}
                      </span>
                      <div className="flex w-full flex-1 items-end">
                        <div
                          style={{ height: `${bar.heightPercent}%` }}
                          className={`w-full rounded-t-xl transition-all duration-200 ${
                            isSelected
                              ? "bg-[#3182F6] shadow-xs"
                              : "bg-[#D1D6DB]/80 group-hover:bg-[#3182F6]/50"
                          }`}
                        />
                      </div>
                      <span
                        className={`truncate max-w-full text-[11px] font-medium ${
                          isSelected ? "text-[#191F28] font-semibold" : "text-[#6B7684]"
                        }`}
                      >
                        {bar.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Bento Card 3: Shareable Personal URL */}
          <Card className="lg:col-span-2 rounded-[24px] border border-[#E5E8EB] bg-white p-5 sm:p-6 shadow-2xs justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#4E5968]">
                <Share2 className="h-3.5 w-3.5 text-[#3182F6]" />
                <span>고유 링크 공유</span>
              </div>
              <h3 className="mt-3 text-[18px] font-bold tracking-tight text-[#191F28]">
                기억하기 쉬운 내 이름 주소
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#6B7684] break-keep">
                내 닉네임으로 된 고유 페이지 주소가 생성되어 SNS 프로필에
                넣기 딱 좋아요.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB] p-2.5">
              <span className="truncate pl-1.5 text-[13px] font-semibold text-[#191F28]">
                mylink/{effectiveHandle}
              </span>
              <button
                type="button"
                onClick={handleCopyPreviewUrl}
                className={`inline-flex shrink-0 items-center gap-1 rounded-xl px-3 py-1.5 text-[12px] font-semibold transition-all active:scale-95 cursor-pointer ${
                  urlCopied
                    ? "bg-[#ECFDF5] text-[#059669]"
                    : "bg-[#191F28] text-white hover:bg-[#333D4B]"
                }`}
              >
                {urlCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* Bento Card 4: Instant Add & Inline Edit */}
          <Card className="lg:col-span-2 rounded-[24px] border border-[#E5E8EB] bg-white p-5 sm:p-6 shadow-2xs justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#4E5968]">
                <PencilLine className="h-3.5 w-3.5 text-[#3182F6]" />
                <span>간편한 관리</span>
              </div>
              <h3 className="mt-3 text-[18px] font-bold tracking-tight text-[#191F28]">
                추가도 수정도 1초 만에
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#6B7684] break-keep">
                새 프로젝트가 생겼을 때 모달로 추가하고, 카드 안에서 바로
                인라인 수정이 가능해요.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-[#F2F4F6] bg-[#F9FAFB] p-3">
              <div className="flex h-9 items-center justify-center gap-1 rounded-xl bg-[#3182F6] text-[12.5px] font-bold text-white">
                <Plus className="h-3.5 w-3.5" />
                <span>새 링크 추가하기</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#E5E8EB] bg-white px-3 py-2">
                <span className="text-[12px] font-medium text-[#4E5968]">
                  제목 수정 중...
                </span>
                <span className="rounded-md bg-[#E8F3FF] px-2 py-0.5 text-[11px] font-semibold text-[#3182F6]">
                  저장
                </span>
              </div>
            </div>
          </Card>

          {/* Bento Card 5: Multi-device Responsive */}
          <Card className="md:col-span-2 lg:col-span-2 rounded-[24px] border border-[#E5E8EB] bg-white p-5 sm:p-6 shadow-2xs justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#F2F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#4E5968]">
                <MonitorSmartphone className="h-3.5 w-3.5 text-[#3182F6]" />
                <span>반응형 디자인</span>
              </div>
              <h3 className="mt-3 text-[18px] font-bold tracking-tight text-[#191F28]">
                모든 화면 크기에 자연스럽게
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#6B7684] break-keep">
                토스 디자인 시스템의 여백과 터치감을 그대로 담아 어떤 기기에서도
                편안해요.
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#F2F4F6] bg-[#F9FAFB] p-3">
              <div className="flex flex-col items-center flex-1 rounded-xl bg-white py-2.5 border border-[#E5E8EB]">
                <span className="text-[14px]">📱</span>
                <span className="mt-1 text-[11px] font-semibold text-[#4E5968]">
                  모바일
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 rounded-xl bg-white py-2.5 border border-[#E5E8EB]">
                <span className="text-[14px]">📲</span>
                <span className="mt-1 text-[11px] font-semibold text-[#4E5968]">
                  태블릿
                </span>
              </div>
              <div className="flex flex-col items-center flex-1 rounded-xl bg-white py-2.5 border border-[#E5E8EB]">
                <span className="text-[14px]">💻</span>
                <span className="mt-1 text-[11px] font-semibold text-[#4E5968]">
                  데스크톱
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. 3-Step Flow */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-8">
          <Badge
            variant="secondary"
            className="rounded-full border-0 bg-[#F2F4F6] px-3 py-1 text-[12px] font-semibold text-[#4E5968]"
          >
            HOW IT WORKS
          </Badge>
          <h2 className="mt-3 text-[24px] sm:text-[28px] font-bold tracking-tight text-[#191F28] break-keep">
            어렵지 않아요, 딱 3단계면 끝나요
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <Card
              key={item.step}
              className="rounded-[24px] border border-[#E5E8EB] bg-white p-6 shadow-2xs gap-3"
            >
              <span className="inline-flex h-8 w-fit items-center rounded-full bg-[#E8F3FF] px-3 text-[12.5px] font-bold text-[#3182F6] tabular-nums">
                STEP {item.step}
              </span>
              <h3 className="text-[17px] font-bold tracking-tight text-[#191F28]">
                {item.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-[#6B7684] break-keep">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Use Cases + Final Dark TDS CTA Banner */}
      <section className="space-y-8">
        <div className="text-center">
          <p className="text-[13px] font-semibold text-[#6B7684]">
            이런 순간에 마이링크가 빛나요
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {USE_CASE_PILLS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-[#E5E8EB] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#333D4B] shadow-2xs"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Final High-Contrast TDS Banner */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#191F28] px-6 py-10 sm:px-10 sm:py-12 text-center text-white shadow-lg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-[#3182F6]/30 blur-3xl"
          />

          <div className="relative mx-auto max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-[#90C2FF]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>MYLINK</span>
            </span>

            <h2 className="mt-4 text-[24px] sm:text-[32px] font-bold leading-[1.3] tracking-tight break-keep">
              나만의 링크 허브,
              <br />
              지금 바로 만들어 볼까요?
            </h2>

            <p className="mt-3 text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#B0B8C1] break-keep">
              Google 계정만 있으면 언제든 링크를 추가하고 클릭 통계를 확인할 수
              있어요.
            </p>

            <div className="mt-7 flex justify-center">
              <Button
                type="button"
                disabled={isSigningIn}
                onClick={handleSignIn}
                className="flex h-[52px] w-full sm:w-auto sm:min-w-[260px] items-center justify-center gap-2.5 rounded-2xl bg-[#3182F6] px-7 text-[15.5px] font-bold text-white shadow-md transition-all hover:bg-[#1B64DA] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <GoogleIcon className="h-3.5 w-3.5" />
                </span>
                <span>
                  {isSigningIn
                    ? "Google 로그인 중..."
                    : "Google로 무료 시작하기"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="pb-4 text-center">
          <p className="text-[12.5px] font-medium text-[#8B95A1]">
            © 2026 MyLink. Built with shadcn/ui & TDS.
          </p>
        </footer>
      </section>
    </div>
  );
}
