// 타겟 기업 DB — 고용노동부 공표 불이행 기업 샘플 (20개)
// 실제 명단을 가명화해 스펙 기준 하드코딩

export const TARGET_COMPANIES = [
  { id: 1,  name: "A테크놀로지", industry: "IT/소프트웨어", region: "서울", employees: 850, mandatoryCount: 27, actualCount: 8,  effectiveCount: 12, deficit: 15, estimatedPenalty: 388_239_360 },
  { id: 2,  name: "B패션그룹",   industry: "유통/물류",     region: "서울", employees: 1200, mandatoryCount: 38, actualCount: 5,  effectiveCount: 7,  deficit: 31, estimatedPenalty: 802_358_880 },
  { id: 3,  name: "C건설산업",   industry: "건설",          region: "경기", employees: 2500, mandatoryCount: 78, actualCount: 20, effectiveCount: 28, deficit: 50, estimatedPenalty: 1_294_128_000 },
  { id: 4,  name: "D금융서비스", industry: "금융/보험",     region: "서울", employees: 600,  mandatoryCount: 19, actualCount: 3,  effectiveCount: 4,  deficit: 15, estimatedPenalty: 388_239_360 },
  { id: 5,  name: "E제약바이오", industry: "제조업",        region: "경기", employees: 450,  mandatoryCount: 14, actualCount: 2,  effectiveCount: 3,  deficit: 11, estimatedPenalty: 284_708_864 },
  { id: 6,  name: "F유통물류",   industry: "유통/물류",     region: "부산", employees: 3000, mandatoryCount: 93, actualCount: 30, effectiveCount: 42, deficit: 51, estimatedPenalty: 1_320_010_560 },
  { id: 7,  name: "G미디어엔터", industry: "서비스업",      region: "서울", employees: 380,  mandatoryCount: 12, actualCount: 1,  effectiveCount: 1,  deficit: 11, estimatedPenalty: 284_708_864 },
  { id: 8,  name: "H제조공업",   industry: "제조업",        region: "인천", employees: 1800, mandatoryCount: 56, actualCount: 15, effectiveCount: 21, deficit: 35, estimatedPenalty: 906_157_440 },
  { id: 9,  name: "I호텔리조트", industry: "서비스업",      region: "제주", employees: 500,  mandatoryCount: 16, actualCount: 0,  effectiveCount: 0,  deficit: 16, estimatedPenalty: 414_122_880 },
  { id: 10, name: "J커머스",     industry: "IT/소프트웨어", region: "서울", employees: 700,  mandatoryCount: 22, actualCount: 4,  effectiveCount: 6,  deficit: 16, estimatedPenalty: 414_122_880 },
  { id: 11, name: "K자동차부품", industry: "제조업",        region: "울산", employees: 950,  mandatoryCount: 30, actualCount: 10, effectiveCount: 14, deficit: 16, estimatedPenalty: 414_122_880 },
  { id: 12, name: "L보험생명",   industry: "금융/보험",     region: "서울", employees: 2200, mandatoryCount: 69, actualCount: 25, effectiveCount: 35, deficit: 34, estimatedPenalty: 880_274_880 },
  { id: 13, name: "M식품그룹",   industry: "제조업",        region: "충남", employees: 1500, mandatoryCount: 47, actualCount: 12, effectiveCount: 17, deficit: 30, estimatedPenalty: 776_478_720 },
  { id: 14, name: "N교육서비스", industry: "서비스업",      region: "서울", employees: 300,  mandatoryCount: 10, actualCount: 1,  effectiveCount: 1,  deficit: 9,  estimatedPenalty: 233_061_120 },
  { id: 15, name: "O에너지",     industry: "제조업",        region: "전남", employees: 4000, mandatoryCount: 124,actualCount: 35, effectiveCount: 49, deficit: 75, estimatedPenalty: 1_941_192_000 },
  { id: 16, name: "P게임즈",     industry: "IT/소프트웨어", region: "경기", employees: 550,  mandatoryCount: 18, actualCount: 2,  effectiveCount: 3,  deficit: 15, estimatedPenalty: 388_239_360 },
  { id: 17, name: "Q백화점",     industry: "유통/물류",     region: "서울", employees: 5000, mandatoryCount: 155,actualCount: 50, effectiveCount: 70, deficit: 85, estimatedPenalty: 2_200_017_600 },
  { id: 18, name: "R헬스케어",   industry: "서비스업",      region: "서울", employees: 400,  mandatoryCount: 13, actualCount: 2,  effectiveCount: 3,  deficit: 10, estimatedPenalty: 258_944_640 },
  { id: 19, name: "S건자재",     industry: "건설",          region: "경기", employees: 800,  mandatoryCount: 25, actualCount: 5,  effectiveCount: 7,  deficit: 18, estimatedPenalty: 466_100_352 },
  { id: 20, name: "T항공",       industry: "서비스업",      region: "서울", employees: 6000, mandatoryCount: 186,actualCount: 60, effectiveCount: 84, deficit: 102,estimatedPenalty: 2_640_021_120 },
];

