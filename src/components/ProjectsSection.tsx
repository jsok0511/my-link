"use client";

import React from "react";
import { featuredProjects } from "@/data/profile";
import { ExternalLink, ChevronRight } from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export default function ProjectsSection() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-8">
      {/* Section Header */}
      <div className="mb-3 px-1 flex items-center justify-between">
        <h2 className="text-[17px] sm:text-[18px] font-bold text-[#191F28] tracking-tight">
          만들고 있는 프로젝트
        </h2>
        <a
          href="https://github.com/jsok0511?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium text-[#4E5968] hover:text-[#191F28] flex items-center gap-0.5"
        >
          <span>전체 저장소</span>
          <ChevronRight className="w-4 h-4 text-[#8B95A1]" />
        </a>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        {featuredProjects.map((project) => (
          <div
            key={project.id}
            className="tds-card p-5 sm:p-6 bg-white hover:border-[#B0B8C1] transition-colors"
          >
            {/* Top row: badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F3FF] text-[#3182F6]">
                {project.badge}
              </span>
              <span className="text-[13px] font-medium text-[#8B95A1]">
                {project.tagline}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-[18px] sm:text-[19px] font-bold text-[#191F28] tracking-tight mb-2">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-[14px] sm:text-[15px] text-[#4E5968] leading-relaxed mb-4 break-keep">
              {project.description}
            </p>

            {/* Tags (TDS chip style) */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="bg-[#F2F4F6] text-[#4E5968] text-[12px] font-medium px-2.5 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#E5E8EB]">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tds-btn-secondary px-4 text-[13px] sm:text-[14px] flex items-center gap-1.5 flex-1 sm:flex-initial"
                >
                  <GithubIcon className="w-4 h-4 fill-[#191F28]" />
                  <span>코드 보기</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tds-btn-primary px-4 text-[13px] sm:text-[14px] flex items-center gap-1.5 flex-1 sm:flex-initial"
                >
                  <span>체험하기</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
