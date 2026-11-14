"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteLinkFromFirestore } from "@/lib/firestore-links";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import type { LinkItem } from "@/types/mylink";

interface LinkDeleteDialogProps {
  link: LinkItem | null;
  onClose: () => void;
  onSuccess?: (link: LinkItem) => void;
}

export function LinkDeleteDialog({
  link,
  onClose,
  onSuccess,
}: LinkDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const uid = useMyLinkStore((state) => state.user?.uid);
  const deleteBlock = useMyLinkStore((state) => state.deleteBlock);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isDeleting) {
      setDeleteError(null);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!link) return;
    if (!uid) {
      setDeleteError("로그인 후 링크를 삭제할 수 있어요.");
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteLinkFromFirestore(uid, link.id);
      deleteBlock(link.id);
      onSuccess?.(link);
      onClose();
    } catch (error) {
      console.error("Failed to delete link from Firestore:", error);
      setDeleteError("링크 삭제 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={Boolean(link)} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[400px] rounded-2xl font-sans p-5"
        showCloseButton={!isDeleting}
      >
        <DialogHeader>
          <DialogTitle className="text-[19px] font-bold text-[#191F28] tracking-tight">
            정말 삭제하시겠습니까?
          </DialogTitle>
          <DialogDescription className="sr-only">
            선택한 링크를 삭제하기 전 확인합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          {link && (
            <div className="rounded-xl bg-[#F2F4F6] px-3.5 py-2.5">
              <p className="truncate text-[14px] font-semibold text-[#191F28]">
                {link.title}
              </p>
            </div>
          )}
          <p className="text-[13px] font-medium text-red-500">
            이 작업은 되돌릴 수 없습니다
          </p>
          {deleteError && (
            <p className="text-[12px] text-red-500" role="alert">
              {deleteError}
            </p>
          )}
        </div>

        <div className="mt-2 flex gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={onClose}
            className="flex-1 h-[48px] rounded-2xl border-[#E5E8EB] text-[#4E5968] font-semibold hover:bg-[#F2F4F6]"
          >
            취소
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="flex-1 h-[48px] rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {isDeleting ? "삭제 중..." : "삭제하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
