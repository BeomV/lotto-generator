"use client";

import { useState, useEffect } from "react";
import { LottoEpisode, LottoApiResponse } from "@/types/lotto";
import { getWinningNumbers } from "@/lib/analysis";
import LottoBall from "@/components/LottoBall";
import GlassCard from "@/components/GlassCard";
import Particles from "@/components/Particles";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

function formatDate(ymd: string): string {
  return `${ymd.slice(0, 4)}.${ymd.slice(4, 6)}.${ymd.slice(6, 8)}`;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

export default function ResultsPage() {
  const [episodes, setEpisodes] = useState<LottoEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCount, setShowCount] = useState(20);

  useEffect(() => {
    fetch("/api/lotto?start=1&end=9999")
      .then((res) => res.json())
      .then((data: LottoApiResponse) => {
        if (data.data?.list) {
          const sorted = data.data.list.sort(
            (a, b) => b.ltEpsd - a.ltEpsd
          );
          setEpisodes(sorted);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-ambient">
      <Particles />
      <div className="relative z-10">
        <header className="pt-14 pb-2 text-center">
          <h1 className="text-4xl md:text-5xl font-bold title-gradient tracking-tight">
            로또 당첨번호 결과
          </h1>
          <p className="text-white mt-2 text-sm">
            역대 로또 6/45 당첨번호 전체 기록
          </p>
        </header>

        <nav className="flex justify-center gap-3 py-4 text-sm">
          <Link href="/" className="text-white/40 hover:text-white/80 transition-colors">
            번호생성
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/80 font-semibold">당첨결과</span>
          <span className="text-white/20">|</span>
          <Link href="/stats" className="text-white/40 hover:text-white/80 transition-colors">
            통계분석
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/guide" className="text-white/40 hover:text-white/80 transition-colors">
            가이드
          </Link>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-4">
          <AdBanner slot="9834712972" format="auto" />
        </div>

        <main className="max-w-2xl mx-auto px-4 pb-16 space-y-4">
          {loading && (
            <div className="glass p-14 text-center">
              <div className="spinner mx-auto" />
              <p className="mt-5 text-white/30 text-sm">당첨 데이터를 불러오는 중...</p>
            </div>
          )}

          {!loading && episodes.slice(0, showCount).map((ep) => {
            const numbers = getWinningNumbers(ep);
            return (
              <GlassCard key={ep.ltEpsd} className="p-5">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-white/30 font-mono">
                      제 {ep.ltEpsd}회
                    </span>
                    <span className="text-xs text-white/25 font-mono ml-3">
                      {formatDate(ep.ltRflYmd)}
                    </span>
                  </div>
                  <div className="text-xs text-white/30">
                    1등 {ep.rnk1WnNope}명 · {formatMoney(ep.rnk1WnAmt)}원
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center flex-wrap">
                  {numbers.map((n, i) => (
                    <LottoBall key={i} number={n} size="md" />
                  ))}
                  <LottoBall number={ep.bnsWnNo} size="md" isBonus />
                </div>
              </GlassCard>
            );
          })}

          {!loading && showCount < episodes.length && (
            <button
              onClick={() => setShowCount((c) => c + 20)}
              className="btn-glass w-full py-3 text-sm"
            >
              더 보기 ({showCount} / {episodes.length}회차)
            </button>
          )}

          <div className="pt-4">
            <AdBanner slot="8322320759" format="auto" />
          </div>

          <footer className="text-center text-xs text-white/15 pt-4 pb-4">
            <p>데이터 출처: 동행복권</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
