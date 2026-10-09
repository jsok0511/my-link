export interface SocialLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconName: "github" | "blog" | "email" | "portfolio";
  badge?: string;
  isExternal: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  badge: string;
}

export interface TechStackCategory {
  category: string;
  emoji: string;
  items: {
    name: string;
    highlight?: boolean;
  }[];
}

export interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  createdAt: string;
}

export const profileData = {
  name: "이지성",
  englishName: "Lee Ji-seong",
  handle: "@jsok0511",
  status: "지금 프로젝트를 만들고 있어요",
  statusBadge: "Vibe Coding",
  avatarText: "지성",
  roles: [
    "🎓 컴퓨터공학 전공",
    "⚡ 바이브 코더",
    "🛠️ 프론트엔드 개발자",
  ],
  bio: "아이디어를 작동하는 코드로 구현하고 있어요. AI와 대화하며 기민하게 프로토타입을 만들고, 더 직관적이고 편안한 사용자 경험을 고민해요.",
  email: "jsok0511@gmail.com",
  githubUrl: "https://github.com/jsok0511",
  location: "서울시 강남구",
};

export const quickStats = [
  {
    label: "완성한 프로젝트",
    value: "12개",
    desc: "아이디어에서 배포까지",
  },
  {
    label: "바이브 코딩 여정",
    value: "365일",
    desc: "매일 꾸준한 코드 기록",
  },
  {
    label: "커피와 함께한 시간",
    value: "1,200잔",
    desc: "몰입과 탐구의 연료",
  },
  {
    label: "AI 협업 완성도",
    value: "100%",
    desc: "생성형 AI 워크플로우",
  },
];

export const mainLinks: SocialLink[] = [
  {
    id: "github",
    title: "GitHub 코드 저장소",
    subtitle: "github.com/jsok0511 • 오픈소스 및 사이드 프로젝트예요",
    url: "https://github.com/jsok0511",
    iconName: "github",
    badge: "대표 채널",
    isExternal: true,
  },
  {
    id: "blog",
    title: "기술 블로그 & 개발 일지",
    subtitle: "새롭게 배운 기술과 시행착오 과정을 기록해두었어요",
    url: "https://velog.io/@jsok0511",
    iconName: "blog",
    badge: "Velog",
    isExternal: true,
  },
  {
    id: "email",
    title: "이메일로 연락하기",
    subtitle: "jsok0511@gmail.com • 언제든 편하게 커피챗을 제안해보세요",
    url: "mailto:jsok0511@gmail.com",
    iconName: "email",
    badge: "빠른 답장",
    isExternal: false,
  },
  {
    id: "portfolio",
    title: "프로젝트 아카이브",
    subtitle: "지금까지 작업한 결과물과 데모를 모아두었어요",
    url: "https://github.com/jsok0511?tab=repositories",
    iconName: "portfolio",
    badge: "포트폴리오",
    isExternal: true,
  },
];

export const featuredProjects: ProjectItem[] = [
  {
    id: "my-link",
    title: "My-Link (토스 디자인 시스템)",
    tagline: "절제되고 직관적인 개인 프로필 허브",
    description:
      "토스 디자인 시스템(TDS)의 컬러, 타이포그래피, ListRow 및 Button 사양을 충실히 반영하여 제작한 반응형 프로필 페이지예요.",
    tags: ["Next.js 16", "React 19", "Tailwind CSS", "TypeScript", "TDS"],
    githubUrl: "https://github.com/jsok0511/my-link",
    badge: "지금 보고 있어요",
  },
  {
    id: "vibe-prompt-lab",
    title: "Vibe Prompt Studio",
    tagline: "AI 기반 프롬프트 엔지니어링 & 코드 생성 도구",
    description:
      "생각한 아이디어를 요구사항 명세서와 초기 코드 보일러플레이트로 빠르게 만들어주는 AI 페어 프로그래밍 도구예요.",
    tags: ["React", "Gemini API", "TypeScript", "Tailwind"],
    githubUrl: "https://github.com/jsok0511",
    badge: "AI 툴",
  },
  {
    id: "campus-mate",
    title: "CampusSync (캠퍼스 싱크)",
    tagline: "대학생을 위한 강의 시간표 & 팀플 일정 매칭 서비스",
    description:
      "강의 시간표를 비교해 공강 시간을 자동으로 계산하고 모임 일정을 편하게 조율할 수 있는 웹 서비스예요.",
    tags: ["Next.js", "Supabase", "Tailwind CSS"],
    githubUrl: "https://github.com/jsok0511",
    badge: "캠퍼스 웹",
  },
];

export const techStackCategories: TechStackCategory[] = [
  {
    category: "프론트엔드 & 웹",
    emoji: "🎨",
    items: [
      { name: "Next.js 16 (App Router)", highlight: true },
      { name: "React 19", highlight: true },
      { name: "TypeScript", highlight: true },
      { name: "Tailwind CSS", highlight: true },
      { name: "HTML / Modern CSS" },
      { name: "Turbopack" },
    ],
  },
  {
    category: "AI & 바이브 코딩",
    emoji: "🤖",
    items: [
      { name: "AI Pair Programming", highlight: true },
      { name: "Gemini API", highlight: true },
      { name: "Claude 3.7 Sonnet" },
      { name: "Cursor / Windsurf" },
      { name: "Prompt Architecture", highlight: true },
    ],
  },
  {
    category: "백엔드 & 인프라",
    emoji: "⚙️",
    items: [
      { name: "Node.js" },
      { name: "RESTful API", highlight: true },
      { name: "Supabase / PostgreSQL" },
      { name: "Vercel 배포", highlight: true },
      { name: "Git & GitHub" },
    ],
  },
  {
    category: "핵심 가치 & 관심사",
    emoji: "💡",
    items: [
      { name: "빠른 실행력 (Fast Prototyping)", highlight: true },
      { name: "직관적인 사용자 경험 (UX)", highlight: true },
      { name: "TDS 디자인 시스템", highlight: true },
      { name: "지속적인 성장과 기록" },
    ],
  },
];

export const defaultGuestbook: GuestbookEntry[] = [
  {
    id: "1",
    author: "동기 개발자",
    message: "토스 스타일로 바뀌니까 진짜 깔끔하고 보기 편해요!",
    createdAt: "2026. 10. 09",
  },
  {
    id: "2",
    author: "AI 페어 프로그래머",
    message: "바이브 코딩의 정석이에요. 앞으로 만들 프로젝트들도 기대할게요!",
    createdAt: "2026. 10. 09",
  },
  {
    id: "3",
    author: "커피챗 희망자",
    message: "개발자 이지성 님의 성장을 응원해요. 커피챗 한번 나눠보고 싶어요 :)",
    createdAt: "2026. 10. 09",
  },
];
