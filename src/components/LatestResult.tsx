"use client";

import { LottoEpisode } from "@/types/lotto";
import LottoBall from "./LottoBall";
import GlassCard from "./GlassCard";

interface LatestResultProps {
  episode: LottoEpisode;
}

function formatDate(ymd: string): string {
  return `${ymd.slice(0, 4)}.${ymd.slice(4, 6)}.${ymd.slice(6, 8)}`;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

export default function LatestResult({ episode }: LatestResultProps) {
  const numbers = [
    episode.tm1WnNo,
    episode.tm2WnNo,
    episode.tm3WnNo,
    episode.tm4WnNo,
    episode.tm5WnNo,
    episode.tm6WnNo,
  ];

  const prizes = [
    { label: "1등", people: episode.rnk1WnNope, amount: episode.rnk1WnAmt, big: true },
    { label: "2등", people: episode.rnk2WnNope, amount: episode.rnk2WnAmt, big: false },
    { label: "3등", people: episode.rnk3WnNope, amount: episode.rnk3WnAmt, big: false },
  ];

  return (
    <GlassCard className="p-6 md:p-8">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <span className="text-xs text-white/30 font-mono">
            제 {episode.ltEpsd}회
          </span>
          <h2 className="text-lg font-semibold text-white/80 mt-0.5">
            최신 당첨결과
          </h2>
        </div>
        <span className="text-xs text-white/25 font-mono">
          {formatDate(episode.ltRflYmd)}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-8 justify-center flex-wrap">
        {numbers.map((n, i) => (
          <LottoBall key={i} number={n} size="lg" animate delay={i * 80} />
        ))}
        <LottoBall
          number={episode.bnsWnNo}
          size="lg"
          isBonus
          animate
          delay={560}
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {prizes.map((p) => (
          <div key={p.label} className="glass-sm p-3 text-center">
            <div className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
              {p.label}
            </div>
            <div className={`font-semibold mt-1 ${p.big ? "text-base text-white/90" : "text-sm text-white/60"}`}>
              {p.people}명
            </div>
            <div className="text-[11px] text-white/30 mt-0.5 font-mono">
              {formatMoney(p.amount)}원
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
