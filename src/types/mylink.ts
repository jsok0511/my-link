export interface SocialLink {
  id: string;
  platform: "github" | "instagram" | "twitter" | "youtube" | "linkedin" | "email" | "website";
  url: string;
  enabled: boolean;
}

export interface LinkItem {
  id: string;
  type: "link";
  title: string;
  url: string;
  description?: string;
  icon?: string;
  badge?: string;
  category?: "dev" | "career" | "social" | "contact";
  enabled: boolean;
}

export interface HeaderItem {
  id: string;
  type: "header";
  title: string;
  enabled: boolean;
}

export type ContentBlock = LinkItem | HeaderItem;

export interface ProfileData {
  username: string; // 핸들 (예: 'jisung.dev')
  displayName: string; // 이름 (예: '이지성')
  bio: string; // 소개글
  avatarUrl: string; // 프로필 이미지 URL
  avatarFallback: string; // 아바타 대체 텍스트 (예: '지성')
  tags: string[]; // 태그 뱃지 목록
  socials: SocialLink[]; // 소셜 링크 목록
  blocks: ContentBlock[]; // 링크 및 헤더 블록 목록
}
