"use client";

import { useState } from "react";
import { LottoEpisode } from "@/types/lotto";
import { predictNumbers, LstmPrediction } from "@/lib/lstm-predict";
import LottoBall from "./LottoBall";
import GlassCard from "./GlassCard";

interface DeepPickProps {
  episodes: LottoEpisode[];
}

type Status = "idle" | "loading-model" | "predicting" | "done" | "error";

export default function DeepPick({ episodes }: DeepPickProps) {
  const [count, setCount] = useState(5);
  const [status, setStatus] = useState<Status>("idle");
  const [prediction, setPrediction] = useState<LstmPrediction | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [genKey, setGenKey] = useState(0);

  const handlePredict = async () => {
    setStatus("loading-model");
    setPrediction(null);
    setErrorMsg("");

    try {
      setStatus("predicting");
      const result = await predictNumbers(episodes, count);
      setPrediction(result);
      setGenKey((k) => k + 1);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "모델 로드 실패");
      setStatus("error");
    }
  };

  const statusText: Record<Status, string> = {
    idle: "딥러닝 추천 생성",
    "loading-model": "모델 로딩 중...",
    predicting: "신경망 추론 중...",
    done: "딥러닝 추천 생성",
    error: "다시 시도",
  };

  return (
    <GlassCard className="p-6 md:p-8">
      <h2 className="text-lg font-semibold text-white/80">
        AI 딥러닝(LSTM) 번호 예측
      </h2>
      <p className="text-xs text-white/25 mt-1 mb-6">
        인공지능 LSTM 신경망 모델이 {episodes.length}회차까지의 누적 당첨 패턴을 시계열 분석하여 최적의 번호를 예측합니다.
      </p>

      {/* 모델 정보 */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        <div className="glass-sm p-3">
          <div className="text-[10px] text-white/30 font-medium">모델</div>
          <div className="text-sm text-white/60 mt-1">
            LSTM (128→64)
          </div>
        </div>
        <div className="glass-sm p-3">
          <div className="text-[10px] text-white/30 font-medium">입력</div>
          <div className="text-sm text-white/60 mt-1">
            최근 10회차 패턴
          </div>
        </div>
      </div>

      {/* 확률 분포 (예측 후) */}
      {prediction && (
        <div className="mb-6">
          <div className="text-[11px] text-white/30 mb-2 font-medium">
            예측 확률 상위 번호
          </div>
          <div className="glass-sm p-3">
            <div className="flex flex-wrap gap-1.5">
              {prediction.topNumbers.slice(0, 12).map((item, i) => (
                <div key={item.number} className="flex flex-col items-center gap-0.5">
                  <LottoBall
                    number={item.number}
                    size="sm"
                    animate
                    delay={i * 40}
                  />
                  <span className="text-[9px] text-white/25 font-mono">
                    {(item.probability * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 생성 컨트롤 */}
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
          onClick={handlePredict}
          disabled={status === "loading-model" || status === "predicting"}
          className="btn-glass btn-deep"
        >
          {status === "loading-model" || status === "predicting" ? (
            <span className="flex items-center gap-2">
              <span className="spinner-sm" />
              {statusText[status]}
            </span>
          ) : (
            statusText[status]
          )}
        </button>
      </div>

      {/* 에러 */}
      {status === "error" && (
        <div className="glass-sm p-3 mb-4 text-sm text-red-300/70">
          {errorMsg}
        </div>
      )}

      {/* 결과 */}
      {prediction && prediction.numbers.length > 0 && (
        <div className="space-y-2.5">
          {prediction.numbers.map((nums, idx) => (
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
          2층 LSTM 신경망이 최근 10회차의 당첨번호 패턴을 학습하여 다음
          회차의 각 번호 출현 확률을 예측합니다. 확률 기반 가중치 샘플링으로
          번호를 생성합니다.
        </p>
      </div>
    </GlassCard>
  );
}
