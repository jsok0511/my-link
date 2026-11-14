"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addLinkToFirestore } from "@/lib/firestore-links";
import { linkSchema, type LinkFormValues } from "@/lib/link-schema";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { LinkItem } from "@/types/mylink";
import { LinkFormFields } from "./LinkFormFields";

interface LinkAddDialogProps {
  children: React.ReactElement;
  onSuccess?: (link: LinkItem) => void;
}

export function LinkAddDialog({ children, onSuccess }: LinkAddDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const uid = useMyLinkStore((state) => state.user?.uid);
  const addFirestoreLink = useMyLinkStore((state) => state.addFirestoreLink);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      icon: "",
    },
  });

  const onSubmit = async (data: LinkFormValues) => {
    setSubmitError(null);
    if (!uid) {
      setSubmitError("로그인 후 링크를 추가할 수 있어요.");
      return;
    }

    try {
      const createdLink = await addLinkToFirestore(uid, {
        title: data.title,
        url: data.url,
        description: data.description,
        icon: data.icon,
      });

      addFirestoreLink(createdLink);
      setOpen(false);
      reset();
      onSuccess?.(createdLink);
    } catch (error) {
      console.error("Failed to save link to Firestore:", error);
      setSubmitError("링크 저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setSubmitError(null);
        reset();
      }
    }}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-[425px] rounded-2xl font-sans">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#191F28] tracking-tight">새 링크 추가하기</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4" noValidate>
          <LinkFormFields
            register={register}
            errors={errors}
            disabled={isSubmitting}
            idPrefix="add-link"
          />
          {submitError && (
            <p className="text-[12px] text-red-500" role="alert">{submitError}</p>
          )}
          <DialogFooter className="mt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold h-[52px] rounded-2xl active:scale-[0.98] shadow-sm transition-transform disabled:opacity-60"
            >
              {isSubmitting ? "저장 중..." : "추가하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
