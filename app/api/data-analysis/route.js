// POST /api/data-analysis
// 새 업로드 데이터 + 이전 데이터 비교 → AI 분석
// Request:  { dataType, previous: { summary }, current: { summary }, periodLabel? }
// Response: { periodComparison, improvements[], declines[], keyInsights[], actionItems[], budgetRecommendation }

import { COPY_EXPERT_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const FALLBACK = (req) => {
  const cur = req.current?.summary || {};
  const prev = req.previous?.summary || {};
  const impDelta = (cur.imp || 0) - (prev.imp || 0);
  const clickDelta = (cur.click || 0) - (prev.click || 0);
  const costDelta = (cur.cost || 0) - (prev.cost || 0);
  return {
    periodComparison: `${req.dataType || "업로드 데이터"} 기준, 노출 ${impDelta >= 0 ? "+" : ""}${impDelta.toLocaleString("ko-KR")} / 클릭 ${clickDelta >= 0 ? "+" : ""}${clickDelta.toLocaleString("ko-KR")} / 비용 ${costDelta >= 0 ? "+" : ""}${Math.round(costDelta / 10000).toLocaleString("ko-KR")}만원의 변화. 전환은 여전히 ${cur.conv || 0}건.`,
    improvements: [
      "데이터 누적으로 추세 분석 가능해짐",
      clickDelta > 0 ? "클릭 수 증가 — 카피 또는 노출 매체 효과" : "기간별 키워드 구성 안정화",
    ],
    declines: [
      cur.conv === 0 ? "전환 0건 지속 — 랜딩·CTA 점검 필요" : "전환율 변동성 확인 필요",
      costDelta > 0 ? "광고비 증가 대비 성과 개선 미확인" : "비용 안정세 유지",
    ],
    keyInsights: [
      "데이터 비교 기반 의사결정 인프라 확보",
      "B2B 검색광고 특성상 전환 측정 셋업이 핵심",
      "키워드 그룹별 효율 차이를 매월 추적해야 함",
    ],
    actionItems: [
      "GA4 + 네이버 전환 스크립트로 진단기 완료 이벤트 측정",
      "B2B 키워드와 B2C 키워드 캠페인 분리",
      "최저 CPC 키워드 비중 30% 이상으로 재배분",
    ],
    budgetRecommendation:
      "전환 측정이 셋업되기 전까지 신규 키워드는 소액(전체 5%) 테스트로 운영. 측정 데이터 확보 후 효율 키워드에 집중 투하.",
  };
};

function buildPrompt({ dataType, previous, current, periodLabel }) {
  const fmt = (o) => JSON.stringify(o || {}, null, 2).slice(0, 1500);
  return `당신은 한국 B2B 디지털 광고 퍼포먼스 분석 전문가입니다. 새 업로드 데이터와 이전 데이터를 비교 분석하세요.

[메타]
- 데이터 유형: ${dataType || "캠페인 데이터"}
- 기간 라벨: ${periodLabel || "비교 기간"}

[이전 데이터 요약]
${fmt(previous?.summary)}

[새로 업로드된 데이터 요약]
${fmt(current?.summary)}

[브이드림 컨텍스트]
- B2B 장애인 재택근무 SaaS, HR 담당자/CFO/CEO 타겟
- 핵심 KPI: 진단기 완료 → 리드 → 상담 → 계약 전환
- 1월 신고 시즌이 피크 (검색량 15배)

JSON만 응답 (백틱·마크다운 금지):
{
  "periodComparison": "기간 대비 핵심 변화 요약 3문장 (구체 숫자 포함)",
  "improvements": ["개선된 점 1", "개선된 점 2", "개선된 점 3"],
  "declines": ["악화된 점 1", "악화된 점 2"],
  "keyInsights": ["핵심 인사이트 1", "인사이트 2", "인사이트 3"],
  "actionItems": ["즉시 액션 1", "즉시 액션 2", "즉시 액션 3"],
  "budgetRecommendation": "예산 재배분 제안 1~2문장"
}`;
}

function parseJson(text) {
  const clean = String(text || "").replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(clean);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!body.current) {
    return Response.json({ error: "current data required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      ...FALLBACK(body),
      fallback: true,
      reason: "ANTHROPIC_API_KEY missing",
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1800,
        system: COPY_EXPERT_SYSTEM,
        messages: [{ role: "user", content: buildPrompt(body) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        ...FALLBACK(body),
        fallback: true,
        reason: `upstream ${res.status}: ${errText.slice(0, 200)}`,
      });
    }

    const data = await res.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    const parsed = parseJson(text);

    if (!parsed.periodComparison) {
      return Response.json({
        ...FALLBACK(body),
        fallback: true,
        reason: "missing periodComparison",
      });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({
      ...FALLBACK(body),
      fallback: true,
      reason: err.message || "unknown",
    });
  }
}
