"use client";

import { useMemo } from "react";
import { LottoEpisode } from "@/types/lotto";
import {
  analyzeData,
  getRangeDistribution,
  getNotAppearedNumbers,
  getTopPairs,
} from "@/lib/analysis";
import LottoBall from "./LottoBall";
import GlassCard from "./GlassCard";

interface StatisticsPanelProps {
  episodes: LottoEpisode[];
}

export default function StatisticsPanel({ episodes }: StatisticsPanelProps) {
  const stats = useMemo(
    () => (episodes.length > 0 ? analyzeData(episodes) : null),
    [episodes]
  );
  const rangeDistribution = useMemo(
    () => getRangeDistribution(episodes),
    [episodes]
  );
  const notAppeared = useMemo(
    () => getNotAppearedNumbers(episodes, 10),
    [episodes]
  );
  const topPairs = useMemo(() => getTopPairs(episodes, 15), [episodes]);

  if (!stats) return null;

  const maxFreq = stats.frequencies[0].count;
  const oddPct = (
    (stats.oddEvenRatio.odd /
      (stats.oddEvenRatio.odd + stats.oddEvenRatio.even)) *
    100
  ).toFixed(1);
  const evenPct = (
    (stats.oddEvenRatio.even /
      (stats.oddEvenRatio.odd + stats.oddEvenRatio.even)) *
    100
  ).toFixed(1);
  const lowPct = (
    (stats.highLowRatio.low /
      (stats.highLowRatio.high + stats.highLowRatio.low)) *
    100
  ).toFixed(1);
  const highPct = (
    (stats.highLowRatio.high /
      (stats.highLowRatio.high + stats.highLowRatio.low)) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-5">
      {/* 번호별 출현 빈도 */}
      <GlassCard className="p-6 md:p-8" delay={0}>
        <h2 className="text-lg font-semibold mb-5 text-white/80">
          번호별 출현 빈도
        </h2>
        <div className="space-y-1">
          {stats.frequencies.map(({ number, count, percentage }) => (
            <div key={number} className="flex items-center gap-2">
              <LottoBall number={number} size="sm" />
              <div className="flex-1 h-4 bg-white/[0.03] rounded-full bar-shimmer">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(count / maxFreq) * 100}%`,
                    background:
                      "linear-gradient(90deg, rgba(99,102,241,0.6), rgba(168,85,247,0.4))",
                  }}
                />
              </div>
              <span className="text-[11px] text-white/25 w-20 text-right font-mono">
                {count}회 ({percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 구간별 분포 */}
      <GlassCard className="p-6 md:p-8" delay={60}>
        <h2 className="text-lg font-semibold mb-5 text-white/80">
          번호대별 분포
        </h2>
        <div className="grid grid-cols-5 gap-3">
          {rangeDistribution.map(({ range, count, percentage }) => (
            <div key={range} className="text-center">
              <div className="text-[11px] text-white/40 font-medium">
                {range}
              </div>
              <div className="mt-2 h-32 bg-white/[0.03] rounded-xl relative overflow-hidden border border-white/[0.04]">
                <div
                  className="absolute bottom-0 w-full rounded-xl"
                  style={{
                    height: `${percentage * 4}%`,
                    background:
                      "linear-gradient(to top, rgba(99,102,241,0.5), rgba(99,102,241,0.15))",
                  }}
                />
              </div>
              <div className="mt-1.5 text-[11px] text-white/30 font-mono">
                {percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-5" delay={120}>
          <h3 className="text-sm font-semibold mb-3 text-white/70">
            홀짝 비율
          </h3>
          <div className="flex justify-between text-[11px] mb-2">
            <span className="text-blue-400/70">홀수 {oddPct}%</span>
            <span className="text-pink-400/70">짝수 {evenPct}%</span>
          </div>
          <div className="h-3 bg-white/[0.03] rounded-full overflow-hidden flex">
            <div
              className="h-full"
              style={{
                width: `${oddPct}%`,
                background:
                  "linear-gradient(90deg, rgba(59,130,246,0.5), rgba(99,102,241,0.4))",
              }}
            />
            <div
              className="h-full flex-1"
              style={{
                background:
                  "linear-gradient(90deg, rgba(236,72,153,0.3), rgba(236,72,153,0.5))",
              }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5" delay={150}>
          <h3 className="text-sm font-semibold mb-3 text-white/70">
            고저 비율
          </h3>
          <div className="flex justify-between text-[11px] mb-2">
            <span className="text-emerald-400/70">저(1~22) {lowPct}%</span>
            <span className="text-amber-400/70">고(23~45) {highPct}%</span>
          </div>
          <div className="h-3 bg-white/[0.03] rounded-full overflow-hidden flex">
            <div
              className="h-full"
              style={{
                width: `${lowPct}%`,
                background:
                  "linear-gradient(90deg, rgba(16,185,129,0.4), rgba(20,184,166,0.5))",
              }}
            />
            <div
              className="h-full flex-1"
              style={{
                background:
                  "linear-gradient(90deg, rgba(245,158,11,0.3), rgba(245,158,11,0.5))",
              }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5" delay={180}>
          <h3 className="text-sm font-semibold mb-3 text-white/70">
            합계 분석
          </h3>
          <div className="space-y-2">
            {[
              { l: "최소", v: stats.sumRange.min },
              { l: "최대", v: stats.sumRange.max },
              { l: "평균", v: stats.sumRange.avg },
            ].map((r) => (
              <div
                key={r.l}
                className="flex justify-between text-[12px]"
              >
                <span className="text-white/30">{r.l}</span>
                <span className="text-white/60 font-mono">{r.v}</span>
              </div>
            ))}
            <div className="flex justify-between text-[12px] pt-2 border-t border-white/[0.06]">
              <span className="text-white/30">최빈 구간</span>
              <span className="text-indigo-400/80 font-mono font-semibold">
                {stats.sumRange.mostCommonRange[0]}~
                {stats.sumRange.mostCommonRange[1]}
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5" delay={210}>
          <h3 className="text-sm font-semibold mb-3 text-white/70">
            연속번호
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-white/30">포함</span>
              <span className="text-white/60 font-mono">
                {stats.consecutivePatterns.withConsecutive}회 (
                {(
                  (stats.consecutivePatterns.withConsecutive / episodes.length) *
                  100
                ).toFixed(1)}
                %)
              </span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-white/30">미포함</span>
              <span className="text-white/60 font-mono">
                {stats.consecutivePatterns.withoutConsecutive}회 (
                {(
                  (stats.consecutivePatterns.withoutConsecutive /
                    episodes.length) *
                  100
                ).toFixed(1)}
                %)
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 미출현 */}
      {notAppeared.length > 0 && (
        <GlassCard className="p-6 md:p-8" delay={240}>
          <h2 className="text-lg font-semibold mb-5 text-white/80">
            최근 10회 미출현
          </h2>
          <div className="flex flex-wrap gap-4">
            {notAppeared.map(({ number, missingRounds }) => (
              <div key={number} className="flex flex-col items-center gap-1.5">
                <LottoBall number={number} />
                <span className="text-[10px] text-red-400/50 font-mono">
                  {missingRounds}회
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 쌍 */}
      <GlassCard className="p-6 md:p-8" delay={280}>
        <h2 className="text-lg font-semibold mb-5 text-white/80">
          자주 함께 나오는 쌍 Top 15
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {topPairs.map(({ pair, count }, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-2.5 glass-sm"
            >
              <span className="text-[10px] text-white/20 font-mono w-4">
                {idx + 1}
              </span>
              <LottoBall number={pair[0]} size="sm" />
              <LottoBall number={pair[1]} size="sm" />
              <span className="text-[11px] text-white/25 ml-auto font-mono">
                {count}회
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
