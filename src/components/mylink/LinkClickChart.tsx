"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { LinkStatEntry } from "@/lib/link-stats";

interface LinkClickChartProps {
  data: LinkStatEntry[];
  totalLinks: number;
  totalClicks: number;
}

const chartConfig = {
  clickCount: {
    label: "클릭 수",
    color: "#3182F6",
  },
} satisfies ChartConfig;

/**
 * Renders a TDS-styled shadcn BarChart comparing click counts across user links.
 */
export function LinkClickChart({
  data,
  totalLinks,
  totalClicks,
}: LinkClickChartProps) {
  const maxClicks = data.reduce(
    (max, item) => (item.clickCount > max ? item.clickCount : max),
    0
  );

  return (
    <Card className="rounded-[24px] border border-[#E5E8EB] bg-white p-5 sm:p-6 shadow-2xs gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-bold tracking-tight text-[#191F28]">
            링크별 클릭 분포
          </h2>
          <p className="mt-0.5 text-[12px] text-[#8B95A1]">
            {totalLinks > data.length
              ? `클릭 수가 높은 상위 ${data.length}개 링크예요`
              : "등록된 링크의 클릭 수를 비교해요"}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-[#F2F4F6] px-2.5 py-1 text-[11px] font-semibold text-[#6B7684] tabular-nums">
          단위: 회
        </span>
      </div>

      {totalClicks === 0 && (
        <div className="rounded-xl bg-[#F9FAFB] px-3.5 py-2.5 text-[12px] text-[#6B7684] border border-[#F2F4F6]">
          아직 발생한 클릭이 없어요. 내 링크 페이지를 공유하고 첫 클릭을 받아보세요!
        </div>
      )}

      <ChartContainer config={chartConfig} className="h-[220px] w-full aspect-auto">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#F2F4F6" />
          <XAxis
            dataKey="shortTitle"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            tick={{ fill: "#8B95A1", fontSize: 11, fontWeight: 500 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={40}
            domain={[0, (dataMax: number) => Math.max(dataMax, 4)]}
            tick={{ fill: "#8B95A1", fontSize: 11 }}
          />
          <ChartTooltip
            cursor={{ fill: "#F2F4F6", radius: 8 }}
            content={
              <ChartTooltipContent
                className="rounded-xl border-[#E5E8EB] bg-white px-3 py-2 shadow-md"
                labelClassName="text-[12px] font-bold text-[#191F28] mb-1"
                labelFormatter={(_label, payload) => {
                  const item = payload?.[0]?.payload as LinkStatEntry | undefined;
                  return item?.title ?? "";
                }}
                formatter={(value) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-[12px] text-[#6B7684]">
                      <span className="h-2 w-2 rounded-[2px] bg-[#3182F6]" />
                      클릭 수
                    </span>
                    <span className="text-[12px] font-bold text-[#191F28] tabular-nums">
                      {Number(value).toLocaleString("ko-KR")}회
                    </span>
                  </div>
                )}
              />
            }
          />
          <Bar dataKey="clickCount" radius={[6, 6, 0, 0]} maxBarSize={36}>
            {data.map((entry) => {
              const isTop = maxClicks > 0 && entry.clickCount === maxClicks;
              return (
                <Cell
                  key={entry.id}
                  fill={isTop ? "#3182F6" : "#E5E8EB"}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
