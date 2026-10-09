import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMyLinkStore } from "@/store/useMyLinkStore";
import { LinkItem } from "@/types/mylink";

const linkSchema = z.object({
  title: z.string().trim().min(2, "제목은 2자 이상 입력해 주세요."),
  url: z.string().trim().url("올바른 URL 형식(http:// 또는 https:// 포함)으로 입력해 주세요."),
  description: z.string().trim().optional(),
  icon: z.string().trim().optional(),
});

type LinkFormValues = z.infer<typeof linkSchema>;

export function LinkAddDialog({ children }: { children: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const addBlock = useMyLinkStore((state) => state.addBlock);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      icon: "",
    },
  });

  const onSubmit = (data: LinkFormValues) => {
    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      type: "link",
      title: data.title,
      url: data.url,
      description: data.description,
      icon: data.icon || "Link",
      enabled: true,
    };

    addBlock(newLink);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        reset();
      }
    }}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-[425px] rounded-2xl font-sans">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#191F28] tracking-tight">새 링크 추가하기</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-[13px] font-medium text-[#4E5968]">제목</Label>
            <Input
              id="title"
              placeholder="예: 내 포트폴리오"
              className={`rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6] ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              {...register("title")}
            />
            {errors.title && <p className="text-[12px] text-red-500">{errors.title.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-[13px] font-medium text-[#4E5968]">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              className={`rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6] ${errors.url ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              {...register("url")}
            />
            {errors.url && <p className="text-[12px] text-red-500">{errors.url.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-[13px] font-medium text-[#4E5968]">설명 (선택)</Label>
            <Input
              id="description"
              placeholder="링크에 대한 간단한 설명"
              className="rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6]"
              {...register("description")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon" className="text-[13px] font-medium text-[#4E5968]">아이콘 이름 (선택)</Label>
            <Input
              id="icon"
              placeholder="예: Github, FileText"
              className="rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6]"
              {...register("icon")}
            />
          </div>
          <DialogFooter className="mt-2">
            <Button type="submit" className="w-full bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold h-[52px] rounded-2xl active:scale-[0.98] shadow-sm transition-transform">
              추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
