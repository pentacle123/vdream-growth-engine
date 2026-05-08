// POST /api/faq
// 사용자 질문 → Claude → 브이드림 전문 상담원 답변
// Request:  { question, context? } — context는 선택 (진단 결과 등)
// Response: { answer, suggestions[]?, fallback? }

import { COPY_EXPERT_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const FALLBACK = (q) => ({
  answer:
    "구체적인 답변을 드리기 위해서는 무료 상담을 추천드립니다. 브이드림은 450+ 기업 고객사에서 평균 2~4주 내 도입을 완료한 트랙레코드를 보유하고 있으며, 분쟁률 0%로 안전한 장애인 채용을 보장합니다. 더 자세한 안내는 1644-8619 또는 vdream.co.kr/inquiry로 연락 주세요.",
  suggestions: [
    "도입 비용은 어떻게 산정되나요?",
    "우리 업종에 맞는 직무는 어떤 게 있나요?",
    "도입 후 관리는 어떻게 이루어지나요?",
  ],
});

function buildPrompt(question, context) {
  const ctx = context
    ? `\n[진단 컨텍스트]\n- 업종: ${context.industry || "-"}\n- 상시근로자: ${context.employees || "-"}명\n- 부족인원: ${context.shortage || "-"}명\n- 예상 부담금: ${context.annualPenalty ? Math.round(context.annualPenalty / 1e8) + "억원" : "-"}\n`
    : "";

  return `당신은 브이드림(장애인 재택근무 인사관리 SaaS, 국내 시장 점유율 1위)의 B2B 전문 상담원입니다. 기업 담당자의 질문에 정확하고 친절하게 답변하세요.

[브이드림 핵심 정보]
- 회사: (주)브이드림, 대표 김민지, 설립 2018년
- 핵심 제품: 플립(Flipped) — 장애인 특화 재택근무 인사관리 플랫폼
- 누적 고객사: 450+ (신한라이프, 현대산업개발, 홈플러스, 차병원그룹 등)
- 누적 채용: 24,000명+
- 장애인 인재풀: 30만명+
- 누적 고용부담금 절감: 8,300억원+
- 법적·노무 분쟁률: 0%
- 도입 기간: 평균 2~4주 (편의시설 투자 불필요)
- 중증장애인 더블카운트 적용 (중증 1명 = 2명 인정)
- 부담금 대비 40~80% 비용으로 도입 가능
- 가능 직무: 데이터 라벨링, 문서관리, 온라인 모니터링, CS 채팅상담, 디자인 보조, 리뷰 분석 등
- 홈페이지: vdream.co.kr / 상담: vdream.co.kr/inquiry / 전화: 1644-8619

[질문]
${question}${ctx}

[답변 가이드라인]
- 한국어, 존댓말
- 3~5문장으로 명확하게
- 가능한 경우 구체적 숫자 포함
- 광고 느낌 없이 진정성 있게
- 답변 후 관련 후속 질문 2~3개 제안

JSON만 응답 (백틱·마크다운 금지):
{
  "answer": "전문 답변 3~5문장",
  "suggestions": ["후속 질문1","후속 질문2","후속 질문3"]
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

  const { question, context } = body || {};
  if (!question || typeof question !== "string") {
    return Response.json({ error: "question required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      ...FALLBACK(question),
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
        system: COPY_EXPERT_SYSTEM,
        messages: [{ role: "user", content: buildPrompt(question, context) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        ...FALLBACK(question),
        fallback: true,
        reason: `upstream ${res.status}: ${errText.slice(0, 200)}`,
      });
    }

    const data = await res.json();
    const text = (data.content || [])
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = parseJson(text);

    if (!parsed.answer) {
      return Response.json({
        ...FALLBACK(question),
        fallback: true,
        reason: "empty answer",
      });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({
      ...FALLBACK(question),
      fallback: true,
      reason: err.message || "unknown",
    });
  }
}
