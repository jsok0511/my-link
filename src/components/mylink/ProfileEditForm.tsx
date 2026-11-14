"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkDisplayNameAvailability,
  DuplicateDisplayNameError,
  MAX_DISPLAY_NAME_LENGTH,
  updateUserProfileInFirestore,
} from "@/lib/firestore-users";
import { useMyLinkStore } from "@/store/useMyLinkStore";

const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, "이름을 입력해 주세요.")
    .max(MAX_DISPLAY_NAME_LENGTH, `이름은 ${MAX_DISPLAY_NAME_LENGTH}자 이내로 입력해 주세요.`),
  bio: z
    .string()
    .trim()
    .max(120, "한 줄 소개는 120자 이내로 입력해 주세요.")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type NameCheckState =
  | { status: "idle" }
  | { status: "checking"; targetName: string }
  | { status: "available"; targetName: string; message: string }
  | { status: "duplicate"; targetName: string; message: string }
  | { status: "error"; targetName: string; message: string };

export interface ProfileEditFormProps {
  variant?: "inline" | "dialog";
  idPrefix?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
  onSubmittingChange?: (submitting: boolean) => void;
}

/**
 * Shared profile edit form supporting displayName duplicate checking and bio editing.
 * Used both inline on My Page (`ProfileHero`) and inside `ProfileEditDialog`.
 */
