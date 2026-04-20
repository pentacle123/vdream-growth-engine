// 업종별 평균 장애인 고용률 (%) — 동종업계 비교용 하드코딩 데이터
// 출처: 고용노동부 장애인 의무고용 현황(참조 기준값)

export const INDUSTRY_AVG = {
  "제조업": 2.8,
  "IT/소프트웨어": 1.9,
  "금융/보험": 2.5,
  "유통/물류": 2.3,
  "건설": 1.7,
  "서비스업": 2.1,
  "공공기관": 3.4,
  "기타": 2.2,
};

export const OVERALL_AVG = 2.4;

// URL 공유용 업종 코드 ↔ 라벨 매핑
export const INDUSTRY_CODE = {
  "제조업": "mfg",
  "IT/소프트웨어": "it",
  "금융/보험": "fin",
  "유통/물류": "dist",
  "건설": "const",
  "서비스업": "svc",
  "공공기관": "public",
  "기타": "etc",
};

export const CODE_INDUSTRY = Object.fromEntries(
  Object.entries(INDUSTRY_CODE).map(([label, code]) => [code, label])
);

/**
 * 업종 평균 대비 차이 백분율 + 메시지
 * @returns {{diffPct: number, text: string, belowAverage: boolean}}
 */
export function compareToIndustry(yourRate, industry) {
  const avg = INDUSTRY_AVG[industry] ?? OVERALL_AVG;
  if (avg === 0) {
    return { diffPct: 0, text: "비교 데이터 없음", belowAverage: false };
  }
  const diff = ((yourRate - avg) / avg) * 100;
  const abs = Math.abs(diff).toFixed(1);
  if (diff < -0.05) {
    return {
      diffPct: diff,
      text: `같은 업종 유사 규모 기업 대비 귀사는 ${abs}% 낮습니다`,
      belowAverage: true,
    };
  }
  if (diff > 0.05) {
    return {
      diffPct: diff,
      text: `같은 업종 유사 규모 기업 대비 귀사는 ${abs}% 높습니다`,
      belowAverage: false,
    };
  }
  return {
    diffPct: 0,
    text: "같은 업종 평균과 유사한 수준입니다",
    belowAverage: false,
  };
}
