import type { Metadata } from "next";
import { HomePageClient } from "@/components/mylink";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_DEFAULT_DESCRIPTION,
  buildSocialMetadata,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  ...buildSocialMetadata({
    title: DEFAULT_TITLE,
    description: OG_DEFAULT_DESCRIPTION,
    url: "/",
  }),
};

export default function HomePage() {
  return <HomePageClient />;
}
