/**
 * 로또 1회차 추첨일: 2002-12-07 (토요일)
 * 매주 토요일 추첨, 회차 +1
 */
const FIRST_DRAW = new Date("2002-12-07T00:00:00+09:00");

/** 현재 날짜 기준 최신 회차 번호 계산 */
export function getExpectedLatestEpisode(): number {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const diffMs = now.getTime() - FIRST_DRAW.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return diffWeeks + 1;
}

/** 다음 토요일 00:00 (KST)까지 남은 초 */
export function getSecondsUntilNextSaturday(): number {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const day = now.getDay(); // 0=일, 6=토
  const daysUntilSat = day === 6 ? 7 : 6 - day;
  const nextSat = new Date(now);
  nextSat.setDate(now.getDate() + daysUntilSat);
  nextSat.setHours(0, 0, 0, 0);
  return Math.max(Math.floor((nextSat.getTime() - now.getTime()) / 1000), 60);
}
