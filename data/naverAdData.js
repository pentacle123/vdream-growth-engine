// 네이버 파워링크 운영 데이터 (하드코딩) — DA 퍼포먼스 랩 서브탭 1
// 단위: imp 노출수, click 클릭수, ctr %, cpc 원, cost 원

export const NAVER_AD_DATA = [
  {
    group: "고용부담금_PC",
    tag: "B2B",
    keywords: [
      { kw: "장애인고용부담금", imp: 5765, click: 22, ctr: 0.38, cpc: 32075, cost: 705649, conv: 0, tag: "B2B" },
      { kw: "장애인고용부담금손금", imp: 1240, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2B" },
      { kw: "장애인고용부담금기준", imp: 193, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2B" },
      { kw: "장애인고용부담금신고", imp: 92, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2B" },
      { kw: "장애인고용부담금경정청구", imp: 84, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2B" },
      { kw: "장애인고용부담금기초액", imp: 42, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2B" },
      { kw: "장애인고용부담금계산", imp: 13, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2B" },
      { kw: "고용부담금", imp: 209, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2B" },
      { kw: "고용부담금감면", imp: 5, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2B" },
    ],
  },
  {
    group: "장애인채용_PC",
    tag: "혼합",
    keywords: [
      { kw: "장애인채용", imp: 3200, click: 15, ctr: 0.47, cpc: 1200, cost: 18000, conv: 0, tag: "혼합" },
      { kw: "장애인고용", imp: 1800, click: 8, ctr: 0.44, cpc: 900, cost: 7200, conv: 0, tag: "혼합" },
      { kw: "장애인채용사이트", imp: 450, click: 3, ctr: 0.67, cpc: 800, cost: 2400, conv: 0, tag: "혼합" },
      { kw: "장애인일자리", imp: 2100, click: 12, ctr: 0.57, cpc: 350, cost: 4200, conv: 0, tag: "B2C" },
      { kw: "장애인취업", imp: 1500, click: 8, ctr: 0.53, cpc: 280, cost: 2240, conv: 0, tag: "B2C" },
    ],
  },
  {
    group: "자사명",
    tag: "브랜드",
    keywords: [
      { kw: "브이드림", imp: 2107, click: 484, ctr: 22.97, cpc: 75, cost: 36278, conv: 0, tag: "브랜드" },
      { kw: "브이드림채용", imp: 246, click: 2, ctr: 0.81, cpc: 149, cost: 297, conv: 0, tag: "혼합" },
      { kw: "브이드림장애인", imp: 35, click: 7, ctr: 20, cpc: 58, cost: 407, conv: 0, tag: "브랜드" },
      { kw: "브이드림후기", imp: 15, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "브랜드" },
    ],
  },
  {
    group: "지역_MO",
    tag: "B2C",
    keywords: [
      { kw: "서울장애인일자리", imp: 180, click: 2, ctr: 1.11, cpc: 220, cost: 440, conv: 0, tag: "B2C" },
      { kw: "경기장애인일자리", imp: 95, click: 1, ctr: 1.05, cpc: 150, cost: 150, conv: 0, tag: "B2C" },
      { kw: "부산장애인일자리", imp: 72, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2C" },
      { kw: "대구장애인일자리", imp: 45, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2C" },
      { kw: "인천장애인일자리", imp: 58, click: 1, ctr: 1.72, cpc: 77, cost: 77, conv: 0, tag: "B2C" },
      { kw: "대전장애인일자리", imp: 34, click: 0, ctr: 0, cpc: 0, cost: 0, conv: 0, tag: "B2C" },
    ],
  },
  {
    group: "판촉물_쇼핑",
    tag: "기타",
    keywords: [
      { kw: "에코백 로고", imp: 725, click: 6, ctr: 0.83, cpc: 1434, cost: 8602, conv: 0, tag: "기타" },
      { kw: "리유저블백 제작", imp: 3096, click: 22, ctr: 0.71, cpc: 1854, cost: 40777, conv: 0, tag: "기타" },
      { kw: "텀블러 판촉", imp: 3061, click: 20, ctr: 0.65, cpc: 1314, cost: 26279, conv: 0, tag: "기타" },
    ],
  },
];

export const TAG_COLOR = {
  "B2B": "#00C9A7",
  "혼합": "#1D85EB",
  "브랜드": "#A78BFA",
  "B2C": "#F59E0B",
  "기타": "#64748B",
};

export function aggregateGroups() {
  return NAVER_AD_DATA.map((g) => {
    const imp = g.keywords.reduce((a, k) => a + k.imp, 0);
    const click = g.keywords.reduce((a, k) => a + k.click, 0);
    const cost = g.keywords.reduce((a, k) => a + k.cost, 0);
    const conv = g.keywords.reduce((a, k) => a + k.conv, 0);
    return { name: g.group, tag: g.tag, imp, click, cost, conv };
  });
}

export function aggregateTotals() {
  let imp = 0, click = 0, cost = 0, conv = 0;
  NAVER_AD_DATA.forEach((g) =>
    g.keywords.forEach((k) => {
      imp += k.imp;
      click += k.click;
      cost += k.cost;
      conv += k.conv;
    })
  );
  const ctr = imp > 0 ? (click / imp) * 100 : 0;
  const avgCpc = click > 0 ? cost / click : 0;
  return { imp, click, cost, conv, ctr, avgCpc };
}

export function aggregateByTag() {
  const counts = {};
  NAVER_AD_DATA.forEach((g) =>
    g.keywords.forEach((k) => {
      counts[k.tag] = (counts[k.tag] || 0) + 1;
    })
  );
  return Object.entries(counts).map(([tag, count]) => ({
    name: tag,
    value: count,
    color: TAG_COLOR[tag] || "#64748B",
  }));
}

export function flattenKeywords() {
  const rows = [];
  NAVER_AD_DATA.forEach((g) =>
    g.keywords.forEach((k) =>
      rows.push({ ...k, group: g.group })
    )
  );
  return rows;
}
