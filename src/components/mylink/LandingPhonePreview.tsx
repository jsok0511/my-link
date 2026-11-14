"use client";

import React, { useMemo, useState } from "react";
import { ChevronRight, MousePointerClick, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "./LinkIcon";

export type LandingPersonaId = "coder" | "designer" | "creator";

interface PreviewLink {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  initialClicks: number;
}

export interface LandingPersona {
  id: LandingPersonaId;
  chipLabel: string;
  emoji: string;
  avatarBg: string;
  displayName: string;
  defaultHandle: string;
  bio: string;
  tags: string[];
  links: PreviewLink[];
}

export const LANDING_PERSONAS: LandingPersona[] = [
  {
    id: "coder",
    chipLabel: "👨‍💻 바이브 코더",
    emoji: "👨‍💻",
    avatarBg: "bg-[#E8F3FF]",
    displayName: "이지성",
    defaultHandle: "지성",
    bio: "더 나은 사용자 경험을 고민하는 프론트엔드 개발자예요.",
    tags: ["Next.js", "React 19", "TDS"],
    links: [
      {
        id: "coder-blog",
        title: "기술 블로그 (Tech Blog)",
        subtitle: "웹 성능 최적화와 개발 기록",
        icon: "blog",
        badge: "Velog",
        initialClicks: 42,
      },
      {
        id: "coder-portfolio",
        title: "웹 포트폴리오 사이트",
        subtitle: "진행한 프로젝트 모아보기",
        icon: "portfolio",
        badge: "인기",
        initialClicks: 58,
      },
      {
        id: "coder-github",
        title: "GitHub 코드 저장소",
        subtitle: "사이드 프로젝트 소스 코드",
        icon: "github",
        initialClicks: 31,
      },
      {
        id: "coder-coffee",
        title: "1:1 커피챗 신청하기",
        subtitle: "커리어·개발 질문 언제든 환영해요",
        icon: "coffee",
        badge: "빠른 답장",
        initialClicks: 19,
      },
    ],
  },
  {
    id: "designer",
    chipLabel: "🎨 프로덕트 디자이너",
    emoji: "🎨",
    avatarBg: "bg-[#FFF3E0]",
    displayName: "김서연",
    defaultHandle: "서연.ux",
    bio: "사용자의 일상을 가볍게 만드는 인터페이스를 그려요.",
    tags: ["UI/UX", "Figma", "Design System"],
    links: [
      {
        id: "design-figma",
        title: "Figma 컴포넌트 아카이브",
        subtitle: "직접 설계한 TDS 기반 UI 키트",
        icon: "sparkles",
        badge: "추천",
        initialClicks: 64,
      },
      {
        id: "design-portfolio",
        title: "2026 케이스 스터디",
        subtitle: "전환율 28% 개선 UX 회고",
        icon: "portfolio",
        initialClicks: 47,
      },
      {
        id: "design-youtube",
        title: "디자인 작업 로그",
        subtitle: "피그마 단축키와 오토레이아웃 팁",
        icon: "youtube",
        initialClicks: 29,
      },
      {
        id: "design-mail",
        title: "프로젝트 협업 문의",
        subtitle: "이메일로 편하게 연락해 주세요",
        icon: "email",
        initialClicks: 14,
      },
    ],
  },
  {
    id: "creator",
    chipLabel: "☕ 크리에이터",
    emoji: "☕",
    avatarBg: "bg-[#ECFDF5]",
    displayName: "박하늘",
    defaultHandle: "하늘로그",
    bio: "작은 기록과 영감을 나누며 매일 성장하는 중이에요.",
    tags: ["브이로그", "뉴스레터", "북클럽"],
    links: [
      {
        id: "creator-youtube",
        title: "YouTube 일상 브이로그",
        subtitle: "매주 일요일 밤 9시 새 영상 업로드",
        icon: "youtube",
        badge: "NEW",
        initialClicks: 83,
      },
      {
        id: "creator-letter",
        title: "주간 영감 뉴스레터",
        subtitle: "일요일 아침에 도착하는 큐레이션",
        icon: "file-text",
        badge: "구독",
        initialClicks: 51,
      },
      {
        id: "creator-insta",
        title: "Instagram 일상 스냅",
        subtitle: "작업실 풍경과 카페 기록",
        icon: "instagram",
        initialClicks: 36,
      },
      {
        id: "creator-chat",
        title: "오픈채팅 커뮤니티",
        subtitle: "함께 성장하는 사이드 프로젝트 방",
        icon: "message-circle",
        initialClicks: 22,
      },
    ],
  },
];

interface LandingPhonePreviewProps {
  customHandle: string;
  activePersonaId: LandingPersonaId;
  onSelectPersona: (id: LandingPersonaId) => void;
  onShowToast: (msg: string) => void;
}

/**
 * Interactive phone frame preview for the MyLink landing hero.
 * Clicking demo link cards increments simulated click counts with feedback.
 */
export function LandingPhonePreview({
  customHandle,
  activePersonaId,
  onSelectPersona,
  onShowToast,
}: LandingPhonePreviewProps) {
  const [clickDeltas, setClickDeltas] = useState<Record<string, number>>({});
  const [poppedLinkId, setPoppedLinkId] = useState<string | null>(null);

  const persona = useMemo(
    () =>
      LANDING_PERSONAS.find((item) => item.id === activePersonaId) ??
      LANDING_PERSONAS[0],
    [activePersonaId]
  );

  const trimmedHandle = customHandle.trim();
  const displayHandle = trimmedHandle || persona.defaultHandle;
  const displayName = trimmedHandle || persona.displayName;

  const totalClicks = useMemo(() => {
    return persona.links.reduce(
      (sum, link) => sum + link.initialClicks + (clickDeltas[link.id] ?? 0),
      0
    );
  }, [persona.links, clickDeltas]);

  const handleDemoLinkClick = (link: PreviewLink) => {
    setClickDeltas((prev) => ({
      ...prev,
      [link.id]: (prev[link.id] ?? 0) + 1,
    }));
    setPoppedLinkId(link.id);
    onShowToast(`"${link.title}" 클릭이 집계되었어요 (+1)`);

    setTimeout(() => {
      setPoppedLinkId((current) => (current === link.id ? null : current));
    }, 650);
  };

  return (
    <div className="relative mx-auto w-full max-w-[368px]">
      {/* Subtle TDS ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-br from-[#3182F6]/15 via-[#E8F3FF]/70 to-transparent blur-2xl"
      />

      {/* Interactive Phone Frame */}
      <div className="rounded-[32px] border-[6px] border-[#191F28] bg-[#F9FAFB] shadow-[0_24px_60px_-15px_rgba(25,31,40,0.18)] overflow-hidden">
        {/* Top Mock Browser Bar */}
        <div className="flex items-center justify-between border-b border-[#E5E8EB] bg-white px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#3182F6]" />
            <span className="text-[11px] font-bold tracking-tight text-[#191F28]">
              MYLINK
            </span>
          </div>

          <div className="flex max-w-[190px] items-center gap-1.5 rounded-full bg-[#F2F4F6] px-2.5 py-1">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#059669] animate-pulse" />
            <span className="truncate text-[11px] font-medium text-[#4E5968]">
              mylink/{displayHandle}
            </span>
          </div>
        </div>

        {/* Phone Body */}
        <div className="p-4 sm:p-5">
          {/* Mini Profile Hero */}
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-[28px] shadow-sm ring-1 ring-[#E5E8EB] transition-colors ${persona.avatarBg}`}
            >
              <span role="img" aria-label={persona.displayName}>
                {persona.emoji}
              </span>
            </div>

            <h3 className="mt-2.5 text-[17px] font-bold tracking-tight text-[#191F28]">
              {displayName}
            </h3>
            <p className="mt-0.5 text-[12px] text-[#8B95A1]">
              @{displayHandle}
            </p>
            <p className="mt-2 max-w-[260px] text-[12.5px] leading-relaxed text-[#4E5968] break-keep">
              {persona.bio}
            </p>

            {/* Tags */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1">
              {persona.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="rounded-full border-0 bg-[#F2F4F6] px-2.5 py-0.5 text-[11px] font-medium text-[#4E5968]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clickable Hint */}
          <div className="mt-4 mb-2 flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-[#6B7684]">
              눌러서 클릭 반응 체험하기
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3182F6] tabular-nums">
              <MousePointerClick className="h-3 w-3" />
              총 {totalClicks.toLocaleString("ko-KR")}회
            </span>
          </div>

          {/* Interactive Demo Link Cards */}
          <div className="space-y-2">
            {persona.links.map((link) => {
              const count = link.initialClicks + (clickDeltas[link.id] ?? 0);
              const isPopped = poppedLinkId === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleDemoLinkClick(link)}
                  className="group relative flex w-full items-center justify-between gap-2.5 rounded-2xl border border-[#E5E8EB] bg-white p-3 text-left transition-all duration-150 hover:border-[#3182F6] hover:shadow-xs active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F6] text-[#4E5968] transition-colors group-hover:bg-[#E8F3FF] group-hover:text-[#3182F6]">
                      <LinkIcon name={link.icon} className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-[13.5px] font-semibold text-[#191F28] group-hover:text-[#3182F6] transition-colors">
                          {link.title}
                        </span>
                        {link.badge && (
                          <span className="shrink-0 rounded-full bg-[#E8F3FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#3182F6]">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11.5px] text-[#8B95A1]">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums transition-all ${
                        isPopped
                          ? "bg-[#3182F6] text-white scale-110"
                          : "bg-[#F2F4F6] text-[#6B7684]"
                      }`}
                    >
                      {isPopped ? "+1!" : `${count}`}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#B0B8C1] transition-transform group-hover:translate-x-0.5 group-hover:text-[#3182F6]" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Persona Switcher inside Footer Strip */}
        <div className="border-t border-[#E5E8EB] bg-white px-3 py-2.5">
          <div className="flex items-center justify-between gap-1">
            <span className="hidden min-[380px]:inline-flex items-center gap-1 text-[11px] font-medium text-[#8B95A1]">
              <Sparkles className="h-3 w-3 text-[#3182F6]" />
              예시 테마
            </span>
            <div className="flex flex-1 min-[380px]:flex-initial items-center justify-end gap-1">
              {LANDING_PERSONAS.map((item) => {
                const isActive = item.id === persona.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectPersona(item.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer ${
                      isActive
                        ? "bg-[#191F28] text-white"
                        : "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
                    }`}
                  >
                    {item.emoji} {item.defaultHandle.split(".")[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
