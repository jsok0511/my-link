import type { Metadata } from "next";
import Link from "next/link";
import { UserX, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "존재하지 않는 사용자예요",
  description:
    "입력하신 사용자 이름을 찾을 수 없거나 이름이 변경되었어요. MyLink에서 나만의 링크 허브를 만들어 보세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] font-sans antialiased selection:bg-[#E8F3FF] selection:text-[#3182F6]">
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E8EB] bg-[#F9FAFB]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4 sm:max-w-lg">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 no-underline transition-opacity hover:opacity-80"
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#3182F6]" />
            <span className="text-[15px] font-bold tracking-tight text-[#191F28]">
              MYLINK
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-col px-4 pt-12 pb-16 sm:max-w-lg sm:px-6">
        <section className="rounded-2xl border border-[#E5E8EB] bg-white p-6 sm:p-8 text-center shadow-xs">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6]">
            <UserX className="h-6 w-6" />
          </div>

          <span className="inline-flex items-center rounded-full bg-[#F2F4F6] px-2.5 py-0.5 text-[11px] font-semibold text-[#6B7684]">
            404 NOT FOUND
          </span>

          <h1 className="mt-3 text-[20px] font-bold tracking-tight text-[#191F28] break-keep">
            존재하지 않는 사용자예요
          </h1>

          <p className="mt-2.5 text-[14px] leading-relaxed text-[#4E5968] break-keep">
            입력하신 사용자 이름을 찾을 수 없거나 이름이 변경되었어요.
            주소를 다시 확인하거나 내 마이링크 홈으로 이동해 보세요.
          </p>

          <div className="mt-6">
            <Link
              href="/"
              className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#3182F6] text-[15px] font-bold text-white shadow-sm transition-all duration-150 hover:bg-[#1B64DA] active:scale-[0.98] no-underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>홈으로 돌아가기</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
