import { LottoEpisode, NumberFrequency, NumberStats } from "@/types/lotto";

export function getWinningNumbers(episode: LottoEpisode): number[] {
  return [
    episode.tm1WnNo,
    episode.tm2WnNo,
    episode.tm3WnNo,
    episode.tm4WnNo,
    episode.tm5WnNo,
    episode.tm6WnNo,
  ];
}

export function analyzeData(episodes: LottoEpisode[]): NumberStats {
  const totalEpisodes = episodes.length;
  const allNumbers: number[][] = episodes.map(getWinningNumbers);

  // 1. 전체 번호 출현 빈도
  const countMap = new Map<number, number>();
  for (let i = 1; i <= 45; i++) countMap.set(i, 0);
  for (const nums of allNumbers) {
    for (const n of nums) {
      countMap.set(n, (countMap.get(n) || 0) + 1);
    }
  }

  const frequencies: NumberFrequency[] = Array.from(countMap.entries())
    .map(([number, count]) => ({
      number,
      count,
      percentage: (count / (totalEpisodes * 6)) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // 2. 핫넘버 (상위 10), 콜드넘버 (하위 10)
  const hotNumbers = frequencies.slice(0, 10).map((f) => f.number);
  const coldNumbers = frequencies
    .slice(-10)
    .map((f) => f.number)
    .reverse();

  // 3. 최근 50회 기준 핫/콜드
  const recentEpisodes = episodes.slice(-50);
  const recentCountMap = new Map<number, number>();
  for (let i = 1; i <= 45; i++) recentCountMap.set(i, 0);
  for (const ep of recentEpisodes) {
    for (const n of getWinningNumbers(ep)) {
      recentCountMap.set(n, (recentCountMap.get(n) || 0) + 1);
    }
  }
  const recentSorted = Array.from(recentCountMap.entries()).sort(
    (a, b) => b[1] - a[1]
  );
  const recentHot = recentSorted.slice(0, 10).map(([n]) => n);
  const recentCold = recentSorted.slice(-10).map(([n]) => n);

  // 4. 쌍 빈도 (자주 같이 나오는 번호 조합)
  const pairFrequency = new Map<string, number>();
  for (const nums of allNumbers) {
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const key = `${Math.min(nums[i], nums[j])}-${Math.max(nums[i], nums[j])}`;
        pairFrequency.set(key, (pairFrequency.get(key) || 0) + 1);
      }
    }
  }

  // 5. 홀짝 비율
  let oddTotal = 0;
  let evenTotal = 0;
  for (const nums of allNumbers) {
    for (const n of nums) {
      if (n % 2 === 1) oddTotal++;
      else evenTotal++;
    }
  }

  // 6. 고저 비율 (1~22 저, 23~45 고)
  let highTotal = 0;
  let lowTotal = 0;
  for (const nums of allNumbers) {
    for (const n of nums) {
      if (n <= 22) lowTotal++;
      else highTotal++;
    }
  }

  // 7. 합계 범위 분석
  const sums = allNumbers.map((nums) => nums.reduce((a, b) => a + b, 0));
  const minSum = Math.min(...sums);
  const maxSum = Math.max(...sums);
  const avgSum = sums.reduce((a, b) => a + b, 0) / sums.length;

  // 합계 구간별 빈도 (10단위)
  const sumBuckets = new Map<string, number>();
  for (const s of sums) {
    const bucketStart = Math.floor(s / 20) * 20;
    const key = `${bucketStart}-${bucketStart + 19}`;
    sumBuckets.set(key, (sumBuckets.get(key) || 0) + 1);
  }
  let mostCommonBucket = "";
  let maxBucketCount = 0;
  for (const [key, count] of sumBuckets) {
    if (count > maxBucketCount) {
      maxBucketCount = count;
      mostCommonBucket = key;
    }
  }
  const [mcStart, mcEnd] = mostCommonBucket.split("-").map(Number);

  // 8. 연속번호 패턴
  let withConsecutive = 0;
  let withoutConsecutive = 0;
  for (const nums of allNumbers) {
    const sorted = [...nums].sort((a, b) => a - b);
    let hasConsecutive = false;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] - sorted[i] === 1) {
        hasConsecutive = true;
        break;
      }
    }
    if (hasConsecutive) withConsecutive++;
    else withoutConsecutive++;
  }

  return {
    frequencies,
    hotNumbers,
    coldNumbers,
    recentHot,
    recentCold,
    pairFrequency,
    oddEvenRatio: { odd: oddTotal, even: evenTotal },
    highLowRatio: { high: highTotal, low: lowTotal },
    sumRange: {
      min: minSum,
      max: maxSum,
      avg: Math.round(avgSum),
      mostCommonRange: [mcStart, mcEnd],
    },
    consecutivePatterns: { withConsecutive, withoutConsecutive },
  };
}

/**
 * 통계 기반 스마트 번호 생성
 * 가중치 기반으로 확률이 높은 번호 조합을 생성
 */