export const INDUSTRIES = [
  "IT/소프트웨어",
  "금융/보험",
  "유통/물류",
  "제조업",
  "건설",
  "서비스업",
];

export const REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "제주", "충남", "전남",
];

// ============================================================
// 영업 파이프라인 상태
// ============================================================

export const PIPELINE_STATUSES = [
  { key: "untouched",  label: "미접촉",       color: "#64748B", icon: "○" },
  { key: "proposed",   label: "제안서 생성",  color: "#A78BFA", icon: "📄" },
  { key: "sent",       label: "이메일 발송",  color: "#1D85EB", icon: "📧" },
  { key: "opened",     label: "열람 확인",    color: "#36CFBA", icon: "👁" },
  { key: "replied",    label: "응답",         color: "#F59E0B", icon: "💬" },
  { key: "consulting", label: "상담 중",      color: "#EA580C", icon: "🤝" },
  { key: "contracted", label: "계약 완료",    color: "#10B981", icon: "✅" },
];

export function findStatus(key) {
  return PIPELINE_STATUSES.find((s) => s.key === key) || PIPELINE_STATUSES[0];
}

// ============================================================
// 영업 우선순위 스코어링
// ============================================================

const INDUSTRY_FIT = {
  "IT/소프트웨어": 100,
  "서비스업": 100,
  "금융/보험": 80,
  "유통/물류": 80,
  "제조업": 60,
  "건설": 40,
};

const REGION_ACCESS = {
  "서울": 100,
  "경기": 80,
  "인천": 60, "부산": 60, "대구": 60, "대전": 60, "광주": 60, "울산": 60,
};

function penaltyScore(p) {
  if (p >= 1_000_000_000) return 100;
  if (p >= 500_000_000) return 80;
  if (p >= 100_000_000) return 60;
  return 40;
}

function sizeScore(n) {
  if (n >= 3000) return 100;
  if (n >= 1000) return 80;
  if (n >= 500) return 60;
  return 40;
}

function severityScore(effRate) {
  if (effRate === 0) return 100;
  if (effRate < 0.5) return 80;
  if (effRate < 0.75) return 60;
  return 40;
}

export function calculateScore(company) {
  const p = penaltyScore(company.estimatedPenalty);
  const s = sizeScore(company.employees);
  const i = INDUSTRY_FIT[company.industry] ?? 60;
  const r = REGION_ACCESS[company.region] ?? 40;
  const effRate =
    company.mandatoryCount > 0
      ? company.effectiveCount / company.mandatoryCount
      : 0;
  const sv = severityScore(effRate);

  const total = Math.round(p * 0.4 + s * 0.2 + i * 0.2 + r * 0.1 + sv * 0.1);
  const tier = total >= 90 ? "hot" : total >= 70 ? "warm" : "cold";

  return {
    total,
    tier,
    breakdown: {
      penalty: p,
      size: s,
      industry: i,
      region: r,
      severity: sv,
    },
  };
}

export const TIER_META = {
  hot:  { emoji: "🔴", label: "즉시 공략", color: "#EF4444" },
  warm: { emoji: "🟡", label: "우선 공략", color: "#F59E0B" },
  cold: { emoji: "🟢", label: "일반 관리", color: "#10B981" },
};

// ============================================================
// ROI 계산 (제안서 ROI 차트 + Claude 컨텍스트)
// ============================================================

export function computeROI(company) {
  const hireNeeded = Math.ceil(company.deficit / 2); // 중증 1명 = 2명 인정
  const annualHireCost = hireNeeded * 2_200_000 * 12;
  const annualPenalty = company.estimatedPenalty;
  const annualSaving = Math.max(0, annualPenalty - annualHireCost);
  const additionalIncentive = 0;
  return {
    annualPenalty,
    annualHireCost,
    annualSaving,
    additionalIncentive,
    hireNeeded,
  };
}
