// 성과 대시보드 — 하드코딩 데이터 (DASHBOARD-LIBRARY-SPEC.md Part 1)

export const PIPELINE_STAGES = [
  { stage: "숏폼/DA 노출", count: 50000, color: "#64748B" },
  { stage: "진단기 유입", count: 2400, color: "#1D85EB" },
  { stage: "진단 완료", count: 1800, color: "#A78BFA" },
  { stage: "리드 수집 (이메일)", count: 600, color: "#F59E0B" },
  { stage: "상담 신청", count: 120, color: "#00C9A7" },
  { stage: "미팅 진행", count: 45, color: "#10B981" },
  { stage: "계약 완료", count: 18, color: "#EF4444" },
];

export const CHANNEL_PERFORMANCE = [
  { channel: "네이버 검색광고", leads: 280, cost: 5_000_000, cpa: 17857, conv: 8 },
  { channel: "메타 DA", leads: 150, cost: 3_000_000, cpa: 20000, conv: 4 },
  { channel: "링크드인", leads: 80, cost: 2_000_000, cpa: 25000, conv: 4 },
  { channel: "숏폼 오가닉", leads: 60, cost: 500_000, cpa: 8333, conv: 2 },
  { channel: "리멤버", leads: 30, cost: 1_000_000, cpa: 33333, conv: 0 },
];

export const MONTHLY_TREND = [
  { month: "2025.12", impressions: 35000, clicks: 800, leads: 80, consultations: 15, contracts: 3 },
  { month: "2026.01", impressions: 65000, clicks: 2200, leads: 320, consultations: 60, contracts: 12 },
  { month: "2026.02", impressions: 42000, clicks: 1100, leads: 150, consultations: 28, contracts: 5 },
  { month: "2026.03", impressions: 38000, clicks: 900, leads: 120, consultations: 22, contracts: 4 },
  { month: "2026.04", impressions: 30000, clicks: 750, leads: 95, consultations: 18, contracts: 3 },
  { month: "2026.05", impressions: 28000, clicks: 700, leads: 85, consultations: 15, contracts: 2 },
];

// 트렌드 차트 메트릭 메타
export const TREND_METRICS = [
  { key: "impressions", label: "노출수", color: "#64748B" },
  { key: "clicks", label: "클릭수", color: "#1D85EB" },
  { key: "leads", label: "리드", color: "#A78BFA" },
  { key: "consultations", label: "상담", color: "#F59E0B" },
  { key: "contracts", label: "계약", color: "#00C9A7" },
];
