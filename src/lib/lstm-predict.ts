import * as tf from "@tensorflow/tfjs";
import { LottoEpisode } from "@/types/lotto";
import { getWinningNumbers } from "./analysis";

const WINDOW_SIZE = 10;
const NUM_BALLS = 45;
const MODEL_URL = "/model/lstm/model.json";

let cachedModel: tf.LayersModel | null = null;

/** TF.js LSTM 모델 로드 (캐싱) */
export async function loadModel(): Promise<tf.LayersModel> {
  if (cachedModel) return cachedModel;
  cachedModel = await tf.loadLayersModel(MODEL_URL);
  return cachedModel;
}

/** 에피소드를 45차원 이진 벡터로 변환 */
function episodeToBinary(episode: LottoEpisode): Float32Array {
  const vec = new Float32Array(NUM_BALLS);
  const nums = getWinningNumbers(episode);
  for (const n of nums) {
    vec[n - 1] = 1.0;
  }
  return vec;
}

/** 최근 WINDOW_SIZE회차 데이터로 입력 텐서 생성 */
function prepareInput(episodes: LottoEpisode[]): tf.Tensor3D {
  const recent = episodes.slice(-WINDOW_SIZE);
  const data = recent.map(episodeToBinary);
  // shape: [1, WINDOW_SIZE, NUM_BALLS]
  return tf.tensor3d([data.map((d) => Array.from(d))]);
}

/** 확률 배열에서 가중치 기반으로 6개 번호 선택 */
function sampleNumbers(probabilities: Float32Array): number[] {
  const selected: number[] = [];
  const probs = Array.from(probabilities);

  while (selected.length < 6) {
    // 이미 선택된 번호의 확률을 0으로
    const adjusted = probs.map((p, i) =>
      selected.includes(i + 1) ? 0 : p
    );
    const total = adjusted.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;

    for (let i = 0; i < adjusted.length; i++) {
      r -= adjusted[i];
      if (r <= 0) {
        selected.push(i + 1);
        break;
      }
    }
    // 혹시 못 골랐으면 가장 높은 확률 번호 추가
    if (selected.length < 6 && r > 0) {
      const remaining = adjusted
        .map((p, i) => ({ num: i + 1, p }))
        .filter((x) => !selected.includes(x.num))
        .sort((a, b) => b.p - a.p);
      if (remaining.length > 0) selected.push(remaining[0].num);
    }
  }

  return selected.sort((a, b) => a - b);
}

export interface LstmPrediction {
  numbers: number[][];
  probabilities: Float32Array;
  topNumbers: { number: number; probability: number }[];
}

/** LSTM 모델로 번호 예측 */
export async function predictNumbers(
  episodes: LottoEpisode[],
  count: number = 5
): Promise<LstmPrediction> {
  const model = await loadModel();
  const input = prepareInput(episodes);

  // 추론
  const output = model.predict(input) as tf.Tensor;
  const probabilities = (await output.data()) as Float32Array;

  // 메모리 정리
  input.dispose();
  output.dispose();

  // 확률 높은 순으로 정렬
  const topNumbers = Array.from(probabilities)
    .map((p, i) => ({ number: i + 1, probability: p }))
    .sort((a, b) => b.probability - a.probability);

  // count만큼 번호 세트 생성
  const numbers: number[][] = [];
  for (let i = 0; i < count; i++) {
    numbers.push(sampleNumbers(probabilities));
  }

  return { numbers, probabilities, topNumbers };
}
