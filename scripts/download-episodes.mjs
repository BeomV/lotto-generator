/**
 * 역대 로또 당첨 데이터 다운로드 스크립트
 * 사용법: node scripts/download-episodes.mjs
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, "../src/data/episodes.json");

async function download() {
  const endEpisode = parseInt(process.argv[2]) || 1215;
  console.log(`1 ~ ${endEpisode} 회차 데이터 다운로드 중...`);

  const url = `https://www.dhlottery.co.kr/lt645/selectPstLt645Info.do?srchStrLtEpsd=1&srchEndLtEpsd=${endEpisode}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
  });

  if (!res.ok) {
    console.error("다운로드 실패:", res.status);
    process.exit(1);
  }

  const json = await res.json();
  const list = json.data?.list;

  if (!list || list.length === 0) {
    console.error("데이터가 비어있습니다.");
    process.exit(1);
  }

  list.sort((a, b) => a.ltEpsd - b.ltEpsd);

  const output = {
    cachedUntil: list[list.length - 1].ltEpsd,
    updatedAt: new Date().toISOString(),
    episodes: list,
  };

  writeFileSync(OUTPUT, JSON.stringify(output));
  console.log(`완료: ${list.length}개 회차 저장 → src/data/episodes.json`);
  console.log(`마지막 회차: ${output.cachedUntil}`);
}

download();
