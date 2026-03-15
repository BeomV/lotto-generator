"use client";

import { useState, useEffect } from "react";
import { LottoEpisode, LottoApiResponse } from "@/types/lotto";
import LottoGenerator from "@/components/LottoGenerator";
import SmartPick from "@/components/SmartPick";
import StatisticsPanel from "@/components/StatisticsPanel";
import LatestResult from "@/components/LatestResult";
import Particles from "@/components/Particles";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

type Tab = "generator" | "smart" | "statistics";

export default function Home() {
  const [episodes, setEpisodes] = useState<LottoEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("generator");
  const [latestEpisode, setLatestEpisode] = useState<number>(1215);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/lotto?start=1&end=${latestEpisode}`);
      if (!res.ok) throw new Error("데이터를 불러오지 못했습니다");
      const data: LottoApiResponse = await res.json();
      if (data.data?.list) {
        const sorted = data.data.list.sort((a, b) => a.ltEpsd - b.ltEpsd);
        setEpisodes(sorted);
        if (sorted.length > 0) {
          setLatestEpisode(sorted[sorted.length - 1].ltEpsd);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "generator", label: "번호 생성" },
    { key: "smart", label: "AI 추천" },
    { key: "statistics", label: "통계 분석" },
  ];

  return (
    <div className="bg-ambient">
      <Particles />

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-14 pb-2 text-center">
          <h1 className="text-4xl md:text-5xl font-bold title-gradient tracking-tight">
            로또번호생성기
          </h1>
          <p className="text-white mt-2 text-sm">
            {loading
              ? "데이터 로딩 중..."
              : `1~${latestEpisode}회차 당첨번호 통계 분석 완료`}
          </p>
        </header>

        <nav className="flex justify-center gap-3 py-2 text-sm">
          <span className="text-white/80 font-semibold">번호생성</span>
          <span className="text-white/20">|</span>
          <Link href="/results" className="text-white/40 hover:text-white/80 transition-colors">
            당첨결과
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/stats" className="text-white/40 hover:text-white/80 transition-colors">
            통계분석
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/guide" className="text-white/40 hover:text-white/80 transition-colors">
            가이드
          </Link>
        </nav>

        {/* 상단 타이틀 광고 */}
        <div className="max-w-2xl mx-auto px-4 py-4">
          <AdBanner slot="9834712972" format="auto" />
        </div>

        <div className="flex justify-center gap-5 px-4 max-w-7xl mx-auto">
          {/* 왼쪽 중단 광고 */}
          <div className="hidden xl:block w-[160px] shrink-0 sticky top-4 self-start">
            <AdBanner slot="1948484094" format="auto" />
          </div>

        <main className="max-w-2xl w-full px-4 pb-16 space-y-5">
          {error && (
            <div className="glass p-4 text-sm text-red-300/70">
              {error}
              <button
                onClick={fetchData}
                className="ml-2 underline text-white/50 hover:text-white/80 transition-colors"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 최신 당첨 */}
          {!loading && episodes.length > 0 && (
            <LatestResult episode={episodes[episodes.length - 1]} />
          )}

          {/* Tabs */}
          <div className="glass flex gap-1 p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-item ${activeTab === tab.key ? "active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="glass p-14 text-center">
              <div className="spinner mx-auto" />
              <p className="mt-5 text-white/30 text-sm">
                역대 당첨 데이터를 불러오는 중...
              </p>
            </div>
          )}

          {/* Content */}
          {!loading && (
            <>
              {activeTab === "generator" && <LottoGenerator />}
              {activeTab === "smart" && <SmartPick episodes={episodes} />}
              {activeTab === "statistics" && (
                <StatisticsPanel episodes={episodes} />
              )}
            </>
          )}

          {/* 하단 광고 */}
          <div className="pt-4">
            <AdBanner slot="8322320759" format="auto" />
          </div>

          <footer className="text-center text-xs text-white/15 pt-4 pb-4">
            <p>통계 참고용이며 당첨을 보장하지 않습니다</p>
            <p className="mt-0.5">데이터 출처: 동행복권</p>
          </footer>
        </main>

          {/* 우측 중단 광고 */}
          <div className="hidden xl:block w-[160px] shrink-0 sticky top-4 self-start">
            <AdBanner slot="5727947005" format="autorelaxed" />
          </div>
        </div>
      </div>
    </div>
  );
}
