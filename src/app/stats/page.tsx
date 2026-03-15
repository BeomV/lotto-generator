"use client";

import { useState, useEffect } from "react";
import { LottoEpisode, LottoApiResponse } from "@/types/lotto";
import {
  analyzeData,
  getRangeDistribution,
  getNotAppearedNumbers,
  getTopPairs,
} from "@/lib/analysis";
import LottoBall from "@/components/LottoBall";
import GlassCard from "@/components/GlassCard";
import Particles from "@/components/Particles";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function StatsPage() {
  const [episodes, setEpisodes] = useState<LottoEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lotto?start=1&end=9999")
      .then((res) => res.json())
      .then((data: LottoApiResponse) => {
        if (data.data?.list) {
          setEpisodes(data.data.list.sort((a, b) => a.ltEpsd - b.ltEpsd));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = episodes.length > 0 ? analyzeData(episodes) : null;
  const rangeDist = episodes.length > 0 ? getRangeDistribution(episodes) : [];
  const missingNums =
    episodes.length > 0 ? getNotAppearedNumbers(episodes, 10) : [];
  const topPairs = episodes.length > 0 ? getTopPairs(episodes, 15) : [];

  return (
    <div className="bg-ambient">
      <Particles />
      <div className="relative z-10">
        <header className="pt-14 pb-2 text-center">
          <h1 className="text-4xl md:text-5xl font-bold title-gradient tracking-tight">
            로또 번호 통계 분석
          </h1>
          <p className="text-white mt-2 text-sm">
            {loading
              ? "데이터 로딩 중..."
              : `1~${episodes[episodes.length - 1]?.ltEpsd}회차 기준 분석`}
          </p>
        </header>

        <nav className="flex justify-center gap-3 py-4 text-sm">
          <Link
            href="/"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            번호생성
          </Link>
          <span className="text-white/20">|</span>
          <Link
            href="/results"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            당첨결과
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/80 font-semibold">통계분석</span>
          <span className="text-white/20">|</span>
          <Link
            href="/guide"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            가이드
          </Link>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-4">
          <AdBanner slot="9834712972" format="auto" />
        </div>

        <main className="max-w-2xl mx-auto px-4 pb-16 space-y-5">
          {loading && (
            <div className="glass p-14 text-center">
              <div className="spinner mx-auto" />
              <p className="mt-5 text-white/30 text-sm">통계 데이터 분석 중...</p>
            </div>
          )}

          {stats && (
            <>
              {/* 핫넘버 / 콜드넘버 */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  핫넘버 & 콜드넘버
                </h2>
                <p className="text-xs text-white/30 mb-3">
                  역대 전체 회차에서 가장 많이/적게 출현한 번호
                </p>
                <div className="mb-4">
                  <h3 className="text-sm text-white/50 mb-2">
                    핫넘버 (가장 많이 출현)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.hotNumbers.map((n) => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-white/50 mb-2">
                    콜드넘버 (가장 적게 출현)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.coldNumbers.map((n) => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* 최근 50회 핫/콜드 */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  최근 50회 트렌드
                </h2>
                <p className="text-xs text-white/30 mb-3">
                  최근 50회차에서 자주/드물게 출현한 번호
                </p>
                <div className="mb-4">
                  <h3 className="text-sm text-white/50 mb-2">최근 핫넘버</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.recentHot.map((n) => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-white/50 mb-2">최근 콜드넘버</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.recentCold.map((n) => (
                      <LottoBall key={n} number={n} size="sm" />
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* 번호 출현 빈도 */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  번호별 출현 빈도
                </h2>
                <div className="space-y-1.5">
                  {stats.frequencies.map((f) => (
                    <div key={f.number} className="flex items-center gap-2">
                      <LottoBall number={f.number} size="sm" />
                      <div className="flex-1 h-4 rounded-full overflow-hidden bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500/60 to-blue-500/60"
                          style={{
                            width: `${(f.count / stats.frequencies[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-white/40 w-12 text-right font-mono">
                        {f.count}회
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* 번호대별 분포 */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  번호대별 출현 분포
                </h2>
                <div className="space-y-3">
                  {rangeDist.map((r) => (
                    <div key={r.range} className="flex items-center gap-3">
                      <span className="text-sm text-white/50 w-14">
                        {r.range}
                      </span>
                      <div className="flex-1 h-5 rounded-full overflow-hidden bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-teal-500/60"
                          style={{ width: `${r.percentage * 5}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40 w-16 text-right font-mono">
                        {r.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* 홀짝 / 고저 비율 */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  홀짝 · 고저 비율
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-sm p-4 text-center">
                    <div className="text-xs text-white/30 mb-2">홀수 : 짝수</div>
                    <div className="text-lg font-semibold text-white/70">
                      {(
                        (stats.oddEvenRatio.odd /
                          (stats.oddEvenRatio.odd + stats.oddEvenRatio.even)) *
                        100
                      ).toFixed(1)}
                      % :{" "}
                      {(
                        (stats.oddEvenRatio.even /
                          (stats.oddEvenRatio.odd + stats.oddEvenRatio.even)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                  <div className="glass-sm p-4 text-center">
                    <div className="text-xs text-white/30 mb-2">
                      저번호(1~22) : 고번호(23~45)
                    </div>
                    <div className="text-lg font-semibold text-white/70">
                      {(
                        (stats.highLowRatio.low /
                          (stats.highLowRatio.high + stats.highLowRatio.low)) *
                        100
                      ).toFixed(1)}
                      % :{" "}
                      {(
                        (stats.highLowRatio.high /
                          (stats.highLowRatio.high + stats.highLowRatio.low)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* 합계 분석 */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  당첨번호 합계 분석
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="glass-sm p-3 text-center">
                    <div className="text-xs text-white/30">최소 합계</div>
                    <div className="text-lg font-semibold text-white/70 mt-1">
                      {stats.sumRange.min}
                    </div>
                  </div>
                  <div className="glass-sm p-3 text-center">
                    <div className="text-xs text-white/30">최대 합계</div>
                    <div className="text-lg font-semibold text-white/70 mt-1">
                      {stats.sumRange.max}
                    </div>
                  </div>
                  <div className="glass-sm p-3 text-center">
                    <div className="text-xs text-white/30">평균 합계</div>
                    <div className="text-lg font-semibold text-white/70 mt-1">
                      {stats.sumRange.avg}
                    </div>
                  </div>
                  <div className="glass-sm p-3 text-center">
                    <div className="text-xs text-white/30">최빈 구간</div>
                    <div className="text-lg font-semibold text-white/70 mt-1">
                      {stats.sumRange.mostCommonRange[0]}~
                      {stats.sumRange.mostCommonRange[1]}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* 연속번호 패턴 */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  연속번호 출현 패턴
                </h2>
                <p className="text-xs text-white/30 mb-3">
                  당첨번호에 연속된 숫자(예: 5,6)가 포함된 비율
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-sm p-4 text-center">
                    <div className="text-xs text-white/30 mb-1">연속번호 포함</div>
                    <div className="text-2xl font-bold text-cyan-400/80">
                      {(
                        (stats.consecutivePatterns.withConsecutive /
                          (stats.consecutivePatterns.withConsecutive +
                            stats.consecutivePatterns.withoutConsecutive)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-xs text-white/25 mt-1">
                      {stats.consecutivePatterns.withConsecutive}회
                    </div>
                  </div>
                  <div className="glass-sm p-4 text-center">
                    <div className="text-xs text-white/30 mb-1">연속번호 없음</div>
                    <div className="text-2xl font-bold text-white/50">
                      {(
                        (stats.consecutivePatterns.withoutConsecutive /
                          (stats.consecutivePatterns.withConsecutive +
                            stats.consecutivePatterns.withoutConsecutive)) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-xs text-white/25 mt-1">
                      {stats.consecutivePatterns.withoutConsecutive}회
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* 미출현 번호 */}
              {missingNums.length > 0 && (
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-white/80 mb-4">
                    최근 10회 미출현 번호
                  </h2>
                  <p className="text-xs text-white/30 mb-3">
                    최근 10회차 동안 한 번도 나오지 않은 번호들
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {missingNums.map((m) => (
                      <div key={m.number} className="flex flex-col items-center gap-1">
                        <LottoBall number={m.number} size="sm" />
                        <span className="text-[10px] text-white/25">
                          {m.missingRounds}회 미출현
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* 자주 같이 나오는 번호 쌍 */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white/80 mb-4">
                  자주 같이 나오는 번호 조합 TOP 15
                </h2>
                <div className="space-y-2">
                  {topPairs.map((p, i) => (
                    <div
                      key={`${p.pair[0]}-${p.pair[1]}`}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs text-white/25 w-6 text-right">
                        {i + 1}.
                      </span>
                      <LottoBall number={p.pair[0]} size="sm" />
                      <LottoBall number={p.pair[1]} size="sm" />
                      <span className="text-xs text-white/40 font-mono">
                        {p.count}회 동시 출현
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          <div className="pt-4">
            <AdBanner slot="8322320759" format="auto" />
          </div>

          <footer className="text-center text-xs text-white/15 pt-4 pb-4">
            <p>통계 참고용이며 당첨을 보장하지 않습니다</p>
            <p className="mt-0.5">데이터 출처: 동행복권</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
