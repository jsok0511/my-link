"use client";

import React, { useState } from "react";
import TopBar from "@/components/TopBar";
import ProfileHero from "@/components/ProfileHero";
import QuickStats from "@/components/QuickStats";
import LinksSection from "@/components/LinksSection";
import ProjectsSection from "@/components/ProjectsSection";
import TechStackSection from "@/components/TechStackSection";
import GuestbookSection from "@/components/GuestbookSection";
import BottomCTA from "@/components/BottomCTA";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

export default function Home() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#191F28]">
      {/* TDS TopBar */}
      <TopBar onShowToast={showToast} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Profile Hero Block */}
        <ProfileHero onShowToast={showToast} />

        {/* Quick Stats Grid */}
        <QuickStats />

        {/* Core Links (TDS ListRow) */}
        <LinksSection onShowToast={showToast} />

        {/* Featured Projects */}
        <ProjectsSection />

        {/* Tech Stack & Tools */}
        <TechStackSection />

        {/* Visitor Guestbook */}
        <GuestbookSection onShowToast={showToast} />
      </main>

      {/* Footer */}
      <Footer />

      {/* TDS Bottom Fixed CTA */}
      <BottomCTA />

      {/* TDS Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
