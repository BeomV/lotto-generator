import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://lotto.beomv.com";
const SITE_NAME = "로또번호생성기";
const DESCRIPTION =
  "역대 로또 당첨번호 통계 분석 기반 번호 생성기. 1회~최신회차 출현 빈도, 핫/콜드 넘버 분석, AI 추천 번호까지 무료 제공.";

export const metadata: Metadata = {
  title: {
    default: "로또번호생성기 - 통계 분석 기반 AI 추천 번호",
    template: "%s | 로또번호생성기",
  },
  description: DESCRIPTION,
  keywords: [
    "로또",
    "로또번호생성",
    "로또번호생성기",
    "로또 번호 추천",
    "로또 AI 추천",
    "로또 통계",
    "로또 분석",
    "로또 당첨번호",
    "로또 핫넘버",
    "로또 콜드넘버",
    "로또 번호 조합",
    "이번주 로또",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "로또번호생성기 - 통계 분석 기반 AI 추천 번호",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "로또번호생성기 - 통계 분석 기반 AI 추천 번호",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "Y7Znl8wfLB0FtuoHOofeGSs8xyzIw79nODPNeJbhWbc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://hangeul.pstatic.net/hangeul_static/css/nanum-barun-gothic.css"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1206392565632592"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "로또번호생성기",
              url: SITE_URL,
              description: DESCRIPTION,
              applicationCategory: "UtilityApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              inLanguage: "ko",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
