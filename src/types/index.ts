export interface SocialLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconName: "github" | "blog" | "email" | "portfolio" | string;
  badge?: string;
  isExternal: boolean;
}

export type LinkCategory = "all" | "dev" | "career" | "social" | "contact";

export interface LinkItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category: "dev" | "career" | "social" | "contact";
  categoryLabel: string;
  iconName: string;
  badge?: string;
  isExternal: boolean;
  order: number;
  clickCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LinksApiResponse {
  status: "success" | "error";
  code: number;
  message: string;
  data: LinkItem[];
  meta: {
    totalCount: number;
    activeCount: number;
    categories: {
      id: string;
      label: string;
      count: number;
    }[];
  };
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
