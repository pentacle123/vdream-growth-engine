// Brandformance Engine — 18 Opportunities across 3 categories
// 트립닷컴 Brandformance Engine 구조를 브이드림 B2B에 맞게 번역

export const CATEGORIES = [
  {
    key: "usp",
    code: "A",
    title: "VDream USP 기반 기회",
    tagline: "브이드림의 핵심 가치제안에서 출발한 숏폼 콘텐츠 기회",
    color: "#36CFBA",
    icon: "💎",
  },
  {
    key: "context",
    code: "B",
    title: "제도/상황 기반 기회",
    tagline: "소비자가 처한 제도적·비즈니스 상황에서 출발한 기회",
    color: "#1D85EB",
    icon: "⚖️",
  },
  {
    key: "interest",
    code: "C",
    title: "숨겨진 진입점 — 관심사 기반 기회",
    tagline: "장애인 고용과 직접 관련 없는 관심사에서 브이드림을 '발견'하게 하는 기회",
    color: "#A78BFA",
    icon: "🔍",
  },
];

export const OPPORTUNITIES = [
  // ============================================================
  // A: VDream USP 기반 (6개)
  // ============================================================
  {
    id: "A-1",
    category: "usp",
    emoji: "💰",
    title: "부담금보다 싸다",
    target: "부담금 납부 중인 HR 관리자·CFO",
    insight:
      "매년 부담금을 내면서 '이게 맞나?'라는 의문을 가진 사람. 부담금 vs 채용비용 비교를 숫자로 보여주면 즉시 설득 가능.",
    signals: [
      "'장애인 고용부담금' 월 7,986회 검색 (연간 57,050회 누적)",
      "'고용부담금 계산' 월 424회 검색, CPC $3.86",
    ],
    contents: [
      {
        type: "충격형",
        title: "당신 회사가 매년 ○억 버리고 있습니다",
        desc: "숫자 시뮬레이션으로 부담금 규모 각인",
        duration: "30초",
      },
      {
        type: "비교형",
        title: "부담금 vs 브이드림, 뭐가 더 싸을까?",
        desc: "인포그래픽 기반 ROI 비교",
        duration: "45초",
      },
    ],
    creators: [
      { name: "HR/노무 전문", fit: 95 },
      { name: "금융/세무 전문", fit: 80 },
    ],
    platforms: ["유튜브 쇼츠", "링크드인"],
    season: "연중 상시 (1월·연말 강화)",
    ctas: ["diagnose"],
    score: 95,
  },
  {
    id: "A-2",
    category: "usp",
    emoji: "🏠",
    title: "재택근무로 해결",
    target: "장애인 고용 의무는 알지만 편의시설·공간이 부담인 기업",
    insight:
      "'장애인을 우리 사무실에서 어떻게 일하게 하지?'라는 고정관념이 최대 장벽. 재택근무라는 해결책 자체를 모르는 사람이 많음.",
    signals: ["'장애인 재택근무' 월 526회 — 여성 65%, 30대 34%"],
    contents: [
      {
        type: "스토리형",
        title: "이 회사는 사무실 개조 없이 장애인 10명을 채용했다",
        desc: "실제 도입 스토리텔링",
        duration: "60초",
      },
      {
        type: "교육형",
        title: "장애인 재택근무, 이렇게 쉽습니다",
        desc: "제도 + 플립 시스템 개요",
        duration: "30초",
      },
    ],
    creators: [
      { name: "장애인 당사자 크리에이터", fit: 82 },
      { name: "경영/비즈니스", fit: 88 },
    ],
    platforms: ["유튜브", "인스타 릴스"],
    season: "연중 상시",
    ctas: ["diagnose", "consult"],
    score: 88,
  },
  {
    id: "A-3",
    category: "usp",
    emoji: "⚡",
    title: "2~4주면 끝",
    target: "자회사형 표준사업장 검토 중이거나 도입 속도가 중요한 기업",
    insight:
      "자회사형은 별도 법인 + 시설 구축에 수억원과 수개월 소요. 브이드림은 2~4주면 도입 완료.",
    signals: [],
    contents: [
      {
        type: "비교형",
        title: "자회사형 vs 재택근무 직접채용, 속도와 비용 비교",
        desc: "도입 타임라인 인포그래픽",
        duration: "45초",
      },
    ],
    creators: [{ name: "경영/비즈니스", fit: 88 }],
    platforms: ["링크드인", "유튜브 쇼츠"],
    season: "연중 상시",
    ctas: ["diagnose"],
    score: 82,
  },
  {
    id: "A-4",
    category: "usp",
    emoji: "🛡️",
    title: "분쟁률 0%",
    target: "장애인 고용 시 노무·법적 리스크를 걱정하는 HR·법무팀",
    insight:
      "'장애인 채용하면 문제 생기면 어쩌지?'가 숨겨진 장벽. 브이드림 450+사 분쟁 0건이라는 트랙레코드가 가장 강력한 설득.",
    signals: [],
    contents: [
      {
        type: "신뢰형",
        title: "450개 기업, 24,000명 채용, 분쟁 0건",
        desc: "숫자 나열로 신뢰도 각인",
        duration: "30초",
      },
      {
        type: "후기형",
        title: "노동부 감사도 걱정 없었어요",
        desc: "고객 후기 클립",
        duration: "30초",
      },
    ],
    creators: [{ name: "HR/노무 전문", fit: 95 }],
    platforms: ["유튜브 쇼츠", "링크드인"],
    season: "연중 상시",
    ctas: ["consult"],
    score: 90,
  },
  {
    id: "A-5",
    category: "usp",
    emoji: "📋",
    title: "플립 하나로 끝",
    target: "채용 후 관리(근태·급여·증빙)가 부담인 HR",
    insight: "채용 자체보다 '채용 후 어떻게 관리하지?'가 더 큰 두려움.",
    signals: [],
    contents: [
      {
        type: "데모형",
        title: "플립 시스템 30초 미리보기",
        desc: "화면 녹화 기반 기능 시연",
        duration: "30초",
      },
      {
        type: "고객후기형",
        title: "플립 쓰니까 한 화면에서 다 해결돼요",
        desc: "실제 HR 담당자 후기",
        duration: "45초",
      },
    ],
    creators: [{ name: "HR/노무 전문", fit: 95 }],
    platforms: ["유튜브 쇼츠", "링크드인"],
    season: "연중 상시",
    ctas: ["consult"],
    score: 85,
  },
  {
    id: "A-6",
    category: "usp",
    emoji: "🏆",
    title: "시장 1위의 신뢰",
    target: "여러 업체를 비교 검토 중인 의사결정자",
    insight:
      "'장애인 고용 대행' 검색 시 여러 업체가 나오는데, 브이드림의 압도적 실적(450사, 24,000명, 8,300억 절감)이 차별점.",
    signals: [],
    contents: [
      {
        type: "실적형",
        title: "장애인 채용 시장 점유율 1위, 브이드림",
        desc: "실적 숫자 몽타주",
        duration: "30초",
      },
    ],
    creators: [{ name: "경영/비즈니스", fit: 88 }],
    platforms: ["링크드인", "유튜브"],
    season: "연중 상시",
    ctas: ["diagnose"],
    score: 80,
  },

  // ============================================================
  // B: 제도/상황 기반 (6개)
  // ============================================================
  {
    id: "B-1",
    category: "context",
    emoji: "📅",
    title: "1월 신고 공포",
    target: "매년 1월 부담금 신고를 처리하는 인사·경리 실무자",
    insight:
      "30대 여성 인사 실무자가 매년 반복되는 신고 업무에서 느끼는 피로감과 '올해는 다르게 할 수 없나?'라는 욕구.",
    signals: [
      "'장애인고용부담금 신고' 1월 3,890회 — 평소 대비 15배 폭등",
      "검색자 인구통계: 여성 55%, 30대 38%, 40대 36%",
    ],
    contents: [
      {
        type: "공감형",
        title: "HR 담당자의 1월은 왜 이렇게 바쁜가",
        desc: "직장인 공감 톤",
        duration: "30초",
      },
      {
        type: "솔루션형",
        title: "내년 1월엔 이 신고 안 해도 됩니다",
        desc: "부담금 → 채용 전환 메시지",
        duration: "45초",
      },
    ],
    creators: [
      { name: "직장인 공감 숏폼", fit: 75 },
      { name: "HR/노무 전문", fit: 95 },
    ],
    platforms: ["인스타 릴스", "유튜브 쇼츠"],
    season: "10~1월 집중",
    ctas: ["diagnose"],
    score: 95,
  },
  {
    id: "B-2",
    category: "context",
    emoji: "⚖️",
    title: "손금 처리 가능?",
    target: "부담금을 비용(손금)으로 처리하려는 회계·세무 담당자",
    insight:
      "최근 대법원 판결 이후 세무 담당자들이 '우리도 경정청구 가능한가?' 대량 검색 중. 이 사람을 '부담금 안 내는 게 최선의 절세'로 리프레이밍.",
    signals: [
      "PathFinder: 고용부담금 → 손금 불산입 → 경정청구 → 대법원 판결",
    ],
    contents: [
      {
        type: "뉴스형",
        title: "고용부담금 대법원 판결, 세무 담당자가 알아야 할 것",
        desc: "판결 해설 + 대응법",
        duration: "45초",
      },
      {
        type: "전환형",
        title: "손금 처리보다 더 좋은 방법이 있습니다",
        desc: "절세 프레임 → 진단기",
        duration: "30초",
      },
    ],
    creators: [{ name: "금융/세무 전문", fit: 80 }],
    platforms: ["유튜브 쇼츠", "네이버 클립"],
    season: "판결·정책 이슈 발생 시",
    ctas: ["diagnose"],
    score: 88,
  },
  {
    id: "B-3",
    category: "context",
    emoji: "📢",
    title: "명단 공표 리스크",
    target: "기업 이미지를 중시하는 CEO·경영진",
    insight:
      "매년 고용노동부가 불이행 기업 명단을 공표. CEO 입장에서 가장 민감한 리스크.",
    signals: ["ClusterFinder: '장애인 고용의무 불이행 명단공표' 클러스터"],
    contents: [
      {
        type: "위기형",
        title: "당신 회사, 명단 공표 대상인지 확인하세요",
        desc: "자가진단 후킹",
        duration: "30초",
      },
      {
        type: "데이터형",
        title: "2024년 명단에 오른 기업들의 공통점",
        desc: "데이터 기반 리스크 분석",
        duration: "45초",
      },
    ],
    creators: [{ name: "경영/비즈니스", fit: 88 }],
    platforms: ["링크드인", "유튜브"],
    season: "공표 시점 전후 (3~4월 집중)",
    ctas: ["diagnose"],
    score: 96,
  },
  {
    id: "B-4",
    category: "context",
    emoji: "🔄",
    title: "연계고용 vs 직접고용",
    target: "직접 채용 외 대안을 검토 중인 HR 관리자",
    insight:
      "'직접 채용은 부담스러운데 다른 방법 없나?' — 연계고용을 검토하는 사람을 직접채용(브이드림)이 더 유리하다고 설득.",
    signals: [
      "ClusterFinder: '연계고용', '도급계약', '부담금 감면' 클러스터",
    ],
    contents: [
      {
        type: "비교형",
        title: "연계고용 vs 직접채용, 비용·효과 완전 비교",
        desc: "실제 시나리오 기반 비교",
        duration: "60초",
      },
    ],
    creators: [{ name: "HR/노무 전문", fit: 95 }],
    platforms: ["유튜브 쇼츠", "링크드인"],
    season: "연중 상시",
    ctas: ["diagnose"],
    score: 85,
  },
  {
    id: "B-5",
    category: "context",
    emoji: "📈",
    title: "ESG 점수 올리기",
    target: "ESG 경영 압박을 받는 경영진·CSR 담당자",
    insight:
      "ESG 평가에서 장애인 고용은 사회(S) 부문의 핵심 지표인데, 이걸 명시적으로 연결하는 콘텐츠가 거의 없음.",
    signals: ["'ESG 장애인' 검색 존재 — 볼륨은 작지만 트렌드 상승"],
    contents: [
      {
        type: "트렌드형",
        title: "ESG 등급 올리는 가장 빠른 방법: 장애인 고용",
        desc: "ESG 평가 항목 연결",
        duration: "45초",
      },
    ],
    creators: [{ name: "경영/비즈니스", fit: 88 }],
    platforms: ["링크드인", "유튜브"],
    season: "ESG 보고서 시즌 (2~3월, 9~10월)",
    ctas: ["consult"],
    score: 83,
  },
  {
    id: "B-6",
    category: "context",
    emoji: "💸",
    title: "부담금 인상 대비",
    target: "제도 변화를 주시하는 HR 관리자·경영진",
    insight:
      "대통령이 부담금 인상 검토를 언급한 이후 경영진급이 직접 검색. 긴급성 최고.",
    signals: [
      "'고용부담금 인상' 검색 증가",
      "'2026년 장애인 고용부담금' — 남성 92%, 40대 38%, 30대 38%",
    ],
    contents: [
      {
        type: "속보형",
        title: "고용부담금 인상 확정? 지금 대비해야 할 3가지",
        desc: "정책 이슈 즉시 대응",
        duration: "30초",
      },
    ],
    creators: [
      { name: "HR/노무 전문", fit: 95 },
      { name: "금융/세무 전문", fit: 80 },
    ],
    platforms: ["유튜브 쇼츠", "링크드인"],
    season: "정책 발표 시 즉시 대응",
    ctas: ["diagnose"],
    score: 93,
  },

  // ============================================================
  // C: 숨겨진 진입점 (6개)
  // ============================================================
  {
    id: "C-1",
    category: "interest",
    emoji: "🏢",
    title: "대기업은 어떻게?",
    target: "다른 기업의 장애인 고용 사례를 벤치마킹하려는 HR·경영진",
    insight:
      "쿠팡·삼성 등 대기업 사례를 찾는 사람에게 '대기업도 하고 있고, 당신도 할 수 있다'는 FOMO + 실행법을 동시에 전달.",
    signals: [
      "'쿠팡 장애인 재택근무 후기' 대량 검색",
      "'삼성 장애인 채용' 대량 검색",
    ],
    contents: [
      {
        type: "사례형",
        title: "쿠팡이 장애인 재택근무를 시작한 이유",
        desc: "60초 스토리텔링",
        duration: "60초",
      },
      {
        type: "FOMO형",
        title: "대기업이 이미 시작한 것, 당신 회사는?",
        desc: "벤치마킹 자극",
        duration: "30초",
      },
    ],
    creators: [
      { name: "경영/비즈니스", fit: 88 },
      { name: "장애인 당사자 크리에이터", fit: 82 },
    ],
    platforms: ["유튜브", "링크드인"],
    season: "연중 상시",
    ctas: ["diagnose", "consult"],
    score: 87,
  },
  {
    id: "C-2",
    category: "interest",
    emoji: "👔",
    title: "신입 HR의 장애인 고용 입문",
    target: "장애인 고용 제도를 처음 접하는 HR 신입/이직자",
    insight:
      "제도 전체를 파악하려는 초기 탐색자에게 '3분이면 다 이해된다'는 교육 콘텐츠. 이 사람이 나중에 의사결정자가 됨.",
    signals: [
      "PathFinder: 장애인 고용 → 고용촉진 → 고용법 → 부담금 (입문 경로)",
    ],
    contents: [
      {
        type: "시리즈형",
        title: "신입 HR을 위한 장애인 고용 ABC (3편 시리즈)",
        desc: "제도 개요 → 부담금 → 채용법",
        duration: "각 45초",
      },
    ],
    creators: [{ name: "HR/노무 전문", fit: 95 }],
    platforms: ["유튜브 쇼츠", "인스타 릴스"],
    season: "연중 상시 (3월·9월 입사 시즌 강화)",
    ctas: ["diagnose"],
    score: 78,
  },
  {
    id: "C-3",
    category: "interest",
    emoji: "👩‍💼",
    title: "여성 HR 실무자의 시즌 업무",
    target: "매년 1월 신고 업무를 담당하는 30대 여성 인사담당",
    insight:
      "이 사람은 '장애인 고용'이 아니라 '내 업무를 줄이고 싶다'가 본심. 브이드림이 신고 업무까지 대행한다는 메시지.",
    signals: ["부담금 신고 검색자 인구통계: 여성 55%, 30대 38%"],
    contents: [
      {
        type: "공감형",
        title: "매년 1월이 두려운 HR에게",
        desc: "릴스 공감 톤",
        duration: "30초",
      },
      {
        type: "솔루션형",
        title: "이 업무, 시스템이 대신하면?",
        desc: "플립 데모",
        duration: "45초",
      },
    ],
    creators: [{ name: "직장인 공감 숏폼", fit: 75 }],
    platforms: ["인스타 릴스"],
    season: "10~1월 집중",
    ctas: ["diagnose"],
    score: 85,
  },
  {
    id: "C-4",
    category: "interest",
    emoji: "🤝",
    title: "기업 관점 블루오션",
    target: "'장애인 채용'을 검색하는 기업 HR (현재 구직자 콘텐츠에 묻혀 있음)",
    insight:
      "거대한 검색 시장에서 기업 관점 콘텐츠가 거의 없음. '기업을 위한 장애인 채용 가이드' 콘텐츠를 만들면 블루오션.",
    signals: [
      "'장애인 채용' 월 5,110회 — PathFinder상 구직자 경로 지배적",
    ],
    contents: [
      {
        type: "교육형",
        title: "장애인 채용, 기업 담당자를 위한 3분 정리",
        desc: "기업 관점 가이드",
        duration: "60초",
      },
    ],
    creators: [{ name: "HR/노무 전문", fit: 95 }],
    platforms: ["유튜브 쇼츠", "링크드인"],
    season: "연중 상시",
    ctas: ["diagnose"],
    score: 82,
  },
  {
    id: "C-5",
    category: "interest",
    emoji: "💼",
    title: "비용 최적화 HR 트렌드",
    target: "인건비·운영비 절감을 고민하는 CFO·HR",
    insight:
      "'장애인 고용'이 아니라 '비용 최적화' 맥락에서 접근. 부담금이 연간 수억인 기업에게 '이 비용을 제로로 만들 수 있다'는 프레임.",
    signals: [],
    contents: [
      {
        type: "인사이트형",
        title: "HR 비용 줄이는 법: 아무도 안 알려주는 한 가지",
        desc: "티저 인사이트",
        duration: "30초",
      },
    ],
    creators: [{ name: "경영/비즈니스", fit: 88 }],
    platforms: ["링크드인", "유튜브"],
    season: "예산 편성기 (7~11월)",
    ctas: ["diagnose"],
    score: 80,
  },
  {
    id: "C-6",
    category: "interest",
    emoji: "🌱",
    title: "착한 기업 이미지 만들기",
    target: "CSR·사회공헌·브랜딩에 관심 있는 마케팅·경영진",
    insight:
      "장애인 고용을 '의무'가 아닌 '브랜드 자산'으로 리프레이밍. 브이드림이 만들어주는 사회적 가치 스토리.",
    signals: [],
    contents: [
      {
        type: "브랜디드 다큐",
        title: "이 회사가 장애인 고용 후 달라진 것들",
        desc: "60초 브랜드 스토리",
        duration: "60초",
      },
    ],
    creators: [
      { name: "장애인 당사자 크리에이터", fit: 82 },
      { name: "경영/비즈니스", fit: 88 },
    ],
    platforms: ["유튜브", "인스타 릴스"],
    season: "연말 시상 시즌 (12월), 장애인의날 (4월)",
    ctas: ["consult"],
    score: 78,
  },
];

export const CTA_META = {
  diagnose: {
    label: "AI 진단기로 이동",
    emoji: "🔍",
    description: "우리 회사 고용부담금 즉시 계산",
    tabIndex: 0, // 같은 앱 내 TAB 0
  },
  consult: {
    label: "브이드림 무료 상담 신청",
    emoji: "💬",
    description: "450+ 기업이 선택한 장애인 고용 파트너",
    href: "https://www.vdream.co.kr/inquiry",
  },
  phone: {
    label: "1644-8619 전화 상담",
    emoji: "📞",
    description: "평일 09:00~18:00",
    href: "tel:1644-8619",
  },
};

export function byCategory(key) {
  return OPPORTUNITIES.filter((o) => o.category === key);
}

export function findOpportunity(id) {
  return OPPORTUNITIES.find((o) => o.id === id);
}

export function findCategory(key) {
  return CATEGORIES.find((c) => c.key === key);
}
