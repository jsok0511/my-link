"use client";

import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LinkFormValues } from "@/lib/link-schema";

interface LinkFormFieldsProps {
  register: UseFormRegister<LinkFormValues>;
  errors: FieldErrors<LinkFormValues>;
  disabled?: boolean;
  idPrefix: string;
}

export function LinkFormFields({
  register,
  errors,
  disabled = false,
  idPrefix,
}: LinkFormFieldsProps) {
  const titleId = `${idPrefix}-title`;
  const urlId = `${idPrefix}-url`;
  const descriptionId = `${idPrefix}-description`;
  const iconId = `${idPrefix}-icon`;

  return (
    <>
      <div className="grid gap-1.5">
        <Label htmlFor={titleId} className="text-[13px] font-medium text-[#4E5968]">
          제목
        </Label>
        <Input
          id={titleId}
          placeholder="예: 내 포트폴리오"
          disabled={disabled}
          className={`rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6] ${
            errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-[12px] text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={urlId} className="text-[13px] font-medium text-[#4E5968]">
          URL
        </Label>
        <Input
          id={urlId}
          type="url"
          placeholder="https://..."
          disabled={disabled}
          className={`rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6] ${
            errors.url ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
          {...register("url")}
        />
        {errors.url && (
          <p className="text-[12px] text-red-500">{errors.url.message}</p>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label
          htmlFor={descriptionId}
          className="text-[13px] font-medium text-[#4E5968]"
        >
          설명 (선택)
        </Label>
        <Input
          id={descriptionId}
          placeholder="링크에 대한 간단한 설명"
          disabled={disabled}
          className="rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6]"
          {...register("description")}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor={iconId} className="text-[13px] font-medium text-[#4E5968]">
          아이콘 이름 (선택)
        </Label>
        <Input
          id={iconId}
          placeholder="예: Github, FileText"
          disabled={disabled}
          className="rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6]"
          {...register("icon")}
        />
      </div>
    </>
  );
}
