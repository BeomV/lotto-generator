import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 번호 통계 분석 - 핫넘버, 콜드넘버, 출현 빈도",
  description:
    "로또 6/45 번호별 출현 빈도, 핫넘버·콜드넘버 분석, 홀짝 비율, 번호대별 분포, 연속번호 패턴, 자주 나오는 번호 조합까지 완벽 분석.",
  keywords: [
    "로또 통계",
    "로또 분석",
    "로또 핫넘버",
    "로또 콜드넘버",
    "로또 번호 빈도",
    "로또 출현 통계",
    "로또 번호 패턴",
    "로또 홀짝 비율",
    "로또 번호 조합 분석",
  ],
  alternates: {
    canonical: "/stats",
  },
  openGraph: {
    title: "로또 번호 통계 분석 - 핫넘버, 콜드넘버, 출현 빈도",
    description:
      "역대 로또 번호 출현 빈도, 핫넘버·콜드넘버, 홀짝 비율, 연속번호 패턴 등 완벽 통계 분석.",
    url: "https://lotto.beomv.com/stats",
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
