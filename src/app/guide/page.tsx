import GlassCard from "@/components/GlassCard";
import Particles from "@/components/Particles";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="bg-ambient">
      <Particles />
      <div className="relative z-10">
        <header className="pt-14 pb-2 text-center">
          <h1 className="text-4xl md:text-5xl font-bold title-gradient tracking-tight">
            로또 완벽 가이드
          </h1>
          <p className="text-white mt-2 text-sm">
            로또 6/45 구매 방법부터 당첨 확률까지
          </p>
        </header>

        <nav className="flex justify-center gap-3 py-4 text-sm">
          <Link
            href="/"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            번호생성
          </Link>
          <span className="text-white/20">|</span>
          <Link
            href="/results"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            당첨결과
          </Link>
          <span className="text-white/20">|</span>
          <Link
            href="/stats"
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            통계분석
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/80 font-semibold">가이드</span>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-4">
          <AdBanner slot="9834712972" format="auto" />
        </div>

        <main className="max-w-2xl mx-auto px-4 pb-16 space-y-5">
          {/* 로또란? */}
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white/80 mb-4">
              로또 6/45란?
            </h2>
            <div className="text-sm text-white/50 space-y-3 leading-relaxed">
              <p>
                로또 6/45는 1부터 45까지의 숫자 중 6개를 선택하여 당첨번호와
                일치하는 개수에 따라 상금을 받는 복권입니다. 대한민국에서 가장
                인기 있는 복권으로, 2002년 12월 첫 추첨이 시작되었습니다.
              </p>
              <p>
                매주 토요일 오후 8시 35분에 MBC에서 생방송으로 추첨하며,
                동행복권에서 운영합니다. 1게임당 1,000원이며, 최대 5게임까지
                한 장에 구매할 수 있습니다.
              </p>
            </div>
          </GlassCard>

          {/* 구매 방법 */}
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white/80 mb-4">
              로또 구매 방법
            </h2>
            <div className="text-sm text-white/50 space-y-4 leading-relaxed">
              <div>
                <h3 className="text-white/70 font-medium mb-1">
                  1. 오프라인 구매
                </h3>
                <p>
                  전국 로또 판매점에서 구매할 수 있습니다. 용지에 번호를 직접
                  마킹하거나, 자동으로 선택할 수 있습니다. 판매 시간은
                  매주 일요일 오전 6시부터 토요일 오후 8시까지입니다.
                </p>
              </div>
              <div>
                <h3 className="text-white/70 font-medium mb-1">
                  2. 온라인 구매
                </h3>
                <p>
                  동행복권 공식 사이트(dhlottery.co.kr)에서 인터넷으로 구매할
                  수 있습니다. 회원가입 후 예치금을 충전하면 됩니다. 1회 최대
                  5,000원(5게임), 1주일 최대 10만원까지 구매 가능합니다.
                </p>
              </div>
              <div>
                <h3 className="text-white/70 font-medium mb-1">
                  3. 번호 선택 방식
                </h3>
                <ul className="list-disc list-inside space-y-1 text-white/40">
                  <li>
                    <strong className="text-white/50">수동</strong> - 원하는 번호
                    6개를 직접 선택
                  </li>
                  <li>
                    <strong className="text-white/50">자동</strong> - 컴퓨터가
                    무작위로 6개 번호 선택
                  </li>
                  <li>
                    <strong className="text-white/50">반자동</strong> - 일부
                    번호는 직접, 나머지는 자동 선택
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* 당첨 등급 */}
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white/80 mb-4">
              당첨 등급 및 확률
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-white/40 text-xs border-b border-white/10">
                    <th className="text-left py-3 px-2">등급</th>
                    <th className="text-left py-3 px-2">일치 조건</th>
                    <th className="text-right py-3 px-2">당첨 확률</th>
                    <th className="text-right py-3 px-2">당첨금</th>
                  </tr>
                </thead>
                <tbody className="text-white/50">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-2 font-semibold text-cyan-400/80">
                      1등
                    </td>
                    <td className="py-3 px-2">6개 번호 일치</td>
                    <td className="py-3 px-2 text-right font-mono">
                      1/8,145,060
                    </td>
                    <td className="py-3 px-2 text-right">총 당첨금의 75%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-2 font-semibold text-blue-400/80">
                      2등
                    </td>
                    <td className="py-3 px-2">5개 + 보너스번호</td>
                    <td className="py-3 px-2 text-right font-mono">
                      1/1,357,510
                    </td>
                    <td className="py-3 px-2 text-right">총 당첨금의 12.5%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-2 font-semibold text-indigo-400/80">
                      3등
                    </td>
                    <td className="py-3 px-2">5개 번호 일치</td>
                    <td className="py-3 px-2 text-right font-mono">
                      1/35,724
                    </td>
                    <td className="py-3 px-2 text-right">총 당첨금의 12.5%</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-2 font-semibold text-purple-400/80">
                      4등
                    </td>
                    <td className="py-3 px-2">4개 번호 일치</td>
                    <td className="py-3 px-2 text-right font-mono">1/733</td>
                    <td className="py-3 px-2 text-right">50,000원 (고정)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-semibold text-gray-400/80">
                      5등
                    </td>
                    <td className="py-3 px-2">3개 번호 일치</td>
                    <td className="py-3 px-2 text-right font-mono">1/45</td>
                    <td className="py-3 px-2 text-right">5,000원 (고정)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* 당첨금 수령 */}
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white/80 mb-4">
              당첨금 수령 방법
            </h2>
            <div className="text-sm text-white/50 space-y-3 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="glass-sm p-4">
                  <h3 className="text-white/70 font-medium mb-2">
                    5등 (5,000원)
                  </h3>
                  <p className="text-xs text-white/40">
                    로또 판매점에서 바로 수령 가능
                  </p>
                </div>
                <div className="glass-sm p-4">
                  <h3 className="text-white/70 font-medium mb-2">
                    4등 (50,000원)
                  </h3>
                  <p className="text-xs text-white/40">
                    로또 판매점 또는 농협 지점에서 수령
                  </p>
                </div>
                <div className="glass-sm p-4">
                  <h3 className="text-white/70 font-medium mb-2">
                    3등 (~150만원)
                  </h3>
                  <p className="text-xs text-white/40">
                    농협 지점 방문 수령 (신분증 필요)
                  </p>
                </div>
                <div className="glass-sm p-4">
                  <h3 className="text-white/70 font-medium mb-2">
                    1~2등 (억 단위)
                  </h3>
                  <p className="text-xs text-white/40">
                    농협 본점 방문 수령 (신분증 필요, 세금 공제)
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/30">
                당첨금 수령 기한은 지급 개시일로부터 1년입니다. 3억 초과 시
                33%, 3억 이하는 22%의 세금이 원천징수됩니다.
              </p>
            </div>
          </GlassCard>

          {/* 번호 선택 팁 */}
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white/80 mb-4">
              번호 선택 전략
            </h2>
            <div className="text-sm text-white/50 space-y-3 leading-relaxed">
              <p>
                로또는 완전한 무작위 추첨이므로 어떤 전략도 당첨을 보장하지
                않습니다. 하지만 통계적으로 참고할 수 있는 패턴이 있습니다:
              </p>
              <ul className="space-y-2 text-white/40">
                <li className="flex gap-2">
                  <span className="text-cyan-400/60 shrink-0">01.</span>
                  <span>
                    <strong className="text-white/50">홀짝 균형</strong> -
                    역대 당첨번호 중 홀수 3개 + 짝수 3개 조합이 가장 많이
                    출현했습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400/60 shrink-0">02.</span>
                  <span>
                    <strong className="text-white/50">번호대 분산</strong> -
                    1~10, 11~20, 21~30, 31~40, 41~45 각 구간에서 골고루
                    선택하는 것이 유리합니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400/60 shrink-0">03.</span>
                  <span>
                    <strong className="text-white/50">합계 범위</strong> -
                    당첨번호 6개의 합계가 100~175 사이인 경우가 가장 많습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400/60 shrink-0">04.</span>
                  <span>
                    <strong className="text-white/50">연속번호</strong> -
                    당첨번호에 연속된 숫자가 1쌍 포함되는 경우가 많습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400/60 shrink-0">05.</span>
                  <span>
                    <strong className="text-white/50">인기 번호 피하기</strong>{" "}
                    - 생일, 기념일 등으로 많이 선택되는 1~31 사이 번호만
                    고르면, 당첨 시 나눠 가질 확률이 높아집니다.
                  </span>
                </li>
              </ul>
            </div>
          </GlassCard>

          {/* FAQ */}
          <GlassCard className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white/80 mb-4">
              자주 묻는 질문 (FAQ)
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "로또 1등 당첨 확률은 얼마인가요?",
                  a: "1/8,145,060입니다. 45개 숫자 중 6개를 맞춰야 하며, 이는 벼락에 맞을 확률보다 낮습니다.",
                },
                {
                  q: "로또 번호를 자동으로 하는 게 좋나요, 수동이 좋나요?",
                  a: "통계적으로 자동과 수동의 당첨 확률은 동일합니다. 다만 수동 선택 시 인기 번호를 피하면 1등 당첨금을 나눌 확률이 줄어듭니다.",
                },
                {
                  q: "같은 번호를 계속 사면 당첨 확률이 올라가나요?",
                  a: "아닙니다. 매 회차는 독립적인 추첨이므로, 이전 결과와 무관하게 매번 같은 확률입니다.",
                },
                {
                  q: "로또 당첨금에 세금이 붙나요?",
                  a: "5만원 이하는 비과세, 200만원 이하는 22%, 3억 이하는 22%, 3억 초과분은 33%의 세금이 원천징수됩니다.",
                },
                {
                  q: "인터넷으로 로또를 살 수 있나요?",
                  a: "네, 동행복권 공식 사이트(dhlottery.co.kr)에서 구매 가능합니다. 1주일 최대 10만원까지 구매할 수 있습니다.",
                },
                {
                  q: "당첨금 수령 기한은 언제까지인가요?",
                  a: "지급 개시일로부터 1년입니다. 기한이 지나면 당첨금은 복권기금으로 귀속됩니다.",
                },
              ].map((item) => (
                <div key={item.q} className="border-b border-white/5 pb-3">
                  <h3 className="text-sm font-medium text-white/60 mb-1">
                    Q. {item.q}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed">
                    A. {item.a}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="pt-4">
            <AdBanner slot="8322320759" format="auto" />
          </div>

          <footer className="text-center text-xs text-white/15 pt-4 pb-4">
            <p>통계 참고용이며 당첨을 보장하지 않습니다</p>
            <p className="mt-0.5">데이터 출처: 동행복권</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
