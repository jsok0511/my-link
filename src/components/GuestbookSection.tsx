"use client";

import React, { useState, useEffect } from "react";
import { GuestbookEntry } from "@/data/profile";
import { defaultGuestbook } from "@/data/profile";
import { Trash2, Send } from "lucide-react";

interface GuestbookSectionProps {
  onShowToast: (msg: string) => void;
}

export default function GuestbookSection({ onShowToast }: GuestbookSectionProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>(defaultGuestbook);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("my-link-guestbook-tds");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const timer = setTimeout(() => {
            setEntries(parsed);
          }, 0);
          return () => clearTimeout(timer);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      onShowToast("응원 메시지를 입력해주세요");
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, "0")}. ${String(today.getDate()).padStart(2, "0")}`;

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      author: author.trim() || "익명의 방문자",
      message: message.trim(),
      createdAt: formattedDate,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem("my-link-guestbook-tds", JSON.stringify(updated));
    } catch {
      // ignore
    }

    setMessage("");
    setAuthor("");
    onShowToast("소중한 응원 메시지를 남겼어요! 감사합니다.");
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((item) => item.id !== id);
    setEntries(updated);
    try {
      localStorage.setItem("my-link-guestbook-tds", JSON.stringify(updated));
    } catch {
      // ignore
    }
    onShowToast("메시지를 삭제했어요");
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-8 mb-16">
      <div className="mb-3 px-1 flex items-center justify-between">
        <h2 className="text-[17px] sm:text-[18px] font-bold text-[#191F28] tracking-tight">
          한 줄 방명록
        </h2>
        <span className="text-[13px] font-medium text-[#8B95A1]">
          {entries.length}개의 응원
        </span>
      </div>

      <div className="tds-card bg-white p-5 sm:p-6 mb-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="이름이나 닉네임 (선택)"
              maxLength={20}
              className="tds-input sm:w-44 text-[14px]"
            />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="응원의 한마디를 자유롭게 남겨보세요"
              maxLength={100}
              className="tds-input flex-1 text-[14px]"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[12px] text-[#8B95A1]">
              {message.length} / 100자
            </span>
            <button
              type="submit"
              className="tds-btn-primary h-[40px] px-4 text-[13px] sm:text-[14px] flex items-center gap-1.5"
            >
              <span>남기기</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Message List */}
      <div className="tds-card bg-white overflow-hidden divide-y divide-[#E5E8EB]">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-4 sm:p-5 flex items-start justify-between gap-3 hover:bg-[#F9FAFB] transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[14px] text-[#191F28]">
                  {entry.author}
                </span>
                <span className="text-[12px] text-[#8B95A1] tabular-nums">
                  {entry.createdAt}
                </span>
              </div>
              <p className="text-[14px] text-[#4E5968] leading-relaxed break-keep">
                {entry.message}
              </p>
            </div>

            <button
              onClick={() => handleDelete(entry.id)}
              className="p-1.5 text-[#B0B8C1] hover:text-[#4E5968] active:scale-95 transition-all"
              title="메시지 삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
