import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 완벽 가이드 - 구매 방법, 당첨 확률, 수령 방법",
  description:
    "로또 6/45 구매 방법, 당첨 등급별 확률, 당첨금 수령 방법, 번호 선택 전략, AI 딥러닝(LSTM) 알고리즘 분석까지. 로또에 대한 모든 것을 알려드립니다.",
  keywords: [
    "로또 구매 방법",
    "로또 당첨 확률",
    "로또 당첨금 수령",
    "로또 세금",
    "로또 번호 선택 방법",
    "로또 가이드",
    "로또 인터넷 구매",
    "로또 FAQ",
    "로또 딥러닝",
    "로또 LSTM",
    "로또 인공지능",
    "로또번호생성기",
    "로또 생성기",
    "로또 1등 예측",
    "로또 AI 예측",
  ],
  alternates: {
    canonical: "/guide",
  },
  openGraph: {
    title: "로또 완벽 가이드 - 구매 방법, 당첨 확률, 수령 방법",
    description:
      "로또 6/45 구매 방법, 당첨 등급별 확률, 당첨금 수령 방법, 번호 선택 전략까지 완벽 가이드.",
    url: "https://lotto.beomv.com/guide",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
