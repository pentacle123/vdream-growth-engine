// 브랜드 자산 라이브러리 — 하드코딩 데이터 (DASHBOARD-LIBRARY-SPEC.md Part 2)

export const USP_CARDS = [
  {
    emoji: "💰",
    title: "고용부담금 대비 40~80% 절감",
    proof: "○○산업개발 도입 후 연 16억원 절감 (80%↓)",
    detail:
      "부담금을 내는 것보다 브이드림을 통한 채용이 더 저렴합니다. 중증장애인 더블카운트를 활용하면 절반의 인원으로 의무 충족이 가능합니다.",
    useCases: ["충격형 숏폼", "진단기 결과", "DA 카피", "제안서"],
  },
  {
    emoji: "🏠",
    title: "재택근무 기반, 편의시설 투자 불필요",
    proof: "편의시설 투자 0원, 2~4주 내 도입 완료",
    detail:
      "장애인 고용의 최대 장벽인 사무실 환경 문제를 해결. 재택근무 기반이므로 별도 시설투자 없이 빠르게 도입할 수 있습니다.",
    useCases: ["교육형 숏폼", "랜딩페이지", "비교 콘텐츠"],
  },
  {
    emoji: "📋",
    title: "플립(Flipped) 원스톱 HR 시스템",
    proof: "채용→근태→급여→업무일지→증빙 한 시스템에서 관리",
    detail:
      "자체 개발 장애인 특화 HR 시스템. 실무자와 근로자 간 커뮤니케이션, 리스크 대응, 법정필수이행사항까지 체계적으로 관리합니다.",
    useCases: ["데모형 숏폼", "기능 소개", "HR담당자 타겟"],
  },
  {
    emoji: "🛡️",
    title: "산재·노무 분쟁 0건",
    proof: "누적 450+ 고객사, 24,000명 채용, 분쟁률 0%",
    detail:
      "35명 전문 매니저 팀이 밀착 케어. 근로자 컨디션 체크, 갈등 예방, 법정필수안내까지 선제적으로 관리하여 리스크를 원천 차단합니다.",
    useCases: ["신뢰형 숏폼", "CEO 타겟", "제안서"],
  },
  {
    emoji: "🏆",
    title: "국내 1등 장애인 HR 전문기업",
    proof: "고객사 450+, 기업풀 2,000+, 누적 근로자 10,000+, 누적 절감 8,300억원+",
    detail:
      "대기업·공공기관 검증 완료. 국내 최대 장애인 인재풀 30만명 보유. 삼성, 신한라이프, 현대산업개발, 홈플러스 등 대형 고객사 포트폴리오.",
    useCases: ["실적형 숏폼", "비교 검토자 타겟", "소셜프루프"],
  },
];

export const SUCCESS_CASES = [
  {
    company: "○○산업개발",
    industry: "건설",
    type: "비용절감",
    typeColor: "#EF4444",
    before: "고용부담금 연 20억원 납부",
    after: "브이드림 도입 후 연 4억원",
    saving: "16억원/년 (80% 절감)",
    detail: "중증장애인 재택근무 매칭으로 의무고용 충족",
  },
  {
    company: "대형 엔터테인먼트사",
    industry: "엔터/미디어",
    type: "장애예술인",
    typeColor: "#A78BFA",
    before: "장애인 채용 방법 모름",
    after: "미술·음악·퍼포먼스 장애예술인 채용",
    saving: "ESG 경영 + 기업 문화 향상",
    detail: "브이아트갤러리 프로그램 활용. 기업 굿즈, 사내 갤러리, 공연 진행",
  },
  {
    company: "IT 플랫폼 기업",
    industry: "IT/소프트웨어",
    type: "사무보조",
    typeColor: "#1D85EB",
    before: "채용플랫폼 관리, 리뷰분석 인력 부족",
    after: "장애인 근로자가 데이터 필터링·리뷰 분석 전담",
    saving: "핵심인력 업무집중도 40%↑",
    detail: "반복·단순업무 이관으로 조직 전반 생산성 제고",
  },
  {
    company: "유통 대기업",
    industry: "유통/물류",
    type: "모니터링",
    typeColor: "#F59E0B",
    before: "경쟁사 모니터링 리소스 부족",
    after: "장애인 근로자가 상시 모니터링·리포트 작성",
    saving: "리서치 비용 60%↓",
    detail: "브랜드몰 상세페이지 교열, 경쟁사 행사 모니터링",
  },
];

export const REGULATION_GUIDE = [
  {
    title: "의무고용률",
    value: "민간 3.1% / 공공 3.8%",
    note: "50인 이상 기업 대상. 미이행 시 부담금 부과.",
    icon: "📜",
  },
  {
    title: "부담기초액 (2025)",
    value: "월 1,214,400 ~ 2,156,880원",
    note: "실고용률에 따라 차등. 미고용 시 최대액 적용.",
    icon: "💸",
  },
  {
    title: "중증장애인 더블카운트",
    value: "중증 1명 = 2명 인정",
    note: "비용 효율 극대화의 핵심. 브이드림 중증 매칭 특화.",
    icon: "✖️",
  },
  {
    title: "장려금",
    value: "월 60만원/초과 1명",
    note: "의무 초과 고용 시 매월 장려금 수령.",
    icon: "🎁",
  },
  {
    title: "명단 공표",
    value: "연 1회 불이행 기업 공개",
    note: "기업 이미지 리스크. CEO 가장 민감한 포인트.",
    icon: "📢",
  },
  {
    title: "연계고용",
    value: "도급 계약으로 부담금 감면",
    note: "직접 채용 대비 비용·효과 열위. 비교 숏폼 기회.",
    icon: "🔄",
  },
];

export const COMPETITORS = [
  {
    name: "브이드림",
    customers: "450+",
    pool: "30만+",
    system: "플립(자체)",
    dispute: "0%",
    speed: "2~4주",
    highlight: true,
  },
  {
    name: "더봄플러스",
    customers: "소규모",
    pool: "제한적",
    system: "없음",
    dispute: "불명",
    speed: "4~8주",
    highlight: false,
  },
  {
    name: "제이민",
    customers: "소규모",
    pool: "제한적",
    system: "없음",
    dispute: "불명",
    speed: "4~8주",
    highlight: false,
  },
  {
    name: "한국장애인고용공단",
    customers: "공공",
    pool: "공공DB",
    system: "워크투게더",
    dispute: "-",
    speed: "장기",
    highlight: false,
  },
];