export function ProfileEditForm({
  variant = "dialog",
  idPrefix = "profile-edit",
  onCancel,
  onSuccess,
  onSubmittingChange,
}: ProfileEditFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkState, setCheckState] = useState<NameCheckState>({ status: "idle" });

  const user = useMyLinkStore((state) => state.user);
  const profile = useMyLinkStore((state) => state.profile);
  const userProfileDoc = useMyLinkStore((state) => state.userProfileDoc);
  const setUserProfileDoc = useMyLinkStore((state) => state.setUserProfileDoc);

  const initialDisplayName = (profile.displayName || user?.displayName || "").trim();

  const {
    control,
    register,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: initialDisplayName,
      bio: profile.bio || "",
    },
  });

  const watchedDisplayName = useWatch({ control, name: "displayName" }) ?? "";
  const trimmedWatchedName = watchedDisplayName.trim();
  const isSameKeyAsInitial =
    trimmedWatchedName.toLowerCase() === initialDisplayName.toLowerCase();

  const activeCheck =
    checkState.status !== "idle" && checkState.targetName === trimmedWatchedName
      ? checkState
      : { status: "idle" as const };

  const isChecking = activeCheck.status === "checking";

  const updateSubmitting = (submitting: boolean) => {
    setIsSubmitting(submitting);
    onSubmittingChange?.(submitting);
  };

  const handleCheckDuplicate = async () => {
    setSubmitError(null);
    const isFieldValid = await trigger("displayName");
    if (!isFieldValid) {
      return;
    }

    const targetName = trimmedWatchedName;
    setCheckState({ status: "checking", targetName });

    try {
      const result = await checkDisplayNameAvailability(targetName, user?.uid);
      if (result.available) {
        clearErrors("displayName");
        setCheckState({
          status: "available",
          targetName,
          message: result.message,
        });
      } else {
        setCheckState({
          status: result.reason === "duplicate" ? "duplicate" : "error",
          targetName,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Failed to check displayName availability:", error);
      setCheckState({
        status: "error",
        targetName,
        message: "중복 확인 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
      });
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setSubmitError(null);
    if (!user?.uid) {
      setSubmitError("로그인 후 프로필을 수정할 수 있어요.");
      return;
    }

    const trimmedName = data.displayName.trim();
    const trimmedBio = data.bio?.trim() ?? "";
    const requiresCheck =
      trimmedName.toLowerCase() !== initialDisplayName.toLowerCase();

    if (requiresCheck) {
      if (activeCheck.status === "duplicate") {
        return;
      }
      if (activeCheck.status !== "available") {
        setCheckState({
          status: "error",
          targetName: trimmedName,
          message: "이름 중복 확인을 먼저 진행해 주세요.",
        });
        return;
      }
    }

    updateSubmitting(true);
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

      onSuccess?.();
    } catch (error) {
      if (error instanceof DuplicateDisplayNameError) {
        setCheckState({
          status: "duplicate",
          targetName: trimmedName,
          message: error.message,
        });
      } else {
        console.error("Failed to update user profile:", error);
        setSubmitError("프로필 저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      updateSubmitting(false);
    }
  };

  const nameInputId = `${idPrefix}-name`;
  const bioInputId = `${idPrefix}-bio`;
  const hasNameError =
    Boolean(errors.displayName) ||
    activeCheck.status === "duplicate" ||
    activeCheck.status === "error";

  const displayNameField = register("displayName", {
    onChange: () => {
      setSubmitError(null);
      setCheckState({ status: "idle" });
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-1 text-left" noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor={nameInputId} className="text-[13px] font-medium text-[#4E5968]">
          이름
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id={nameInputId}
            placeholder="표시할 이름을 입력해 주세요"
            disabled={isSubmitting}
            className={`h-10 flex-1 rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6] ${
              hasNameError
                ? "border-red-500 focus-visible:ring-red-500"
                : activeCheck.status === "available"
                  ? "border-[#059669] focus-visible:ring-[#059669]"
                  : ""
            }`}
            {...displayNameField}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || isChecking || trimmedWatchedName.length === 0}
            onClick={handleCheckDuplicate}
            className="h-10 shrink-0 rounded-xl border-[#E5E8EB] bg-white px-3 text-[13px] font-semibold text-[#333D4B] hover:bg-[#F2F4F6] hover:text-[#191F28] disabled:opacity-50 cursor-pointer"
          >
            {isChecking ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                확인 중
              </span>
            ) : (
              "중복 확인"
            )}
          </Button>
        </div>

        {errors.displayName ? (
          <p className="text-[12px] text-red-500">{errors.displayName.message}</p>
        ) : activeCheck.status === "available" ? (
          <p className="flex items-center gap-1 text-[12px] font-medium text-[#059669]">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{activeCheck.message}</span>
          </p>
        ) : activeCheck.status === "duplicate" || activeCheck.status === "error" ? (
          <p className="flex items-center gap-1 text-[12px] text-red-500" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{activeCheck.message}</span>
          </p>
        ) : !isSameKeyAsInitial && trimmedWatchedName.length > 0 ? (
          <p className="text-[12px] text-[#8B95A1]">
            이름을 변경하려면 중복 확인 버튼을 눌러 확인해 주세요.
          </p>
        ) : null}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={bioInputId} className="text-[13px] font-medium text-[#4E5968]">
          한 줄 소개 <span className="text-[#8B95A1]">(선택)</span>
        </Label>
        <textarea
          id={bioInputId}
          rows={3}
          placeholder="나를 소개하는 짧은 문구를 입력해 주세요"
          disabled={isSubmitting}
          className={`w-full resize-none rounded-xl border border-[#E5E8EB] bg-transparent px-3 py-2 text-[14px] text-[#191F28] placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-[#3182F6] focus-visible:ring-3 focus-visible:ring-[#3182F6]/20 disabled:opacity-50 ${
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

      {variant === "inline" ? (
        <div className="mt-1 flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
            className="h-11 flex-1 rounded-xl border-[#E5E8EB] font-semibold text-[#4E5968] hover:bg-[#F2F4F6] cursor-pointer"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isChecking}
            className="h-11 flex-1 rounded-xl bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold active:scale-[0.98] shadow-sm transition-transform disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      ) : (
        <div className="mt-1">
          <Button
            type="submit"
            disabled={isSubmitting || isChecking}
            className="w-full h-[52px] rounded-2xl bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold active:scale-[0.98] shadow-sm transition-transform disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      )}
    </form>
  );
}
