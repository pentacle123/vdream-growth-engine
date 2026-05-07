// 5×3 USP × 타겟 메시지 매트릭스 — DA 퍼포먼스 랩 서브탭 2 섹션 2

export const USP_MATRIX = {
  usps: [
    "💰 부담금 절감",
    "🏠 재택근무",
    "📋 플립 시스템",
    "🛡️ 분쟁률 0%",
    "🏆 시장 1위",
  ],
  uspKeys: ["saving", "remote", "flip", "zero_dispute", "market_leader"],
  targets: ["HR 담당자", "CFO/경영진", "CEO/대표"],
  targetKeys: ["hr", "cfo", "ceo"],
  messages: [
    [
      "부담금보다 채용이 더 싸다는 걸 아시나요?",
      "연간 ○억 부담금→채용비용으로 전환 시 40~80% 절감",
      "고용부담금, 비용이 아닌 투자로 바꿀 수 있습니다",
    ],
    [
      "편의시설 투자 없이 2~4주면 도입 완료",
      "시설투자 0원, 관리비 포함 올인원 패키지",
      "사무실 리모델링 없이 장애인 고용 의무 충족",
    ],
    [
      "채용부터 근태·급여·증빙까지 한 시스템에서",
      "인사관리 자동화로 추가 인력비용 제로",
      "HR 리소스 투입 최소화, 시스템이 다 해결",
    ],
    [
      "450+사 도입, 노무·산재 분쟁 단 한 건도 없음",
      "법적 리스크 제로, 감사 대비 완벽한 증빙 관리",
      "기업 평판 리스크 없는 안전한 장애인 고용",
    ],
    [
      "대기업·공공기관 검증 완료, 누적 24,000명",
      "국내 1등 장애인 HR 전문기업의 검증된 솔루션",
      "업계 최대 규모, 최다 고객사의 선택",
    ],
  ],
};

export const TONE_OPTIONS = [
  { key: "info", label: "정보형", desc: "팩트·데이터 중심" },
  { key: "urgent", label: "긴급형", desc: "기한·리스크 부각" },
  { key: "empathy", label: "공감형", desc: "페인포인트 공감" },
];

export const TARGET_OPTIONS = [
  { key: "hr", label: "HR 담당자", emoji: "👔" },
  { key: "cfo", label: "CFO/경영진", emoji: "📊" },
  { key: "ceo", label: "CEO/대표", emoji: "🏢" },
];
