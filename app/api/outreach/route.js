// POST /api/outreach
// 기업 + 채널 + 톤으로 콜드 아웃바운드 메시지 생성
// Request:  { company, channel: "email"|"linkedin"|"kakao", tone: "formal"|"casual"|"urgent", saving }
// Response: { subject?, greeting, hook, body, cta, closing, ps? }

import { formatWon } from "@/lib/calculate";

export const runtime = "nodejs";

const CHANNEL_LABEL = {
  email: "콜드 이메일",
  linkedin: "링크드인 InMail/DM",
  kakao: "카카오톡 비즈 메시지",
};

const TONE_LABEL = {
  formal: "전문적이고 공손한 포멀",
  casual: "친근하고 간결한 캐주얼",
  urgent: "긴급성·희소성을 강조하는 어반",
};

const FALLBACK = (c, channel, tone, saving) => {
  const needsSubject = channel === "email";
  const saveText = saving ? formatWon(saving) : "상당 금액";
  const base = {
    greeting: channel === "kakao" ? "안녕하세요 담당자님," : `${c.name} 담당자님 안녕하세요.`,
    hook:
      tone === "urgent"
        ? `${c.name}은 올해 약 ${formatWon(c.estimatedPenalty)}의 고용부담금이 발생할 수 있습니다.`
        : tone === "casual"
        ? `${c.industry} 기업 중 ${c.name}에 꼭 맞는 장애인 채용 방법이 있어서 연락드렸습니다.`
        : `${c.name}의 의무고용률 달성 방안에 대해 간단히 공유드리고자 연락드렸습니다.`,
    body:
      `상시근로자 ${c.employees}명 기준 의무고용은 ${c.mandatoryCount}명이지만 현재 유효 ${c.effectiveCount}명으로 ${c.deficit}명이 부족합니다. ` +
      `브이드림의 재택근무 기반 장애인 매칭 서비스로 2~4주 내 도입이 가능하며, 연간 약 ${saveText}을 절감할 수 있습니다.`,
    cta:
      tone === "urgent"
        ? `이번 주 내 30분 통화 가능하신지 회신 부탁드립니다.`
        : `편하신 시간에 30분 무료 상담으로 맞춤 시나리오를 보여드리겠습니다.`,
    closing: channel === "kakao" ? "감사합니다 🙏" : "감사합니다.\n브이드림 세일즈 드림",
    ps:
      tone === "casual"
        ? `P.S. 부담금 대비 채용비용이 얼마나 더 적은지 간단 리포트도 함께 보내드립니다.`
        : "",
  };
  if (needsSubject) {
    base.subject =
      tone === "urgent"
        ? `[긴급] ${c.name} — 연간 ${formatWon(c.estimatedPenalty)} 부담금 해결 제안`
        : tone === "casual"
        ? `${c.name}에 맞는 장애인 채용, 30분이면 설명드릴 수 있어요`
        : `${c.name} 의무고용률 달성 방안 제안 — 브이드림`;
  }
  return base;
};

function buildPrompt(c, channel, tone, saving) {
  const saveText = saving ? formatWon(saving) : "상당 금액";
  const schema = channel === "email"
    ? `{
  "subject": "이메일 제목",
  "greeting": "인사말",
  "hook": "첫 문장 (관심을 끄는 사실 또는 질문)",
  "body": "본문 3~4문장",
  "cta": "행동 유도 1문장",
  "closing": "마무리",
  "ps": "P.S. 한 줄 (선택, 비워도 됨)"
}`
    : `{
  "greeting": "인사말",
  "hook": "첫 문장",
  "body": "본문 3~4문장",
  "cta": "행동 유도 1문장",
  "closing": "마무리",
  "ps": "P.S. 한 줄 (선택, 비워도 됨)"
}`;

  return `당신은 브이드림(장애인 재택근무 SaaS 1위)의 세일즈 담당자입니다. ${CHANNEL_LABEL[channel] || channel} 메시지를 작성하세요.

[타겟 기업]
- 기업명: ${c.name} (${c.industry}, ${c.region})
- 상시근로자: ${c.employees}명 / 의무고용 ${c.mandatoryCount}명 / 유효 ${c.effectiveCount}명 / 부족 ${c.deficit}명
- 예상 연간 부담금: ${formatWon(c.estimatedPenalty)}
- 브이드림 도입 시 예상 절감액: ${saveText}

[메시지 요구사항]
- 채널: ${CHANNEL_LABEL[channel]}
- 톤: ${TONE_LABEL[tone] || "전문적이되 친근하게"}
- 광고 느낌 배제, 상대방이 "이 정보가 유용하다"고 느끼게
- 한국어, ${channel === "kakao" ? "간결(카톡 문법)" : "정중"}
${channel === "linkedin" ? "- 링크드인 InMail 답신을 유도하는 명확한 Ask 포함\n" : ""}${channel === "kakao" ? "- 카톡 비즈 메시지답게 1~2줄 인사 + 핵심 + CTA. 줄바꿈 활용.\n" : ""}
JSON만 응답하세요 (백틱·마크다운 금지):
${schema}`;
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

  const { company, channel = "email", tone = "formal", saving } = body || {};
  if (!company || !company.id) {
    return Response.json({ error: "company required" }, { status: 400 });
  }

  if (!["email", "linkedin", "kakao"].includes(channel)) {
    return Response.json({ error: "invalid channel" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      ...FALLBACK(company, channel, tone, saving),
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
        max_tokens: 1200,
        messages: [
          { role: "user", content: buildPrompt(company, channel, tone, saving) },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        ...FALLBACK(company, channel, tone, saving),
        fallback: true,
        reason: `upstream ${res.status}: ${errText.slice(0, 200)}`,
      });
    }

    const data = await res.json();
    const text = (data.content || [])
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = parseJson(text);

    if (!parsed.body) {
      return Response.json({
        ...FALLBACK(company, channel, tone, saving),
        fallback: true,
        reason: "empty body",
      });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({
      ...FALLBACK(company, channel, tone, saving),
      fallback: true,
      reason: err.message || "unknown error",
    });
  }
}
