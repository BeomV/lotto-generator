import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "로또번호생성",
  description:
    "역대 로또 당첨번호 통계 분석 기반 번호 생성기. 출현 빈도, 핫/콜드 넘버, AI 추천까지.",
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
        {children}
      </body>
    </html>
  );
}
