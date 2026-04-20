// ListeningMind MCP에서 2026.04.20 추출한 실데이터 하드코딩
// TAB 5 (검색 데이터 분석) 에서 사용

export const SEARCH_DATA = [
  {
    keyword: "장애인 고용부담금",
    volumeAvg: 7986,
    volumeTotal: 57050,
    trend: "+138%",
    cpc: "$5.08",
    demographics: { male: "71%", age30s: "37%", age40s: "37%" },
    intent: "Informational",
    peakMonth: "1월 (9,710회), 3월 (11,070회)",
    insight:
      "최대 볼륨 키워드. 30~40대 남성 HR관리자 프로필. 1월 신고 시즌에 폭등.",
    shortformOpp:
      "'당신 회사 고용부담금 얼마?' 충격형 → 진단기 CTA",
  },
  {
    keyword: "장애인고용부담금 신고",
    volumeAvg: 1500,
    volumeTotal: 6214,
    trend: "-35%",
    demographics: { female: "55%", age30s: "38%", age40s: "36%" },
    intent: "Informational",
    peakMonth: "1월 (3,890회) — 평소 대비 15배",
    insight:
      "가장 긴급한 니즈. 30대 여성 인사·경리 실무자 프로필. 1월에만 폭등.",
    shortformOpp: "'e신고 전 30초만 보세요' 시즌형 → 진단기",
  },
  {
    keyword: "장애인 채용",
    volumeAvg: 5110,
    volumeTotal: 57200,
    demographics: { male: "61%", age30s: "42%" },
    intent: "Informational",
    insight:
      "양면 시장(구직자+기업). 기업 관점 콘텐츠가 비어 있는 블루오션.",
    shortformOpp: "'장애인 채용, 기업 입장에서 3분 정리' 교육형",
  },
  {
    keyword: "장애인 의무 고용",
    volumeAvg: 660,
    volumeTotal: 9260,
    demographics: { male: "55%", age30s: "30%", age40s: "24%" },
    insight: "제도 이해 탐색 단계. 의무 자체를 확인하려는 초기 검색.",
    shortformOpp: "'50인 이상이면 반드시 알아야 할 것' 정보형",
  },
  {
    keyword: "장애인 재택근무",
    volumeAvg: 526,
    volumeTotal: 6630,
    demographics: { female: "65%", age30s: "34%" },
    insight:
      "브이드림이 이미 검색 생태계 장악. 검색량 자체가 작아서 '해결책'이 아닌 '문제'에서 유입시켜야 함.",
    shortformOpp: "직접 키워드 타겟보다 부담금→재택근무 프레임 전환용",
  },
  {
    keyword: "장애인 고용부담금 계산",
    volumeAvg: 424,
    volumeTotal: 3882,
    demographics: { male: "67%", age30s: "42%" },
    cpc: "$3.86",
    peakMonth: "1월 (1,380회)",
    insight:
      "진단기 직접 유입 키워드. 자기 회사 부담금을 계산하려는 사람.",
    shortformOpp: "진단기 랜딩페이지 SEO + 숏폼 광고 타겟",
  },
  {
    keyword: "장애인 고용 부담금 기준",
    volumeAvg: 223,
    volumeTotal: 1287,
    trend: "+277%",
    demographics: { male: "59%", age30s: "39%", age40s: "28%" },
    insight: "급성장 키워드. 제도 기준 자체를 확인하려는 초기 단계.",
    shortformOpp: "교육형 숏폼으로 인지도 빌드업",
  },
  {
    keyword: "2026년 장애인 고용부담금",
    volumeAvg: 194,
    volumeTotal: 1463,
    demographics: { male: "92%", age40s: "38%", age30s: "38%" },
    peakMonth: "12월 (480회)",
    insight: "거의 전원 남성, 40대 집중. 경영진급이 연말에 검색하는 패턴.",
    shortformOpp: "'2026년 달라지는 부담금' 뉴스형 → CEO 타겟",
  },
];

