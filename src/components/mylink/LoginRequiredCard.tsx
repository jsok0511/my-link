"use client";

import React from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGoogleAuth } from "@/lib/use-google-auth";
import { GoogleIcon } from "./GoogleIcon";

interface LoginRequiredCardProps {
  onShowToast?: (msg: string) => void;
  className?: string;
}

/**
 * Shown on the main page when the user is signed out, explaining that MyLink
 * features are available after signing in with Google.
 */
export function LoginRequiredCard({
  onShowToast,
  className = "",
}: LoginRequiredCardProps) {
  const { isSigningIn, handleSignIn } = useGoogleAuth({ onShowToast });

  return (
    <section className={`pt-8 pb-4 ${className}`}>
      <Card className="rounded-2xl border border-[#E5E8EB] bg-white p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6]">
          <Lock className="h-6 w-6" />
        </div>

        <h1 className="text-[20px] font-bold tracking-tight text-[#191F28] break-keep">
          로그인 후 나만의 마이링크를 이용해 보세요
        </h1>

        <p className="mt-2.5 text-[14px] leading-relaxed text-[#4E5968] break-keep">
          Google 계정으로 로그인하면 나만의 프로필 정보와 링크 목록을 안전하게 저장하고,
          언제 어디서나 나만의 링크 페이지를 관리할 수 있어요.
        </p>

        <div className="mt-6">
          <Button
            type="button"
            disabled={isSigningIn}
            onClick={handleSignIn}
            className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-2xl border border-[#E5E8EB] bg-white text-[15px] font-bold text-[#191F28] shadow-xs transition-all hover:bg-[#F2F4F6] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            <GoogleIcon className="h-[18px] w-[18px]" />
            <span>{isSigningIn ? "Google 로그인 중..." : "Google로 시작하기"}</span>
          </Button>
        </div>

        <p className="mt-3 text-[12px] text-[#8B95A1]">
          상단 헤더의 로그인 버튼을 통해서도 바로 시작할 수 있어요
        </p>
      </Card>
    </section>
  );
}
