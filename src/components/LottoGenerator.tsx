"use client";

import { useState, useCallback } from "react";
import LottoBall from "./LottoBall";
import GlassCard from "./GlassCard";

export default function LottoGenerator() {
  const [numbers, setNumbers] = useState<number[][]>([]);
  const [count, setCount] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [genKey, setGenKey] = useState(0);

  const generate = useCallback(() => {
    setIsAnimating(true);
    setNumbers([]);
    const results: number[][] = [];
    for (let i = 0; i < count; i++) {
      const nums = new Set<number>();
      while (nums.size < 6) {
        nums.add(Math.floor(Math.random() * 45) + 1);
      }
      results.push(Array.from(nums).sort((a, b) => a - b));
    }
    setTimeout(() => {
      setNumbers(results);
      setGenKey((k) => k + 1);
      setIsAnimating(false);
    }, 200);
  }, [count]);

  return (
    <GlassCard className="p-6 md:p-8">
      <h2 className="text-lg font-semibold mb-6 text-white/80">
        랜덤 번호 생성
      </h2>

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
          onClick={generate}
          disabled={isAnimating}
          className="btn-glass btn-primary"
        >
          {isAnimating ? "생성중..." : "번호 생성"}
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
    </GlassCard>
  );
}
