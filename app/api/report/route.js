// POST /api/report
// 진단 결과를 경영진 보고용 요약으로 변환.
// Request:  { industry, result } // result = diagnose() return value
// Response: { summary, risk, recommendation, timeline }

import { formatWon } from "@/lib/calculate";

export const runtime = "nodejs";

const FALLBACK_TEMPLATE = (industry, r) => ({
  summary: `${industry} 업종 상시근로자 ${r.employees}명 기준 의무고용률 3.1% 대비 실고용률 ${r.effectiveRate}%. 연간 ${formatWon(r.annualPenalty)} 고용부담금이 발생하며, 브이드림 도입 시 중증 ${r.hireNeeded}명 채용으로 연간 ${formatWon(r.totalBenefit)} 이익이 가능합니다.`,
  risk:
    "고용부담금 인상 논의가 지속되고 있으며, 미이행 기업은 명단 공표 대상이 되어 기업 이미지에 직접적 타격을 입을 수 있습니다. ESG 평가에서도 장애인 고용률은 주요 지표로 활용됩니다.",
  recommendation:
    "브이드림 플립(Flipped) 재택근무 시스템 도입을 권고드립니다. 편의시설 투자 없이 2~4주 내 도입이 가능하며, 30만명+ 인재풀에서 업종 맞춤 매칭이 이뤄집니다.",
  timeline:
    "10~11월 상담·매칭 → 12월 온보딩 → 1월 부담금 신고에 즉시 반영 가능한 일정이 가장 안정적입니다.",
});

function buildPrompt(industry, r) {
  return `당신은 장애인 고용 전문 컨설턴트입니다. 다음 진단 결과를 바탕으로 경영진 보고용 요약을 작성하세요.

기업 정보:
- 업종: ${industry}
- 상시 근로자: ${r.employees}명
- 의무 고용 인원: ${r.mandatoryCount}명
- 유효 고용 인원: ${r.effectiveCount}명 (실고용률 ${r.effectiveRate}%)
- 부족 인원: ${r.shortage}명
- 현재 연간 부담금: ${formatWon(r.annualPenalty)}
- 도입 시 연간 절감: ${formatWon(r.annualSaving)}
- 장려금: ${formatWon(r.annualIncentive)}
- 총 연간 이익: ${formatWon(r.totalBenefit)}

JSON만 응답하세요 (백틱이나 마크다운 없이, 설명 없이 JSON만):
{
  "summary": "핵심 요약 3~4문장",
  "risk": "미이행 리스크 2~3문장",
  "recommendation": "도입 권고 2~3문장",
  "timeline": "추천 일정 1~2문장"
}`;
}

function parseJson(text) {
  const clean = String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  return JSON.parse(clean);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { industry = "기타", result } = body || {};
  if (!result || typeof result !== "object") {
    return Response.json({ error: "result required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ ...FALLBACK_TEMPLATE(industry, result), fallback: true, reason: "ANTHROPIC_API_KEY missing" });
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
        max_tokens: 1000,
        messages: [{ role: "user", content: buildPrompt(industry, result) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ ...FALLBACK_TEMPLATE(industry, result), fallback: true, reason: `upstream ${res.status}: ${errText.slice(0, 200)}` });
    }

    const data = await res.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    const parsed = parseJson(text);

    if (!parsed.summary) {
      return Response.json({ ...FALLBACK_TEMPLATE(industry, result), fallback: true, reason: "empty summary" });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ ...FALLBACK_TEMPLATE(industry, result), fallback: true, reason: err.message || "unknown error" });
  }
}
