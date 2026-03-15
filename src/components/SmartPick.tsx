"use client";

import { useState } from "react";
import { LottoEpisode } from "@/types/lotto";
import { generateSmartNumbers, analyzeData } from "@/lib/analysis";
import LottoBall from "./LottoBall";
import GlassCard from "./GlassCard";

interface SmartPickProps {
  episodes: LottoEpisode[];
}

export default function SmartPick({ episodes }: SmartPickProps) {
  const [numbers, setNumbers] = useState<number[][]>([]);
  const [count, setCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genKey, setGenKey] = useState(0);

  const stats = episodes.length > 0 ? analyzeData(episodes) : null;

  const handleGenerate = () => {
    setIsGenerating(true);
    setNumbers([]);
    setTimeout(() => {
      const result = generateSmartNumbers(episodes, count);
      setNumbers(result);
      setGenKey((k) => k + 1);
      setIsGenerating(false);
    }, 500);
  };

  if (!stats) return null;

  const sections = [
    { label: "핫 넘버", sub: "전체", nums: stats.hotNumbers.slice(0, 6) },
    { label: "콜드 넘버", sub: "전체", nums: stats.coldNumbers.slice(0, 6) },
    { label: "최근 핫", sub: "50회", nums: stats.recentHot.slice(0, 6) },
    { label: "최근 콜드", sub: "50회", nums: stats.recentCold.slice(0, 6) },
  ];

  return (
    <GlassCard className="p-6 md:p-8">
      <h2 className="text-lg font-semibold text-white/80">AI 분석 추천</h2>
      <p className="text-xs text-white/25 mt-1 mb-6">
        {episodes.length}회차 데이터 기반 통계 분석
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-8">
        {sections.map((sec) => (
          <div key={sec.label} className="glass-sm p-3">
            <div className="text-[10px] text-white/30 font-medium">
              {sec.label}
              <span className="text-white/15 ml-1">{sec.sub}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {sec.nums.map((n) => (
                <LottoBall key={n} number={n} size="sm" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="select-glass"
        >
          {[1, 3, 5, 10].map((n) => (
            <option key={n} value={n}>
              {n}게임
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-glass btn-primary"
        >
          {isGenerating ? "분석중..." : "추천 번호 생성"}
        </button>
      </div>

      {numbers.length > 0 && (
        <div className="space-y-2.5">
          {numbers.map((nums, idx) => (
            <div
              key={`${genKey}-${idx}`}
              className="flex items-center gap-3 p-3.5 rounded-xl glass-sm fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <span className="text-xs text-white/25 font-mono w-5">
                {String.fromCharCode(65 + idx)}
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {nums.map((n, i) => (
                  <LottoBall
                    key={`${genKey}-${idx}-${i}`}
                    number={n}
                    animate
                    delay={idx * 60 + i * 50}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 glass-sm p-3">
        <p className="text-[11px] text-white/25 leading-relaxed">
          출현 빈도(30%) + 최근 트렌드(25%) + 미출현 리바운드(15%) + 홀짝/고저
          균형 + 합계 범위 최적화
        </p>
      </div>
    </GlassCard>
  );
}
