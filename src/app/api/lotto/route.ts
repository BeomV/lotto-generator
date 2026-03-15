import { NextResponse } from "next/server";
import cachedData from "@/data/episodes.json";
import { getExpectedLatestEpisode } from "@/lib/episode-utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const cached = cachedData as {
    cachedUntil: number;
    episodes: unknown[];
  };

  const expectedLatest = getExpectedLatestEpisode();
  const cachedUntil = cached.cachedUntil;

  // 캐시된 데이터로 시작
  let episodes = [...cached.episodes];

  // 신규 회차가 있으면 추가 fetch
  if (expectedLatest > cachedUntil) {
    const newStart = cachedUntil + 1;
    const newEnd = expectedLatest;
    try {
      const url = `https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do?srchStrLtEpsd=${newStart}&srchEndLtEpsd=${newEnd}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
        // 토요일 추첨 후 결과 반영까지 시간이 걸릴 수 있으므로 1시간 캐시
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data?.list?.length > 0) {
          episodes = [...episodes, ...data.data.list];
        }
      }
    } catch {
      // 신규 데이터 fetch 실패 시 캐시된 데이터만 반환
    }
  }

  return NextResponse.json({
    resultCode: null,
    resultMessage: null,
    data: {
      list: episodes,
      cachedUntil,
      expectedLatest,
    },
  });
}
