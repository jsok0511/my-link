export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800/80 backdrop-blur rounded-2xl p-8 shadow-sm border border-zinc-200/80 dark:border-zinc-700/60 text-center flex flex-col items-center">
        {/* 프로필 아바타 / 이니셜 */}
        <div className="w-24 h-24 mb-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-3xl font-semibold shadow-inner">
          이지성
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          이지성
        </h1>

        {/* 뱃지 */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 mb-4">
          <span>🎓</span>
          <span>대학생 & 바이브 코더</span>
        </div>

        {/* 소개글 */}
        <p className="text-zinc-600 dark:text-zinc-300 text-base leading-relaxed break-keep">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>
      </div>
    </main>
  );
}
