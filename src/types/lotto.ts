export interface LottoEpisode {
  ltEpsd: number;
  tm1WnNo: number;
  tm2WnNo: number;
  tm3WnNo: number;
  tm4WnNo: number;
  tm5WnNo: number;
  tm6WnNo: number;
  bnsWnNo: number;
  ltRflYmd: string;
  rnk1WnNope: number;
  rnk1WnAmt: number;
  rnk1SumWnAmt: number;
  rnk2WnNope: number;
  rnk2WnAmt: number;
  rnk3WnNope: number;
  rnk3WnAmt: number;
  rnk4WnNope: number;
  rnk4WnAmt: number;
  rnk5WnNope: number;
  rnk5WnAmt: number;
}

export interface LottoApiResponse {
  resultCode: string | null;
  resultMessage: string | null;
  data: {
    list: LottoEpisode[];
  };
}

export interface NumberFrequency {
  number: number;
  count: number;
  percentage: number;
}

export interface NumberStats {
  frequencies: NumberFrequency[];
  hotNumbers: number[];
  coldNumbers: number[];
  recentHot: number[];
  recentCold: number[];
  pairFrequency: Map<string, number>;
  oddEvenRatio: { odd: number; even: number };
  highLowRatio: { high: number; low: number };
  sumRange: { min: number; max: number; avg: number; mostCommonRange: [number, number] };
  consecutivePatterns: { withConsecutive: number; withoutConsecutive: number };
}