export function generateSmartNumbers(
  episodes: LottoEpisode[],
  count: number = 5
): number[][] {
  const stats = analyzeData(episodes);
  const results: number[][] = [];

  // 번호별 가중치 계산
  const weights = new Map<number, number>();

  for (let i = 1; i <= 45; i++) {
    let weight = 0;

    // 1. 전체 출현 빈도 가중치 (정규화)
    const freq = stats.frequencies.find((f) => f.number === i);
    if (freq) {
      const maxCount = stats.frequencies[0].count;
      const minCount = stats.frequencies[stats.frequencies.length - 1].count;
      weight += ((freq.count - minCount) / (maxCount - minCount)) * 30;
    }

    // 2. 최근 50회 출현 빈도 가중치 (더 높은 비중)
    if (stats.recentHot.includes(i)) {
      weight += 25;
    } else if (stats.recentCold.includes(i)) {
      // 콜드 넘버에도 약간의 가중치 (리바운드 효과)
      weight += 8;
    } else {
      weight += 12;
    }

    // 3. 최근 미출현 기간 가중치 (오래 안 나온 번호에 가중치)
    const lastAppearance = findLastAppearance(episodes, i);
    if (lastAppearance > 15) {
      weight += Math.min(lastAppearance * 0.5, 15); // 오래 안 나올수록 가중치
    }

    weights.set(i, weight);
  }

  for (let g = 0; g < count; g++) {
    const selected: number[] = [];
    const available = new Map(weights);

    while (selected.length < 6) {
      const number = weightedRandomPick(available);
      selected.push(number);
      available.delete(number);

      // 선택된 번호에 따라 남은 번호 가중치 조정
      adjustWeightsForBalance(selected, available, stats);
    }

    results.push(selected.sort((a, b) => a - b));
  }

  return results;
}

function findLastAppearance(episodes: LottoEpisode[], num: number): number {
  for (let i = episodes.length - 1; i >= 0; i--) {
    const nums = getWinningNumbers(episodes[i]);
    if (nums.includes(num)) {
      return episodes.length - 1 - i;
    }
  }
  return episodes.length;
}

function weightedRandomPick(weights: Map<number, number>): number {
  const entries = Array.from(weights.entries());
  const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (const [num, weight] of entries) {
    random -= weight;
    if (random <= 0) return num;
  }
  return entries[entries.length - 1][0];
}

function adjustWeightsForBalance(
  selected: number[],
  available: Map<number, number>,
  stats: NumberStats
): void {
  const oddCount = selected.filter((n) => n % 2 === 1).length;
  const evenCount = selected.filter((n) => n % 2 === 0).length;
  const lowCount = selected.filter((n) => n <= 22).length;
  const highCount = selected.filter((n) => n > 22).length;
  const currentSum = selected.reduce((a, b) => a + b, 0);
  const remaining = 6 - selected.length;

  for (const [num, weight] of available) {
    let adjusted = weight;

    // 홀짝 균형 (3:3 또는 4:2가 가장 흔함)
    if (oddCount >= 4 && num % 2 === 1) adjusted *= 0.3;
    if (evenCount >= 4 && num % 2 === 0) adjusted *= 0.3;

    // 고저 균형
    if (lowCount >= 4 && num <= 22) adjusted *= 0.3;
    if (highCount >= 4 && num > 22) adjusted *= 0.3;

    // 합계 범위 조정 (가장 빈번한 합계 범위로 유도)
    const [targetMin, targetMax] = stats.sumRange.mostCommonRange;
    const projectedSum = currentSum + num;
    const avgRemaining = remaining > 1 ? 23 * (remaining - 1) : 0;
    const estimatedTotal = projectedSum + avgRemaining;
    if (estimatedTotal > targetMax * 1.3 && num > 30) adjusted *= 0.5;
    if (estimatedTotal < targetMin * 0.7 && num < 15) adjusted *= 0.5;

    // 연속번호 제한 (2쌍 이상 연속 방지)
    const consecutivePairs = selected.filter((s) =>
      selected.some((t) => Math.abs(s - t) === 1)
    ).length;
    if (
      consecutivePairs >= 4 &&
      selected.some((s) => Math.abs(s - num) === 1)
    ) {
      adjusted *= 0.3;
    }

    available.set(num, Math.max(adjusted, 0.1));
  }
}

/**
 * 번호대별 분포 분석 (1~10, 11~20, 21~30, 31~40, 41~45)
 */
export function getRangeDistribution(
  episodes: LottoEpisode[]
): { range: string; count: number; percentage: number }[] {
  const ranges = [
    { label: "1~10", min: 1, max: 10 },
    { label: "11~20", min: 11, max: 20 },
    { label: "21~30", min: 21, max: 30 },
    { label: "31~40", min: 31, max: 40 },
    { label: "41~45", min: 41, max: 45 },
  ];

  const allNumbers = episodes.flatMap(getWinningNumbers);
  const total = allNumbers.length;

  return ranges.map(({ label, min, max }) => {
    const count = allNumbers.filter((n) => n >= min && n <= max).length;
    return { range: label, count, percentage: (count / total) * 100 };
  });
}

/**
 * 최근 N회 미출현 번호 목록
 */
export function getNotAppearedNumbers(
  episodes: LottoEpisode[],
  lastN: number
): { number: number; missingRounds: number }[] {
  const recent = episodes.slice(-lastN);
  const appeared = new Set(recent.flatMap(getWinningNumbers));
  const result: { number: number; missingRounds: number }[] = [];

  for (let i = 1; i <= 45; i++) {
    if (!appeared.has(i)) {
      result.push({ number: i, missingRounds: findLastAppearance(episodes, i) });
    }
  }

  return result.sort((a, b) => b.missingRounds - a.missingRounds);
}

/**
 * 자주 같이 출현하는 번호 쌍 Top N
 */
export function getTopPairs(
  episodes: LottoEpisode[],
  topN: number = 20
): { pair: [number, number]; count: number }[] {
  const pairMap = new Map<string, number>();

  for (const ep of episodes) {
    const nums = getWinningNumbers(ep);
    for (let i = 0; i < nums.length; i++) {
      for (let j = i + 1; j < nums.length; j++) {
        const key = `${Math.min(nums[i], nums[j])}-${Math.max(nums[i], nums[j])}`;
        pairMap.set(key, (pairMap.get(key) || 0) + 1);
      }
    }
  }

  return Array.from(pairMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key, count]) => ({
      pair: key.split("-").map(Number) as [number, number],
      count,
    }));
}
