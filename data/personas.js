// TAB 2 (숏폼 콘텐츠 전략) — 3개 타겟 페르소나

export const PERSONAS = [
  {
    emoji: "👔",
    label: "HR 담당자",
    age: "30~45세",
    pain: "부담금 신고·채용방법 모름",
    platform: "쇼츠/릴스/링크드인",
    hook: "비용절감+실무편의",
    desc:
      "100인 이상 기업 인사담당. 매년 1월 부담금 신고를 직접 처리하며 장애인 채용 의무는 알지만 방법을 모르는 실무자.",
    contents: [
      {
        type: "충격형",
        title: "당신 회사가 매년 버리는 돈",
        desc: "부담금 시뮬레이션 30초 숫자 충격",
        score: 95,
      },
      {
        type: "시즌형",
        title: "1월 신고 전 체크리스트",
        desc: "10~12월 긴급성 콘텐츠",
        score: 92,
      },
      {
        type: "사례형",
        title: "이 회사는 연 2억 아꼈습니다",
        desc: "도입 기업 Before/After",
        score: 88,
      },
      {
        type: "교육형",
        title: "3분 고용부담금 완전정복",
        desc: "카드뉴스 스타일 제도 정리",
        score: 80,
      },
    ],
  },
  {
    emoji: "📊",
    label: "CFO/경영진",
    age: "40~55세",
    pain: "비용최적화·ESG압박",
    platform: "쇼츠/링크드인/네이버클립",
    hook: "ROI+ESG",
    desc:
      "비용 구조를 관리하는 의사결정자. HR의 장애인 채용 품의를 최종 승인하는 사람.",
    contents: [
      {
        type: "뉴스형",
        title: "고용부담금 인상 임박",
        desc: "제도 변화 속보 형태",
        score: 93,
      },
      {
        type: "데이터형",
        title: "부담금 vs 채용비용 비교표",
        desc: "ROI 인포그래픽 숏폼",
        score: 90,
      },
      {
        type: "트렌드형",
        title: "ESG 평가 속 장애인 고용 비중",
        desc: "ESG 등급과 고용률 상관관계",
        score: 85,
      },
    ],
  },
  {
    emoji: "🏢",
    label: "CEO/대표",
    age: "35~55세",
    pain: "기업이미지·명단공표 리스크",
    platform: "유튜브/링크드인/네이버",
    hook: "리스크관리+사회적가치",
    desc:
      "경영 전반 최종 의사결정자. 불이행 기업 명단 공표를 가장 민감하게 받아들이는 포지션.",
    contents: [
      {
        type: "위기형",
        title: "당신 회사, 명단 공표 대상?",
        desc: "불이행 명단 공표의 실제 영향",
        score: 96,
      },
      {
        type: "인터뷰형",
        title: "도입 CEO의 실제 경험",
        desc: "고객사 대표 인터뷰 클립",
        score: 87,
      },
      {
        type: "비전형",
        title: "장애인 고용이 기업가치를 높이는 이유",
        desc: "글로벌 ESG 트렌드 연결",
        score: 78,
      },
    ],
  },
];
