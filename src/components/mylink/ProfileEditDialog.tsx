"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileEditForm } from "./ProfileEditForm";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updated?: { displayName: string; bio: string }) => void;
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
            variant="dialog"
            idPrefix="dialog-profile"
            onSubmittingChange={setIsSubmitting}
            onSuccess={(updated) => {
              onOpenChange(false);
              onSuccess?.(updated);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
