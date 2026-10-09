import React from "react";
import {
  Mail,
  FolderGit2,
  Coffee,
  MessageCircle,
  FileText,
  Globe,
  Sparkles,
  Link as LinkIconLucide,
} from "lucide-react";
import {
  GithubIcon,
  VelogIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/Icons";

interface LinkIconProps {
  name?: string;
  className?: string;
}

export function LinkIcon({ name = "link", className = "w-5 h-5" }: LinkIconProps) {
  const normalized = name.toLowerCase().trim();

  switch (normalized) {
    case "github":
      return <GithubIcon className={className} />;
    case "blog":
    case "velog":
      return <VelogIcon className={className} />;
    case "portfolio":
    case "folder":
      return <FolderGit2 className={className} />;
    case "email":
    case "mail":
      return <Mail className={className} />;
    case "coffee":
      return <Coffee className={className} />;
    case "message-circle":
    case "chat":
    case "kakao":
      return <MessageCircle className={className} />;
    case "file-text":
    case "resume":
      return <FileText className={className} />;
    case "instagram":
      return <InstagramIcon className={className} />;
    case "youtube":
      return <YoutubeIcon className={className} />;
    case "linkedin":
      return <LinkedinIcon className={className} />;
    case "twitter":
    case "x":
      return <TwitterIcon className={className} />;
    case "website":
    case "globe":
      return <Globe className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    default:
      return <LinkIconLucide className={className} />;
  }
}
