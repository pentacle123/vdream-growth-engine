// 크로스채널 전략 — DA 퍼포먼스 랩 서브탭 5
// 채널별 디폴트 예산 비율 + 추정 성과 계수

export const AD_CHANNELS = [
  {
    key: "naver_search",
    name: "네이버 검색광고",
    icon: "🔍",
    color: "#03C75A",
    budget: 40,
    role: "검색 의도 높은 B2B 타겟 직접 캡처",
    target: "장애인고용부담금 검색자",
    landing: "진단기",
    kpi: "CPA, 상담전환율",
    status: "운영중",
    statusColor: "#1D85EB",
    issue: "전환율 0% — 카피·랜딩 개선 필요",
    cpc: 8000,
    ctr: 0.4,
    leadConv: 0.05,
  },
  {
    key: "meta_da",
    name: "메타 DA (FB/IG)",
    icon: "📱",
    color: "#0866FF",
    budget: 25,
    role: "리타겟팅 + HR 직무 타겟",
    target: "홈페이지 방문자 리타겟 / HR직무 관심자",
    landing: "사례형 랜딩",
    kpi: "CTR, 리드수",
    status: "미운영",
    statusColor: "#F59E0B",
    issue: "신규 개설 필요",
    cpc: 1500,
    ctr: 1.2,
    leadConv: 0.03,
  },
  {
    key: "linkedin",
    name: "링크드인",
    icon: "💼",
    color: "#0A66C2",
    budget: 15,
    role: "HR/경영진 직무 정밀 타겟",
    target: "HR Manager, CFO, CEO 직무",
    landing: "제안서형 랜딩",
    kpi: "리드품질, 상담전환",
    status: "미운영",
    statusColor: "#F59E0B",
    issue: "CPC 높지만 B2B 타겟 정밀도 최고",
    cpc: 12000,
    ctr: 0.5,
    leadConv: 0.06,
  },
  {
    key: "remember",
    name: "리멤버",
    icon: "📇",
    color: "#FF6F3C",
    budget: 10,
    role: "HR 네트워크 타겟",
    target: "인사/총무 담당자",
    landing: "진단기",
    kpi: "앱설치, 상담전환",
    status: "기집행",
    statusColor: "#A78BFA",
    issue: "기존 배너 결과 분석 반영 필요",
    cpc: 3500,
    ctr: 0.8,
    leadConv: 0.04,
  },
  {
    key: "youtube",
    name: "유튜브 쇼츠",
    icon: "▶️",
    color: "#FF0000",
    budget: 10,
    role: "인지도 + 숏폼 콘텐츠",
    target: "HR/경영 관심자",
    landing: "유튜브→홈페이지",
    kpi: "조회수, 채널구독",
    status: "미운영",
    statusColor: "#F59E0B",
    issue: "숏폼 콘텐츠 제작 후 광고 집행",
    cpc: 200,
    ctr: 1.5,
    leadConv: 0.005,
  },
];

/**
 * 채널 + 예산 비율 → 예상 성과 계산
 * @param {Object} ch - 채널 정보 (cpc, ctr, leadConv)
 * @param {number} totalBudget - 월 총 예산 (원)
 * @param {number} pct - 채널 예산 비율 (0~100)
 */
export function projectChannel(ch, totalBudget, pct) {
  const channelBudget = totalBudget * (pct / 100);
  const clicks = ch.cpc > 0 ? Math.round(channelBudget / ch.cpc) : 0;
  const impressions = ch.ctr > 0 ? Math.round(clicks / (ch.ctr / 100)) : 0;
  const leads = Math.round(clicks * ch.leadConv);
  return { channelBudget, impressions, clicks, leads };
}
