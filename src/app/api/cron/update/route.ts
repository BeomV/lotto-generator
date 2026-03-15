import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { resolve } from "path";
import cachedData from "@/data/episodes.json";
import { getExpectedLatestEpisode } from "@/lib/episode-utils";

export const dynamic = "force-dynamic";

/**
 * Cron job: 매주 토요일 신규 회차 데이터를 fetch하여 캐시 파일 갱신
 * Vercel cron 또는 수동 호출용
 */
export async function GET(request: NextRequest) {
  // Vercel cron 인증 (선택)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cached = cachedData as {
    cachedUntil: number;
    updatedAt: string;
    episodes: Record<string, unknown>[];
  };

  const expectedLatest = getExpectedLatestEpisode();

  if (expectedLatest <= cached.cachedUntil) {
    return NextResponse.json({
      message: "이미 최신 상태입니다.",
      cachedUntil: cached.cachedUntil,
      expectedLatest,
    });
  }

  const newStart = cached.cachedUntil + 1;
  const url = `https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do?srchStrLtEpsd=${newStart}&srchEndLtEpsd=${expectedLatest}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "외부 API 요청 실패", status: res.status },
      { status: 500 }
    );
  }

  const data = await res.json();
  const newEpisodes = data.data?.list || [];

  if (newEpisodes.length === 0) {
    return NextResponse.json({
      message: "새 회차 데이터가 아직 없습니다 (추첨 전이거나 반영 대기중).",
      cachedUntil: cached.cachedUntil,
      expectedLatest,
    });
  }

  // 캐시 파일 갱신
  const allEpisodes = [...cached.episodes, ...newEpisodes];
  allEpisodes.sort(
    (a, b) => (a.ltEpsd as number) - (b.ltEpsd as number)
  );

  const lastEpisode = allEpisodes[allEpisodes.length - 1].ltEpsd as number;

  const output = {
    cachedUntil: lastEpisode,
    updatedAt: new Date().toISOString(),
    episodes: allEpisodes,
  };

  try {
    const filePath = resolve(process.cwd(), "src/data/episodes.json");
    writeFileSync(filePath, JSON.stringify(output));
  } catch {
    // 서버리스 환경에서는 파일 쓰기 불가 → 런타임 merge로 대응
  }

  return NextResponse.json({
    message: `${newEpisodes.length}개 회차 추가 완료`,
    cachedUntil: lastEpisode,
    newEpisodes: newEpisodes.length,
    total: allEpisodes.length,
  });
}
