import React, { useState } from "react";
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

export function LinkAddDialog({ children }: { children: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const addBlock = useMyLinkStore((state) => state.addBlock);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      type: "link",
      title,
      url,
      description,
      icon: icon || "Link",
      enabled: true,
    };

    addBlock(newLink);
    setOpen(false);
    
    // Reset form
    setTitle("");
    setUrl("");
    setDescription("");
    setIcon("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-[425px] rounded-2xl font-sans">
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#191F28] tracking-tight">새 링크 추가하기</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-[13px] font-medium text-[#4E5968]">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 내 포트폴리오"
              required
              className="rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className="text-[13px] font-medium text-[#4E5968]">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              className="rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-[13px] font-medium text-[#4E5968]">설명 (선택)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="링크에 대한 간단한 설명"
              className="rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="icon" className="text-[13px] font-medium text-[#4E5968]">아이콘 이름 (선택)</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="예: Github, FileText"
              className="rounded-xl border-[#E5E8EB] focus-visible:ring-[#3182F6]"
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
