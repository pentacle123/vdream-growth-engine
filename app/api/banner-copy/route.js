// POST /api/banner-copy
// 배너 템플릿별 카피 JSON 생성
// Request:  { keyword, usps[], tone, template: "number"|"compare"|"urgent"|"trust"|"question", size?: {w, h, layout} }
// Response: 템플릿별 props

import { COPY_AND_DESIGN_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const FALLBACKS = {
  number: {
    bigNumber: "3억 2천만원",
    headline: "매년 버리고 계신가요?",
    cta: "무료 진단",
  },
  compare: {
    before: "3.2억",
    after: "0.8억",
    saving: "연 2.4억 절감",
    cta: "지금 확인",
  },
  urgent: {
    alert: "⚠️ 부담금 인상 임박",
    headline: "지금 대비하지 않으면\n내년 부담금이 2배",
    cta: "무료 진단",
  },
  trust: {
    badge: "450+ 기업 선택",
    headline: "장애인 고용 솔루션",
    proofs: ["분쟁 0건", "2주 도입", "절감 80%"],
    cta: "상담 신청",
  },
  question: {
    question: "장애인 채용,\n아직도 어렵다고\n생각하시나요?",
    cta: "2주면 끝",
  },
};

function schemaPrompt(template) {
  switch (template) {
    case "number":
      return `JSON (number 템플릿):
{
  "bigNumber": "임팩트 거대 숫자 (예: '3억 2천만원' — 5~10자)",
  "headline": "헤드라인 (15자 이내, 질문형)",
  "cta": "CTA (8자 이내, 동사형)"
}`;
    case "compare":
      return `JSON (compare 템플릿):
{
  "before": "현재 부담금 (3~6자, '3.2억' 같은 형태)",
  "after": "도입 후 비용 (3~6자)",
  "saving": "절감액 강조 (10자 이내, '연 2.4억 절감' 같은 형태)",
  "cta": "CTA (8자 이내)"
}`;
    case "urgent":
      return `JSON (urgent 템플릿):
{
  "alert": "경고 뱃지 (15자 이내, ⚠️ 이모지 포함)",
  "headline": "긴급 헤드라인 (개행 \\n 1~2개로 2~3줄, 각 15자 이내)",
  "cta": "CTA (8자 이내)"
}`;
    case "trust":
      return `JSON (trust 템플릿):
{
  "badge": "신뢰 뱃지 (15자 이내, '○○+ 기업 선택' 형태)",
  "headline": "헤드라인 (15자 이내)",
  "proofs": ["proof1 (8자 이내)", "proof2 (8자 이내)", "proof3 (8자 이내)"],
  "cta": "CTA (8자 이내)"
}`;
    case "question":
      return `JSON (question 템플릿):
{
  "question": "큰 질문 (개행 \\n 2개로 3줄, 각 12자 이내)",
  "cta": "CTA (8자 이내, 답변형)"
}`;
    default:
      return "";
  }
}

function buildPrompt({ keyword, usps, tone, template, size }) {
  const sizeNote = size
    ? `\n- 사이즈: ${size.w}×${size.h}px (${size.layout || "horizontal"})`
    : "";
  return `브이드림 B2B 배너 카피를 생성하세요. 시스템 프롬프트의 카피 원칙을 엄격히 따르세요. 배너는 작은 공간이라 글자수 제한이 매우 중요합니다.

[입력]
- 키워드: ${keyword}
- 강조 USP: ${(usps || []).join(", ") || "자유 선택"}
- 톤: ${tone || "정보형"}
- 템플릿: ${template}${sizeNote}

${schemaPrompt(template)}

응답은 한국어 JSON만. 백틱·마크다운 금지. 글자수 제한 엄수.`;
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

  const { template = "number" } = body || {};
  if (!body.keyword) {
    return Response.json({ error: "keyword required" }, { status: 400 });
  }
  if (!FALLBACKS[template]) {
    return Response.json({ error: "invalid template" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      ...FALLBACKS[template],
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
        max_tokens: 1000,
        system: COPY_AND_DESIGN_SYSTEM,
        messages: [{ role: "user", content: buildPrompt(body) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        ...FALLBACKS[template],
        fallback: true,
        reason: `upstream ${res.status}: ${errText.slice(0, 200)}`,
      });
    }

    const data = await res.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    const parsed = parseJson(text);

    if (!parsed.cta) {
      return Response.json({
        ...FALLBACKS[template],
        fallback: true,
        reason: "missing cta",
      });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({
      ...FALLBACKS[template],
      fallback: true,
      reason: err.message || "unknown",
    });
  }
}
