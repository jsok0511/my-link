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
