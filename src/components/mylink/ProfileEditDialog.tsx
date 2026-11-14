"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfileInFirestore } from "@/lib/firestore-users";
import { useMyLinkStore } from "@/store/useMyLinkStore";

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "이름을 입력해 주세요.")
    .max(30, "이름은 30자 이내로 입력해 주세요."),
  bio: z
    .string()
    .trim()
    .max(120, "한 줄 소개는 120자 이내로 입력해 주세요.")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ProfileEditFormProps {
  isSubmitting: boolean;
  onSubmittingChange: (submitting: boolean) => void;
  onClose: () => void;
  onSuccess?: () => void;
}

function ProfileEditForm({
  isSubmitting,
  onSubmittingChange,
  onClose,
  onSuccess,
}: ProfileEditFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const user = useMyLinkStore((state) => state.user);
  const profile = useMyLinkStore((state) => state.profile);
  const userProfileDoc = useMyLinkStore((state) => state.userProfileDoc);
  const setUserProfileDoc = useMyLinkStore((state) => state.setUserProfileDoc);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName || user?.displayName || "",
      bio: profile.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setSubmitError(null);
    if (!user?.uid) {
      setSubmitError("로그인 후 프로필을 수정할 수 있어요.");
      return;
    }

    const trimmedName = data.displayName.trim();
    const trimmedBio = data.bio?.trim() ?? "";

    onSubmittingChange(true);
    try {
      await updateUserProfileInFirestore(user.uid, {
        displayName: trimmedName,
        bio: trimmedBio,
      });

      setUserProfileDoc({
        uid: user.uid,
        displayName: trimmedName,
        email: userProfileDoc?.email ?? user.email,
        photoURL: userProfileDoc?.photoURL ?? user.photoURL,
        bio: trimmedBio || undefined,
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update user profile:", error);
      setSubmitError("프로필 저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      onSubmittingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="edit-profile-name" className="text-[13px] font-medium text-[#4E5968]">
          이름
        </Label>
        <Input
          id="edit-profile-name"
          placeholder="표시할 이름을 입력해 주세요"
          disabled={isSubmitting}
          className={`rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6] ${
            errors.displayName ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
          {...register("displayName")}
        />
        {errors.displayName && (
          <p className="text-[12px] text-red-500">{errors.displayName.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="edit-profile-bio" className="text-[13px] font-medium text-[#4E5968]">
          한 줄 소개 <span className="text-[#8B95A1]">(선택)</span>
        </Label>
        <textarea
          id="edit-profile-bio"
          rows={3}
          placeholder="나를 소개하는 짧은 문구를 입력해 주세요"
          disabled={isSubmitting}
          className={`w-full resize-none rounded-xl border border-[#E5E8EB] bg-transparent px-2.5 py-2 text-[14px] text-[#191F28] placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-[#3182F6] focus-visible:ring-3 focus-visible:ring-[#3182F6]/20 disabled:opacity-50 ${
            errors.bio ? "border-red-500 focus-visible:ring-red-500/20" : ""
          }`}
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-[12px] text-red-500">{errors.bio.message}</p>
        )}
      </div>

      {submitError && (
        <p className="text-[12px] text-red-500" role="alert">
          {submitError}
        </p>
      )}

      <DialogFooter className="mt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-[52px] rounded-2xl bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold active:scale-[0.98] shadow-sm transition-transform disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "저장 중..." : "저장하기"}
        </Button>
      </DialogFooter>
    </form>
  );
}

/**
 * Modal dialog for editing the authenticated user's displayName and bio in `users/{uid}`.
 */
export function ProfileEditDialog({
  open,
  onOpenChange,
  onSuccess,
}: ProfileEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[425px] rounded-2xl font-sans"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#191F28] tracking-tight">
            프로필 수정
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#8B95A1]">
            내 마이링크 상단에 표시될 이름과 소개 문구를 설정해요.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <ProfileEditForm
            isSubmitting={isSubmitting}
            onSubmittingChange={setIsSubmitting}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
