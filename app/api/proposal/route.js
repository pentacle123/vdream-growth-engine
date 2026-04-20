// POST /api/proposal
// 기업 맞춤 1페이지 제안서 생성 (Claude API)
// Request:  { company, roi }
// Response: { headline, problem, solution, roi:{...}, implementation, socialProof, cta }

import { formatWon } from "@/lib/calculate";

export const runtime = "nodejs";

const FALLBACK = (c, roi) => ({
  headline: `${c.name}, 연간 ${formatWon(c.estimatedPenalty)} 고용부담금을 0으로 만들 수 있습니다`,
  problem: `${c.name}은(는) 상시근로자 ${c.employees}명 기준 의무고용 ${c.mandatoryCount}명 중 유효 ${c.effectiveCount}명만 고용하고 있어 ${c.deficit}명이 부족합니다. 현재 연간 ${formatWon(c.estimatedPenalty)}의 고용부담금이 발생하며, 매년 명단 공표 리스크와 ESG 평가 하락이 누적되고 있습니다.`,
  solution: `브이드림은 30만명+ 장애인 인재풀 중 ${c.industry} 업종에 적합한 재택근무 인력을 2~4주 내 매칭합니다. 플립(Flipped) 시스템으로 근태·급여·증빙을 한 화면에서 관리하며, 편의시설 투자 없이 즉시 도입 가능합니다. 중증 ${roi.hireNeeded}명 채용으로 의무고용률을 달성하고 장려금 수령까지 가능합니다.`,
  roi: {
    currentPenalty: formatWon(roi.annualPenalty),
    afterVdream: formatWon(roi.annualHireCost),
    annualSaving: formatWon(roi.annualSaving),
    additionalIncentive: "초과고용 시 연간 장려금 추가 수령 가능",
  },
  implementation: `상담·계약 후 2~4주 내 매칭·온보딩 완료. 별도 편의시설 공사나 법인 설립 없이, 기존 HR 시스템과 병행 운영.`,
  socialProof: `브이드림은 450+ 기업, 누적 24,000명 채용, 법적·노무 분쟁률 0%를 달성한 장애인 재택근무 SaaS 1위 기업입니다. 신한라이프·현대산업개발·홈플러스 등이 고객사입니다.`,
  cta: `30분 무료 상담으로 ${c.name} 맞춤 도입 시나리오를 확인하세요.`,
});

function buildPrompt(c, roi) {
  return `당신은 브이드림(장애인 재택근무 SaaS 1위)의 B2B 세일즈 컨설턴트입니다.
다음 기업에 보낼 1페이지 맞춤 제안서를 작성해주세요.

[기업 정보]
- 기업명: ${c.name}
- 업종: ${c.industry}
- 소재지: ${c.region}
- 상시근로자: ${c.employees}명
- 의무고용인원: ${c.mandatoryCount}명
- 현재 고용: ${c.actualCount}명 (유효 ${c.effectiveCount}명)
- 부족인원: ${c.deficit}명
- 예상 연간 부담금: ${formatWon(c.estimatedPenalty)}

[도입 시 ROI]
- 현재 부담금: ${formatWon(roi.annualPenalty)}
- 브이드림 도입 후 비용: ${formatWon(roi.annualHireCost)} (중증 ${roi.hireNeeded}명 채용)
- 연간 절감액: ${formatWon(roi.annualSaving)}

[브이드림 USP]
- 450+ 기업, 24,000명 채용, 분쟁률 0%
- 재택근무 기반 → 편의시설 투자 불필요
- 2~4주 내 도입, 플립 시스템 통합 관리
- 누적 절감 8,300억원+, 30만명 인재풀

JSON만 응답하세요 (백틱·마크다운 금지):
{
  "headline": "제안서 헤드라인 1줄 (${c.name} 포함, 임팩트 있게)",
  "problem": "현재 상황 분석 2~3문장 (구체 숫자 포함)",
  "solution": "브이드림 도입 시 해결 방안 3~4문장",
  "roi": {
    "currentPenalty": "현재 부담금 표현",
    "afterVdream": "도입 후 예상 비용 표현",
    "annualSaving": "연간 절감액 표현",
    "additionalIncentive": "장려금 수령 가능액 설명"
  },
  "implementation": "도입 프로세스 요약 2문장 (2~4주 도입, 편의시설 불필요 등)",
  "socialProof": "신뢰 근거 1~2문장 (450+사, 24000명, 0% 분쟁률 등)",
  "cta": "다음 단계 제안 1문장"
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

  const { company, roi } = body || {};
  if (!company || !company.id || !roi) {
    return Response.json({ error: "company and roi required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      ...FALLBACK(company, roi),
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
        max_tokens: 1600,
        messages: [{ role: "user", content: buildPrompt(company, roi) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        ...FALLBACK(company, roi),
        fallback: true,
        reason: `upstream ${res.status}: ${errText.slice(0, 200)}`,
      });
    }

    const data = await res.json();
    const text = (data.content || [])
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = parseJson(text);

    if (!parsed.headline) {
      return Response.json({
        ...FALLBACK(company, roi),
        fallback: true,
        reason: "empty headline",
      });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({
      ...FALLBACK(company, roi),
      fallback: true,
      reason: err.message || "unknown error",
    });
  }
}
