// POST /api/script
// 기회 + 콘텐츠 아이디어를 받아 Claude API로 숏폼 스크립트를 생성
// Request:  { opportunity, content? } — opportunity는 필수, content는 선택 (특정 콘텐츠 아이디어)
// Response: { hook, problem, solution, proof, cta, caption, hashtags[], thumbnail }

export const runtime = "nodejs";

const FALLBACK_TEMPLATE = (opp, content) => {
  const ctaText = (opp.ctas || []).includes("consult")
    ? "지금 브이드림 무료 상담 신청하세요 → vdream.co.kr/inquiry"
    : "지금 AI 진단기로 우리 회사 부담금을 확인하세요";
  const title = content?.title || opp.title;
  return {
    hook: `${opp.emoji} "${title}" — 당신이 지금 이걸 모르면 손해입니다`,
    problem: `${opp.target}의 핵심 고민: ${opp.insight.split(".")[0]}.`,
    solution:
      "브이드림 플립(Flipped) 재택근무 시스템으로 2~4주 내 도입, 편의시설 투자 없이 해결. 30만명+ 장애인 인재풀에서 업종 맞춤 매칭.",
    proof:
      "450+ 기업, 24,000명 채용, 법적·노무 분쟁률 0%, 누적 고용부담금 절감 8,300억원.",
    cta: ctaText,
    caption: `${opp.emoji} ${title}\n\n${opp.target} 필독.\n부담금 그만 내고 채용으로 전환하세요.\n\n🔗 지금 진단받기 → vdream-growth-engine.vercel.app`,
    hashtags: [
      "#장애인고용",
      "#고용부담금",
      "#브이드림",
      "#HR담당자",
      "#재택근무",
    ],
    thumbnail: `"${title}" — 1분이면 충분합니다`,
  };
};

function buildPrompt(opp, content) {
  const contentLine = content
    ? `- 선택 콘텐츠: [${content.type}] "${content.title}" (${content.duration}) — ${content.desc}`
    : "- 선택 콘텐츠: 기회 전체를 포괄하는 대표 스크립트";

  const signalsBlock =
    Array.isArray(opp.signals) && opp.signals.length > 0
      ? `\n[검색 시그널]\n${opp.signals.map((s) => `- ${s}`).join("\n")}`
      : "";

  const ctasBlock = (opp.ctas || [])
    .map((c) => {
      if (c === "diagnose") return "AI 진단기(우리 회사 부담금 계산)";
      if (c === "consult") return "브이드림 무료 상담(vdream.co.kr/inquiry)";
      if (c === "phone") return "1644-8619 전화 상담";
      return c;
    })
    .join(", ");

  return `당신은 B2B 숏폼 콘텐츠 전략가입니다. 브이드림(장애인 재택근무 인사관리 SaaS, 국내 시장 점유율 1위)의 숏폼 스크립트를 작성하세요.

[기회 정보]
- ID: ${opp.id} ${opp.emoji} ${opp.title}
- 타겟: ${opp.target}
- 핵심 인사이트: ${opp.insight}
${contentLine}
- 추천 플랫폼: ${(opp.platforms || []).join(", ")}
- 시즌: ${opp.season || "연중 상시"}
- CTA 종류: ${ctasBlock || "진단기"}${signalsBlock}

[브이드림 핵심 USP]
- 450+ 기업 고객, 24,000명 누적 채용, 법적·노무 분쟁률 0%
- 재택근무 기반 → 편의시설·공간 투자 불필요
- 2~4주 내 도입 완료 (자회사형 대비 10배 빠름)
- 플립(Flipped) 시스템으로 근태·급여·증빙 한 화면 관리
- 누적 고용부담금 절감 8,300억원+, 30만명+ 장애인 인재풀

[톤]
- B2B이지만 숏폼 문법(후킹·리듬·즉각성) 필수
- 과장 없이 숫자로 신뢰도 확보
- 한국어, 존댓말

JSON만 응답하세요 (백틱·마크다운·설명 금지, 순수 JSON만):
{
  "hook": "첫 3초 후킹 (강한 질문 or 충격 숫자)",
  "problem": "문제 제기 5~10초 (타겟 페인 구체화)",
  "solution": "솔루션 제시 10~20초 (브이드림의 해결법)",
  "proof": "신뢰 근거 5초 (숫자·고객사·트랙레코드)",
  "cta": "CTA 한 문장 (명확한 행동 유도)",
  "caption": "인스타·유튜브 캡션 2~3줄 (이모지 포함)",
  "hashtags": ["해시태그1","해시태그2","해시태그3","해시태그4","해시태그5"],
  "thumbnail": "썸네일 텍스트 카피 한 줄"
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

  const { opportunity, content } = body || {};
  if (!opportunity || !opportunity.id) {
    return Response.json({ error: "opportunity required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      ...FALLBACK_TEMPLATE(opportunity, content),
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
        max_tokens: 1400,
        messages: [
          { role: "user", content: buildPrompt(opportunity, content) },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({
        ...FALLBACK_TEMPLATE(opportunity, content),
        fallback: true,
        reason: `upstream ${res.status}: ${errText.slice(0, 200)}`,
      });
    }

    const data = await res.json();
    const text = (data.content || [])
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = parseJson(text);

    if (!parsed.hook) {
      return Response.json({
        ...FALLBACK_TEMPLATE(opportunity, content),
        fallback: true,
        reason: "empty hook",
      });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({
      ...FALLBACK_TEMPLATE(opportunity, content),
      fallback: true,
      reason: err.message || "unknown error",
    });
  }
}
