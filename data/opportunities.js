// 기회 발견 & 콘텐츠 전략 — 18 Opportunities × 3 Categories
// OPPORTUNITY-SPEC.md 스키마 그대로 적용
// 트립닷컴 Brandformance Engine 방법론 → 브이드림 B2B

export const CATEGORIES = [
  {
    key: "A",
    title: "VDream USP 기반",
    icon: "💎",
    color: "#00C9A7",
    tagline: "브이드림의 핵심 가치제안에서 출발한 숏폼 기회",
  },
  {
    key: "B",
    title: "제도/상황 기반",
    icon: "⚖️",
    color: "#1D85EB",
    tagline: "소비자가 처한 제도적·비즈니스 상황에서 출발한 기회",
  },
  {
    key: "C",
    title: "숨겨진 진입점",
    icon: "🔍",
    color: "#A78BFA",
    tagline: "장애인 고용과 직접 관련 없는 관심사에서 브이드림을 발견하게 하는 기회",
  },
];

export const OPPORTUNITIES = [
  // ── A. VDream USP 기반 ──
  {
    id: "A1",
    cat: "A",
    emoji: "💰",
    title: "부담금보다 싸다",
    target: "부담금 납부 중인 HR/CFO",
    signal: "'장애인 고용부담금' 월 7,986회, CPC $5.08",
    insight:
      "매년 부담금을 내면서 '이게 맞나?' 의문을 가진 사람. 비교 숫자로 즉시 설득 가능.",
    contents: [
      { type: "충격형", title: "당신 회사가 매년 ○억 버리고 있습니다", dur: "30초", score: 95 },
      { type: "비교형", title: "부담금 vs 브이드림, 뭐가 더 싸을까?", dur: "45초", score: 90 },
    ],
    creators: ["HR/노무 전문(95%)", "금융/세무(80%)"],
    platforms: ["유튜브 쇼츠", "링크드인"],
    cta: "진단기",
    score: 95,
  },
  {
    id: "A2",
    cat: "A",
    emoji: "🏠",
    title: "재택근무로 해결",
    target: "편의시설·공간 부담인 기업",
    signal: "'장애인 재택근무' 월 526회, 여성 65%",
    insight:
      "'사무실에서 어떻게 일하게 하지?'라는 고정관념이 최대 장벽. 재택이라는 해결책 자체를 모름.",
    contents: [
      { type: "스토리형", title: "사무실 개조 없이 장애인 10명을 채용한 회사", dur: "60초", score: 88 },
      { type: "교육형", title: "장애인 재택근무, 이렇게 쉽습니다", dur: "30초", score: 82 },
    ],
    creators: ["장애인 당사자(82%)", "경영/비즈(88%)"],
    platforms: ["유튜브", "인스타 릴스"],
    cta: "진단기",
    score: 88,
  },
  {
    id: "A3",
    cat: "A",
    emoji: "⚡",
    title: "2~4주면 끝",
    target: "도입 속도가 중요한 기업",
    signal: "자회사형 표준사업장 대비 속도·비용 비교",
    insight:
      "자회사형은 수억원+수개월. 브이드림은 2~4주. 의사결정 속도가 빠른 기업에 최적.",
    contents: [
      { type: "비교형", title: "자회사형 vs 재택 직접채용, 속도와 비용", dur: "45초", score: 82 },
    ],
    creators: ["경영/비즈(88%)"],
    platforms: ["유튜브 쇼츠", "링크드인"],
    cta: "진단기",
    score: 82,
  },
  {
    id: "A4",
    cat: "A",
    emoji: "🛡️",
    title: "분쟁률 0%",
    target: "노무·법적 리스크 걱정하는 HR/법무",
    signal: "450+사, 24,000명, 분쟁 0건 트랙레코드",
    insight:
      "'채용하면 문제 생기면?'이 숨겨진 장벽. 0% 실적이 가장 강력한 설득.",
    contents: [
      { type: "신뢰형", title: "450개 기업, 24,000명 채용, 분쟁 0건", dur: "30초", score: 90 },
      { type: "후기형", title: "노동부 감사도 걱정 없었어요", dur: "45초", score: 85 },
    ],
    creators: ["HR/노무 전문(95%)"],
    platforms: ["유튜브 쇼츠", "링크드인"],
    cta: "상담",
    score: 90,
  },
  {
    id: "A5",
    cat: "A",
    emoji: "📋",
    title: "플립 하나로 끝",
    target: "채용 후 관리 부담인 HR",
    signal: "미팅자료: 관리 인프라 부족이 고용 실패 최대 원인",
    insight:
      "채용보다 '채용 후 어떻게 관리?'가 더 큰 두려움. 플립이 이걸 해결.",
    contents: [
      { type: "데모형", title: "플립 시스템 30초 미리보기", dur: "30초", score: 85 },
      { type: "후기형", title: "한 화면에서 다 해결돼요", dur: "45초", score: 80 },
    ],
    creators: ["HR/노무 전문(95%)"],
    platforms: ["유튜브 쇼츠"],
    cta: "상담",
    score: 85,
  },
  {
    id: "A6",
    cat: "A",
    emoji: "🏆",
    title: "시장 1위의 신뢰",
    target: "여러 업체 비교 중인 의사결정자",
    signal: "450사, 24,000명, 8,300억 절감 실적",
    insight: "경쟁사 대비 압도적 규모. 비교 검토 단계에서 결정타.",
    contents: [
      { type: "실적형", title: "장애인 채용 시장 1위, 브이드림", dur: "30초", score: 80 },
    ],
    creators: ["경영/비즈(88%)"],
    platforms: ["유튜브", "링크드인"],
    cta: "진단기",
    score: 80,
  },

  // ── B. 제도/상황 기반 ──
  {
    id: "B1",
    cat: "B",
    emoji: "📅",
    title: "1월 신고 공포",
    target: "매년 1월 부담금 신고 담당 인사·경리 실무자",
    signal:
      "'장애인고용부담금 신고' 1월 3,890회(15배 폭등), 여성55%, 30대38%",
    insight:
      "30대 여성 인사실무자의 매년 반복되는 피로. '올해는 다르게 할 수 없나?'",
    contents: [
      { type: "공감형", title: "HR 담당자의 1월은 왜 이렇게 바쁜가", dur: "30초", score: 92 },
      { type: "솔루션형", title: "내년 1월엔 이 신고 안 해도 됩니다", dur: "45초", score: 95 },
    ],
    creators: ["직장인 공감(75%)", "HR/노무(95%)"],
    platforms: ["인스타 릴스", "유튜브 쇼츠"],
    cta: "진단기",
    season: "10~1월",
    score: 95,
  },
  {
    id: "B2",
    cat: "B",
    emoji: "⚖️",
    title: "손금 처리 가능?",
    target: "부담금 비용처리하려는 회계·세무 담당자",
    signal:
      "PathFinder: 부담금→손금불산입→경정청구→대법원판결. 노출1,240회 클릭0",
    insight:
      "최근 대법원 판결 이후 '경정청구 가능한가?' 대량 검색. 리프레이밍 기회.",
    contents: [
      { type: "뉴스형", title: "고용부담금 대법원 판결, 세무담당자 필독", dur: "45초", score: 88 },
      { type: "전환형", title: "손금 처리보다 더 좋은 방법이 있습니다", dur: "30초", score: 90 },
    ],
    creators: ["금융/세무(80%)"],
    platforms: ["유튜브 쇼츠", "네이버 클립"],
    cta: "진단기",
    score: 88,
  },
  {
    id: "B3",
    cat: "B",
    emoji: "📢",
    title: "명단 공표 리스크",
    target: "기업 이미지 중시하는 CEO/경영진",
    signal: "장애인 고용의무 불이행 명단공표 클러스터",
    insight:
      "매년 고용노동부가 명단 공표. CEO가 가장 민감하게 반응하는 리스크.",
    contents: [
      { type: "위기형", title: "당신 회사, 명단 공표 대상인지 확인하세요", dur: "30초", score: 96 },
      { type: "데이터형", title: "2024년 명단에 오른 기업들의 공통점", dur: "45초", score: 88 },
    ],
    creators: ["경영/비즈(88%)"],
    platforms: ["유튜브", "링크드인"],
    cta: "진단기",
    score: 96,
  },
  {
    id: "B4",
    cat: "B",
    emoji: "🔄",
    title: "연계고용 vs 직접고용",
    target: "직접 채용 외 대안 검토 중인 HR",
    signal: "ClusterFinder: 연계고용, 도급계약, 부담금 감면",
    insight:
      "'직접 채용은 부담'인 사람을 '브이드림이 더 유리'로 설득.",
    contents: [
      { type: "비교형", title: "연계고용 vs 직접채용, 비용·효과 완전 비교", dur: "60초", score: 85 },
    ],
    creators: ["HR/노무(95%)"],
    platforms: ["유튜브 쇼츠"],
    cta: "진단기",
    score: 85,
  },
  {
    id: "B5",
    cat: "B",
    emoji: "📈",
    title: "ESG 점수 올리기",
    target: "ESG 압박받는 경영진·CSR 담당",
    signal: "'ESG 장애인' 검색 존재, 트렌드 상승",
    insight:
      "ESG 사회(S) 부문 핵심 지표인데 연결 콘텐츠가 거의 없음.",
    contents: [
      { type: "트렌드형", title: "ESG 등급 올리는 가장 빠른 방법: 장애인 고용", dur: "45초", score: 83 },
    ],
    creators: ["경영/비즈(88%)"],
    platforms: ["링크드인", "유튜브"],
    cta: "상담",
    score: 83,
  },
  {
    id: "B6",
    cat: "B",
    emoji: "💸",
    title: "부담금 인상 대비",
    target: "제도 변화 주시하는 HR/경영진",
    signal:
      "'고용부담금 인상' 증가, '2026년 장애인 고용부담금' 남성92% 40대38%",
    insight:
      "대통령 부담금 인상 검토 언급 이후 경영진급 직접 검색. 긴급성 최고.",
    contents: [
      { type: "속보형", title: "고용부담금 인상 확정? 지금 대비해야 할 3가지", dur: "30초", score: 93 },
    ],
    creators: ["HR/노무(95%)", "금융/세무(80%)"],
    platforms: ["유튜브 쇼츠", "링크드인"],
    cta: "진단기",
    season: "정책발표시",
    score: 93,
  },

  // ── C. 숨겨진 진입점 ──
  {
    id: "C1",
    cat: "C",
    emoji: "🏢",
    title: "대기업은 어떻게?",
    target: "다른 기업 사례 벤치마킹하려는 HR/경영진",
    signal: "'쿠팡 장애인 재택근무 후기', '삼성 장애인 채용' 대량 검색",
    insight:
      "대기업 사례 FOMO + '우리도 할 수 있다'는 실행법 동시 전달.",
    contents: [
      { type: "사례형", title: "쿠팡이 장애인 재택근무를 시작한 이유", dur: "60초", score: 87 },
      { type: "FOMO형", title: "대기업이 이미 시작한 것, 당신 회사는?", dur: "30초", score: 85 },
    ],
    creators: ["경영/비즈(88%)", "장애인 당사자(82%)"],
    platforms: ["유튜브", "링크드인"],
    cta: "상담",
    score: 87,
  },
  {
    id: "C2",
    cat: "C",
    emoji: "👔",
    title: "신입 HR의 장애인 고용 입문",
    target: "제도 처음 접하는 HR 신입/이직자",
    signal: "PathFinder: 장애인 고용→고용촉진→고용법→부담금",
    insight:
      "제도 전체 파악하려는 초기 탐색자. 교육 시리즈로 미래 의사결정자 확보.",
    contents: [
      { type: "시리즈형", title: "신입 HR을 위한 장애인 고용 ABC (3편)", dur: "60초×3", score: 78 },
    ],
    creators: ["HR/노무(95%)"],
    platforms: ["유튜브 쇼츠"],
    cta: "진단기",
    score: 78,
  },
  {
    id: "C3",
    cat: "C",
    emoji: "👩‍💼",
    title: "여성 HR 실무자의 시즌 업무",
    target: "매년 1월 신고 담당 30대 여성 인사담당",
    signal: "부담금 신고 검색자 여성55%, 30대38%",
    insight:
      "'장애인 고용'이 아니라 '내 업무를 줄이고 싶다'가 본심.",
    contents: [
      { type: "공감형", title: "매년 1월이 두려운 HR에게", dur: "30초", score: 85 },
      { type: "솔루션형", title: "이 업무, 시스템이 대신하면?", dur: "30초", score: 82 },
    ],
    creators: ["직장인 공감(75%)"],
    platforms: ["인스타 릴스"],
    cta: "진단기",
    season: "10~1월",
    score: 85,
  },
  {
    id: "C4",
    cat: "C",
    emoji: "🤝",
    title: "장애인 채용, 기업 관점 블루오션",
    target: "'장애인 채용' 검색하는 기업 HR",
    signal: "'장애인 채용' 월5,110회이나 구직자 콘텐츠가 지배적",
    insight:
      "거대한 검색 시장에서 기업 관점 콘텐츠 거의 없음. 블루오션.",
    contents: [
      { type: "교육형", title: "장애인 채용, 기업 담당자를 위한 3분 정리", dur: "60초", score: 82 },
    ],
    creators: ["HR/노무(95%)"],
    platforms: ["유튜브 쇼츠", "네이버 클립"],
    cta: "진단기",
    score: 82,
  },
  {
    id: "C5",
    cat: "C",
    emoji: "💼",
    title: "비용 최적화 HR 트렌드",
    target: "인건비·운영비 절감 고민 CFO/HR",
    signal: "부담금 연 수억인 기업에 '비용 제로화' 프레임",
    insight:
      "'장애인 고용'이 아닌 '비용 최적화' 맥락에서 접근하면 CFO 직접 어필.",
    contents: [
      { type: "인사이트형", title: "HR 비용 줄이는 법: 아무도 안 알려주는 한 가지", dur: "30초", score: 80 },
    ],
    creators: ["경영/비즈(88%)"],
    platforms: ["링크드인", "유튜브 쇼츠"],
    cta: "진단기",
    score: 80,
  },
  {
    id: "C6",
    cat: "C",
    emoji: "🌱",
    title: "착한 기업 이미지 만들기",
    target: "CSR·브랜딩 관심 마케팅/경영진",
    signal: "ESG + 사회공헌 + 장애 예술인 프로그램(브이아트갤러리)",
    insight:
      "장애인 고용을 '의무'가 아닌 '브랜드 자산'으로 리프레이밍. 브이아트갤러리 사례 활용.",
    contents: [
      { type: "다큐형", title: "이 회사가 장애인 고용 후 달라진 것들", dur: "60초", score: 78 },
      { type: "아트형", title: "장애 예술인이 만든 기업 굿즈 이야기", dur: "45초", score: 75 },
    ],
    creators: ["장애인 당사자(82%)", "경영/비즈(88%)"],
    platforms: ["유튜브", "인스타 릴스"],
    cta: "상담",
    score: 78,
  },
];

// CTA 메타 (스펙: "진단기" / "상담" 두 종류)
export const CTA_META = {
  진단기: {
    label: "AI 진단기로 이동",
    emoji: "🔍",
    description: "우리 회사 고용부담금 즉시 계산",
    view: "diagnose",
  },
  상담: {
    label: "브이드림 무료 상담 신청",
    emoji: "💬",
    description: "450+ 기업이 선택한 장애인 고용 파트너",
    href: "https://www.vdream.co.kr/inquiry",
  },
};

// 헬퍼
export function byCategory(catKey) {
  return OPPORTUNITIES.filter((o) => o.cat === catKey);
}

export function findOpportunity(id) {
  return OPPORTUNITIES.find((o) => o.id === id);
}

export function findCategory(key) {
  return CATEGORIES.find((c) => c.key === key);
}

/**
 * "HR/노무 전문(95%)" → { name: "HR/노무 전문", fit: 95 }
 */
export function parseCreator(s) {
  const m = String(s).match(/^(.+?)\((\d+)%\)\s*$/);
  return m
    ? { name: m[1].trim(), fit: parseInt(m[2], 10) }
    : { name: String(s), fit: 0 };
}
