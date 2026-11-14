"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateLinkInFirestore } from "@/lib/firestore-links";
import { linkSchema, type LinkFormValues } from "@/lib/link-schema";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import type { LinkItem } from "@/types/mylink";
import { LinkFormFields } from "./LinkFormFields";
import { LinkIcon } from "./LinkIcon";

export interface LinkCardProps {
  id?: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  badge?: string;
  category?: LinkItem["category"];
  isExternal?: boolean;
  isEditing?: boolean;
  onClick?: (title: string, url: string) => void;
  onEditStart?: () => void;
  onEditCancel?: () => void;
  onEditSuccess?: (updatedLink: LinkItem) => void;
  onDeleteRequest?: () => void;
  className?: string;
}

interface LinkInlineEditFormProps {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  badge?: string;
  category?: LinkItem["category"];
  onCancel: () => void;
  onSuccess: (updatedLink: LinkItem) => void;
}

function LinkInlineEditForm({
  id,
  title,
  url,
  description,
  icon,
  badge,
  category,
  onCancel,
  onSuccess,
}: LinkInlineEditFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const uid = useMyLinkStore((state) => state.user?.uid);
  const updateBlock = useMyLinkStore((state) => state.updateBlock);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title,
      url,
      description: description ?? "",
      icon: icon ?? "",
    },
  });

  const onSubmit = async (data: LinkFormValues) => {
    setSubmitError(null);
    if (!uid) {
      setSubmitError("로그인 후 링크를 수정할 수 있어요.");
      return;
    }

    try {
      const updatedLink = await updateLinkInFirestore(uid, id, {
        title: data.title,
        url: data.url,
        description: data.description,
        icon: data.icon,
        badge,
        category,
      });

      updateBlock(id, updatedLink);
      onSuccess(updatedLink);
    } catch (error) {
      console.error("Failed to update link in Firestore:", error);
      setSubmitError("링크 수정 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3.5" noValidate>
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-bold text-[#191F28]">링크 수정</span>
      </div>

      <LinkFormFields
        register={register}
        errors={errors}
        disabled={isSubmitting}
        idPrefix={`edit-${id}`}
      />

      {submitError && (
        <p className="text-[12px] text-red-500" role="alert">
          {submitError}
        </p>
      )}

      <div className="mt-1 flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl border-[#E5E8EB] text-[#4E5968] font-semibold hover:bg-[#F2F4F6]"
        >
          취소
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-11 rounded-xl bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold active:scale-[0.98] transition-transform disabled:opacity-60"
        >
          {isSubmitting ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </form>
  );
}

export function LinkCard({
  id = "",
  title,
  url,
  description,
  icon = "link",
  badge,
  category,
  isExternal = true,
  isEditing,
  onClick,
  onEditStart,
  onEditCancel,
  onEditSuccess,
  onDeleteRequest,
  className = "",
}: LinkCardProps) {
  const [internalEditing, setInternalEditing] = useState(false);
  const editing = isEditing !== undefined ? isEditing : internalEditing;

  const handleClick = () => {
    if (onClick) {
      onClick(title, url);
    }
  };

  const handleEditStart = () => {
    if (onEditStart) {
      onEditStart();
    } else {
      setInternalEditing(true);
    }
  };

  const handleEditCancel = () => {
    if (onEditCancel) {
      onEditCancel();
    } else {
      setInternalEditing(false);
    }
  };

  const handleEditSuccess = (updatedLink: LinkItem) => {
    if (onEditCancel) {
      onEditCancel();
    } else {
      setInternalEditing(false);
    }
    onEditSuccess?.(updatedLink);
  };

  if (editing) {
    return (
      <Card
        className={`relative overflow-hidden rounded-2xl border border-[#3182F6] bg-white p-4 ring-2 ring-[#3182F6]/10 ${className}`}
      >
        <LinkInlineEditForm
          id={id}
          title={title}
          url={url}
          description={description}
          icon={icon}
          badge={badge}
          category={category}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
        />
      </Card>
    );
  }

  return (
    <Card
      className={`group relative overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white p-0 transition-all duration-200 hover:border-[#3182F6] hover:shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 p-4 pr-3">
        <a
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={handleClick}
          className="flex min-w-0 flex-1 items-center gap-3.5 no-underline cursor-pointer active:scale-[0.99] transition-transform"
        >
          {/* Left: 44x44px Round Icon Box */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2F4F6] text-[#333D4B] transition-colors duration-150 group-hover:bg-[#E8F3FF] group-hover:text-[#3182F6]">
            <LinkIcon
              name={icon}
              className="h-5 w-5 transition-transform duration-150 group-hover:scale-105"
            />
          </div>

          {/* Center: Title & Description */}
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] sm:text-[16px] font-semibold text-[#191F28] transition-colors group-hover:text-[#191F28]">
                {title}
              </span>
              {badge && (
                <Badge
                  variant="secondary"
                  className="shrink-0 rounded-full border-0 bg-[#E8F3FF] px-2 py-0.5 text-[11px] font-semibold text-[#3182F6] hover:bg-[#E8F3FF]"
                >
                  {badge}
                </Badge>
              )}
            </div>
            {description && (
              <p className="mt-0.5 truncate text-[13px] text-[#8B95A1] group-hover:text-[#6B7684] transition-colors">
                {description}
              </p>
            )}
          </div>
        </a>

        {/* Right: Always-visible Edit & Delete Buttons */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleEditStart}
            aria-label={`${title} 수정`}
            title="수정"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-[#6B7684] hover:bg-[#E8F3FF] hover:text-[#3182F6]"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onDeleteRequest}
            aria-label={`${title} 삭제`}
            title="삭제"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl text-[#6B7684] hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