export const SEARCH_JOURNEYS = [
  {
    name: "세무 처리 경로 (회계담당자)",
    path: "고용부담금 → 손금 불산입 → 경정청구 → 대법원 판결",
    persona: "회계·세무 담당자",
    insight:
      "부담금을 '세금 비용처리'로 인식. 경정청구 가능 여부 확인 중.",
    shortformFrame:
      "'부담금 손금 처리보다 더 좋은 방법이 있습니다' → 진단기",
  },
  {
    name: "채용 행동 경로 (HR 실무자)",
    path: "고용부담금 → 신고 → e신고 → 고용포털 → 채용공고",
    persona: "HR 담당자 (이미 채용 의사결정 완료)",
    insight:
      "부담금을 내다가 채용으로 전환하기로 결정한 사람. 실행 방법 탐색 중.",
    shortformFrame: "'e신고 전에 이것만 확인하세요' → 진단기",
  },
  {
    name: "벤치마킹 경로 (경영진)",
    path: "장애인 재택근무 → 쿠팡 장애인 재택근무 후기 → 브이드림",
    persona: "CEO/HR 관리자 (다른 기업 사례 탐색)",
    insight:
      "쿠팡 등 대기업 사례를 벤치마킹하려는 검색. FOMO 자극 가능.",
    shortformFrame:
      "'대기업이 이미 시작한 장애인 재택근무, 당신 회사는?' → 상담",
  },
  {
    name: "대안 탐색 경로 (비교 검토자)",
    path: "고용부담금 → 연계고용 → 도급계약 → 부담금 감면",
    persona: "HR 관리자 (직접채용 외 대안 검토)",
    insight: "직접 채용이 부담스러워서 연계고용을 검토하는 사람.",
    shortformFrame: "'연계고용 vs 직접채용, 뭐가 더 이득?' 비교형 → 진단기",
  },
  {
    name: "제도 이해 경로 (입문자)",
    path: "장애인 고용 → 장애인 고용촉진 → 고용법 → 고용부담금",
    persona: "HR 신입/이직자 (제도 처음 접하는 사람)",
    insight: "장애인 고용 제도 전반을 파악하려는 초기 탐색.",
    shortformFrame: "'신입 HR이 알아야 할 장애인 고용 ABC' 교육형 시리즈",
  },
];

export const PERCEPTION_CLUSTERS = [
  {
    cluster: "세무/법률 클러스터",
    keywords: [
      "손금 불산입",
      "경정청구",
      "대법원 판결",
      "세무조정",
      "가산세",
    ],
    insight:
      "부담금을 세무 이슈로 인식하는 그룹. 최근 대법원 판결이 화제.",
    opportunity:
      "세무사 크리에이터와 콜라보 → '부담금 안 내는 게 최선의 절세' 프레임",
  },
  {
    cluster: "신고/절차 클러스터",
    keywords: [
      "e신고",
      "신고 방법",
      "연계고용",
      "감면",
      "상시근로자 수 산정",
    ],
    insight: "실무 절차를 처리해야 하는 담당자. 매년 1월 반복되는 업무.",
    opportunity:
      "'HR 실무자를 위한 신고 가이드' → 브이드림이 이 과정을 대행",
  },
  {
    cluster: "계산/비용 클러스터",
    keywords: [
      "부담금 계산",
      "기초액",
      "계산 방법",
      "요율",
      "상시근로자 기준",
    ],
    insight:
      "자기 회사에 얼마가 부과되는지 확인하려는 사람. 진단기 직접 타겟.",
    opportunity: "진단기 SEO 최적화 + '30초 계산' 숏폼 광고",
  },
  {
    cluster: "브이드림/재택근무 클러스터",
    keywords: [
      "브이드림",
      "플립",
      "재택근무",
      "모두의잡",
      "브이드림 후기",
    ],
    insight:
      "브이드림이 '장애인 재택근무' 검색에서 이미 독점적 위치.",
    opportunity:
      "브이드림 인지도 강화보다 '문제→해결책' 전환 경로 최적화",
  },
  {
    cluster: "쿠팡/대기업 사례 클러스터",
    keywords: [
      "쿠팡 장애인 재택근무",
      "쿠팡 장애인 후기",
      "삼성 장애인 채용",
    ],
    insight: "대기업 사례를 벤치마킹하려는 검색. 기업·구직자 혼재.",
    opportunity:
      "'○○기업이 장애인 고용을 시작한 이유' 스토리텔링 숏폼",
  },
];
