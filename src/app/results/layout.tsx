import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로또 당첨번호 결과 - 역대 전체 회차 당첨번호 조회",
  description:
    "로또 6/45 역대 당첨번호 전체 결과를 확인하세요. 1회부터 최신 회차까지 당첨번호, 보너스 번호, 1등 당첨금액을 한눈에 볼 수 있습니다.",
  keywords: [
    "로또 당첨번호",
    "로또 결과",
    "로또 당첨번호 조회",
    "이번주 로또 당첨번호",
    "로또 역대 당첨번호",
    "로또 번호 확인",
  ],
  alternates: {
    canonical: "/results",
  },
  openGraph: {
    title: "로또 당첨번호 결과 - 역대 전체 회차 조회",
    description:
      "로또 6/45 역대 당첨번호 전체 결과. 1회부터 최신 회차까지 당첨번호, 보너스 번호, 당첨금액 확인.",
    url: "https://lotto.beomv.com/results",
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
