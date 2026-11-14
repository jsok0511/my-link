import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchUserByDisplayName } from "@/lib/firestore-users";
import { fetchUserLinks } from "@/lib/firestore-links";
import { PublicProfileView } from "@/components/mylink";
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
    return {
      title: "페이지를 찾을 수 없어요 | MyLink",
      description: "요청하신 마이링크 페이지를 찾을 수 없어요.",
    };
  }

  return {
    title: `${userProfile.displayName} | MyLink`,
    description:
      userProfile.bio ||
      `${userProfile.displayName}님의 마이링크 페이지예요.`,
    openGraph: {
      title: `${userProfile.displayName} | MyLink`,
      description:
        userProfile.bio ||
        `${userProfile.displayName}님의 마이링크 페이지예요.`,
      type: "profile",
    },
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
