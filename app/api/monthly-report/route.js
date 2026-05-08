// POST /api/monthly-report
// 이번 달 + 지난달 데이터 → Claude → 월간 성과 리포트
// Request:  { current, previous }
// Response: { summary, highlights[3], issues[2~3], recommendations[3], budget }

import { COPY_EXPERT_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const FALLBACK = (cur, prev) => {
  const leadDelta = cur.leads - (prev?.leads || 0);
  const contractDelta = cur.contracts - (prev?.contracts || 0);
  return {
    summary: `${cur.month} 월 성과 요약: 노출 ${cur.impressions.toLocaleString("ko-KR")}회, 리드 ${cur.leads}건, 계약 ${cur.contracts}건. 전월 대비 리드 ${leadDelta >= 0 ? "+" : ""}${leadDelta}건, 계약 ${contractDelta >= 0 ? "+" : ""}${contractDelta}건.`,
    highlights: [
      `리드 수집 ${cur.leads}건 — 진단기·캠페인이 안정적으로 작동`,
      `계약 ${cur.contracts}건 — B2B 세일즈 사이클 정상 진행`,
      `상담 신청 ${cur.consultations}건 — 진단기→상담 전환 유효`,
    ],
    issues: [
      `전월 대비 리드 변화량 ${leadDelta} — 1월 시즌 외 비수기 대응 필요`,
      `네이버 검색광고 CTR 낮음 — 카피·랜딩 개선 검토`,
    ],
    recommendations: [
      `숏폼 콘텐츠 발행 주기 주 2회 → 주 3회로 강화`,
      `링크드인 InMail 캠페인 신규 개설 검토 (HR 직무 정밀 타겟)`,
      `진단기 결과 페이지 CTA 위치·문구 A/B 테스트`,
    ],
    budget:
      "광고비 대비 CPA가 채널별로 8,000~33,000원 분포. 숏폼 오가닉 CPA가 가장 효율적 — 예산 비중 확대 권장.",
  };
};

function buildPrompt(cur, prev) {
  const fmt = (n) => Number(n).toLocaleString("ko-KR");
  const prevBlock = prev
    ? `\n[전월 ${prev.month}]\n- 노출: ${fmt(prev.impressions)} / 클릭: ${fmt(prev.clicks)} / 리드: ${prev.leads} / 상담: ${prev.consultations} / 계약: ${prev.contracts}`
    : "\n[전월 데이터 없음]";

  return `당신은 브이드림(장애인 재택근무 SaaS 1위)의 마케팅 퍼포먼스 매니저입니다. 월간 성과 리포트를 작성하세요.

[이번 달 ${cur.month}]
- 노출: ${fmt(cur.impressions)}
- 클릭: ${fmt(cur.clicks)} (CTR ${(cur.clicks / cur.impressions * 100).toFixed(2)}%)
- 리드: ${cur.leads}건
- 상담: ${cur.consultations}건 (리드→상담 ${(cur.consultations / cur.leads * 100).toFixed(1)}%)
- 계약: ${cur.contracts}건 (상담→계약 ${(cur.contracts / cur.consultations * 100).toFixed(1)}%)${prevBlock}

[브이드림 컨텍스트]
- B2B 세일즈, 1월·연말이 피크 시즌
- 핵심 채널: 네이버 검색광고, 메타 DA, 링크드인, 숏폼 오가닉
- 핵심 KPI: 리드 → 상담 전환, CPA, 계약 전환
- 진단기 + AI 모듈 5종 운영 중 (진단/리포트/스크립트/제안서/아웃바운드)

JSON만 응답 (백틱·마크다운 금지):
{
  "summary": "핵심 성과 요약 3~4문장 (구체적 숫자 + 전월 대비)",
  "highlights": ["긍정적 포인트 1","긍정적 포인트 2","긍정적 포인트 3"],
  "issues": ["개선 필요 1","개선 필요 2","개선 필요 3"],
  "recommendations": ["다음달 액션 1","다음달 액션 2","다음달 액션 3"],
  "budget": "예산 효율 코멘트 1~2문장"
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

  const { current, previous } = body || {};
  if (!current || !current.month) {
    return Response.json({ error: "current month data required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      ...FALLBACK(current, previous),
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
        max_tokens: 1500,
        system: COPY_EXPERT_SYSTEM,
        messages: [{ role: "user", content: buildPrompt(current, previous) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        ...FALLBACK(current, previous),
        fallback: true,
        reason: `upstream ${res.status}: ${errText.slice(0, 200)}`,
      });
    }

    const data = await res.json();
    const text = (data.content || [])
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = parseJson(text);

    if (!parsed.summary) {
      return Response.json({
        ...FALLBACK(current, previous),
        fallback: true,
        reason: "empty summary",
      });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({
      ...FALLBACK(current, previous),
      fallback: true,
      reason: err.message || "unknown",
    });
  }
}
