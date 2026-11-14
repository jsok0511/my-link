import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUserByDisplayName } from "@/lib/firestore-users";
import { fetchUserLinks } from "@/lib/firestore-links";
import { PublicProfileView } from "@/components/mylink";
import { SITE_NAME, buildSocialMetadata } from "@/lib/seo";
import type { ProfileData } from "@/types/mylink";

export const dynamic = "force-dynamic";

const getUserByDisplayName = cache(async (displayName: string) => {
  return fetchUserByDisplayName(displayName);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ displayName: string }>;
}): Promise<Metadata> {
  const { displayName } = await params;
  const userProfile = await getUserByDisplayName(displayName);

  if (!userProfile) {
    const notFoundTitle = "페이지를 찾을 수 없어요";
    const notFoundDescription = "요청하신 마이링크 페이지를 찾을 수 없어요.";

    return {
      title: notFoundTitle,
      description: notFoundDescription,
      robots: {
        index: false,
        follow: false,
      },
      ...buildSocialMetadata({
        title: `${notFoundTitle} | ${SITE_NAME}`,
        description: notFoundDescription,
      }),
    };
  }

  const profileFullTitle = `${userProfile.displayName} | ${SITE_NAME}`;
  const profileDescription =
    userProfile.bio ||
    `${userProfile.displayName}님의 마이링크 페이지예요.`;
  const canonicalPath = `/${encodeURIComponent(userProfile.displayName)}`;

  return {
    title: userProfile.displayName,
    description: profileDescription,
    keywords: [
      userProfile.displayName,
      `${userProfile.displayName} 링크`,
      SITE_NAME,
      "마이링크",
      "링크 허브",
      "프로필 링크",
    ],
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...buildSocialMetadata({
      title: profileFullTitle,
      description: profileDescription,
      url: canonicalPath,
      type: "profile",
      username: userProfile.displayName,
    }),
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  const { displayName } = await params;
  const userProfile = await getUserByDisplayName(displayName);

  if (!userProfile) {
    notFound();
  }

  const links = await fetchUserLinks(userProfile.uid);

  const profileData: ProfileData = {
    username: userProfile.displayName,
    displayName: userProfile.displayName,
    bio: userProfile.bio ?? "",
    avatarUrl: userProfile.photoURL,
    avatarFallback: userProfile.displayName.slice(0, 2),
    tags: [],
    socials: [],
    blocks: links,
  };

  return <PublicProfileView ownerUid={userProfile.uid} profile={profileData} />;
}
