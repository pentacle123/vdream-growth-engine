// 장애인 고용부담금 계산 로직 (클라이언트 사이드)
// GUIDE.md §TAB 1 계산 로직 참조

const MANDATORY_RATE_PRIVATE = 0.031; // 민간 3.1%
const MANDATORY_RATE_PUBLIC = 0.038; // 공공 3.8%

const MONTHLY_SALARY_COST = 2_200_000; // 재택근무자 월 급여+관리비
const MONTHLY_INCENTIVE = 600_000; // 의무 초과고용 시 장려금

// 실고용률 구간별 월 부담기초액 (원)
function baseAmount(effectiveRate, mandatoryRate) {
  if (effectiveRate === 0) return 2_156_880;
  if (effectiveRate < mandatoryRate * 0.5) return 1_618_440;
  if (effectiveRate < mandatoryRate * 0.75) return 1_348_080;
  return 1_214_400;
}

/**
 * @param {Object} input
 * @param {number} input.employees - 상시 근로자 수
 * @param {number} input.current - 현재 장애인 고용 수
 * @param {number} input.severeRatio - 중증 비율 (0~100)
 * @param {"private"|"public"} [input.sector="private"]
 * @returns {Object} 진단 결과
 */
export function diagnose({ employees, current, severeRatio, sector = "private" }) {
  const e = Math.max(0, Number(employees) || 0);
  const c = Math.max(0, Number(current) || 0);
  const sv = Math.min(100, Math.max(0, Number(severeRatio) || 0));

  if (e < 50) {
    return {
      eligible: false,
      reason: "상시근로자 50명 미만은 의무고용 대상이 아닙니다.",
    };
  }

  const mandatoryRate = sector === "public" ? MANDATORY_RATE_PUBLIC : MANDATORY_RATE_PRIVATE;
  const mandatoryCount = Math.ceil(e * mandatoryRate);

  const severeCount = Math.round(c * (sv / 100));
  const mildCount = c - severeCount;
  const effectiveCount = severeCount * 2 + mildCount; // 중증 더블카운트
  const shortage = Math.max(0, mandatoryCount - effectiveCount);

  const effectiveRate = e > 0 ? effectiveCount / e : 0;
  const base = baseAmount(effectiveRate, mandatoryRate);

  const annualPenalty = shortage * base * 12;

  // 브이드림 도입 시뮬레이션
  const hireNeeded = Math.ceil(shortage / 2); // 중증 1명 = 2명 인정
  const annualHireCost = hireNeeded * MONTHLY_SALARY_COST * 12;
  const annualSaving = Math.max(0, annualPenalty - annualHireCost);

  // 의무 초과 시 장려금
  const excess = Math.max(0, effectiveCount + hireNeeded * 2 - mandatoryCount);
  const annualIncentive = excess > 0 ? excess * MONTHLY_INCENTIVE * 12 : 0;

  const totalBenefit = annualSaving + annualIncentive;

  return {
    eligible: true,
    employees: e,
    current: c,
    severeCount,
    mildCount,
    mandatoryRate,
    mandatoryCount,
    effectiveCount,
    effectiveRate: Number((effectiveRate * 100).toFixed(2)),
    shortage,
    baseAmount: base,
    annualPenalty,
    hireNeeded,
    annualHireCost,
    annualSaving,
    annualIncentive,
    totalBenefit,
  };
}

export function formatWon(n) {
  if (!Number.isFinite(n)) return "0원";
  if (n >= 1e8) return `${(n / 1e8).toFixed(1)}억원`;
  if (n >= 1e4) return `${new Intl.NumberFormat("ko-KR").format(Math.round(n / 1e4))}만원`;
  return `${new Intl.NumberFormat("ko-KR").format(Math.round(n))}원`;
}

export function formatNumber(n) {
  return new Intl.NumberFormat("ko-KR").format(n);
}
