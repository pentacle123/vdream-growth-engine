// POST /api/landing-copy
// 랜딩 템플릿별 카피 JSON 생성 (HTML이 아닌 props 데이터)
// Request:  { keyword, target, usps[], tone, template: "numberShock"|"story"|"diagnostic" }
// Response: 템플릿별 props 스키마

import { COPY_AND_DESIGN_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const FALLBACKS = {
  numberShock: {
    badge: "450+ 기업이 선택한",
    bigNumber: "3억 2천만원",
    headline: "매년 이만큼 버리고 계십니까?",
    subhead: "고용부담금의 80%를 절감한 기업들의 비밀.",
    ctaText: "30초 만에 우리 회사 절감액 확인",
    comparison: { before: "3.2억원", after: "0.8억원", saving: "2.4억원" },
    painPoints: [
      "복잡한 신고 절차에 매년 시달리고 계신가요?",
      "편의시설 비용이 부담되시나요?",
      "채용 후 관리할 인프라가 없으신가요?",
    ],
    usps: [
      { icon: "🏠", title: "재택근무 기반", desc: "편의시설 투자 0원" },
      { icon: "📋", title: "플립 시스템", desc: "채용~관리 원스톱" },
      { icon: "🛡️", title: "분쟁률 0%", desc: "450+사 무사고" },
    ],
  },
  story: {
    headline: "장애인 채용, 어디서부터 시작해야 할지 막막하셨죠?",
    subhead: "이미 450개 기업이 같은 고민을 해결했습니다. 그 경로를 그대로 따라오세요.",
    ctaText: "무료 컨설팅 신청",
    story: [
      { icon: "💸", label: "STAGE 1", title: "매년 부담금만 내고 있었습니다", desc: "○○산업개발은 매년 20억원의 고용부담금을 납부하고 있었습니다." },
      { icon: "💡", label: "STAGE 2", title: "재택근무로 해결할 수 있다는 걸", desc: "편의시설 투자가 아닌 재택근무 기반 채용으로 의무를 충족할 수 있다는 사실을 발견했습니다." },
      { icon: "🚀", label: "STAGE 3", title: "2주 만에 채용이 완료됐습니다", desc: "30만 인재풀에서 업종 맞춤 매칭. 편의시설 0원, 2~4주 도입." },
      { icon: "🏆", label: "STAGE 4", title: "연간 16억원을 절감했습니다", desc: "부담금 80% 절감. 사내 생산성도 함께 향상." },
    ],
    testimonial: { quote: "막연했던 장애인 고용이 2주 만에 끝났습니다.", name: "○○산업개발", title: "HR 본부장" },
  },
  diagnostic: {
    headline: "30초면 우리 회사 절감액을 알 수 있습니다",
    subhead: "기업 정보 두 줄만 입력하면 AI가 즉시 부담금과 절감 시나리오를 계산해드립니다.",
    uspBadges: ["편의시설 0원", "2주 도입", "분쟁 0건"],
    ctaText: "AI 진단 시작",
    usps: [
      { icon: "💰", title: "부담금 80% 절감", desc: "○○산업 연 16억 절감" },
      { icon: "🏠", title: "재택 기반", desc: "편의시설 투자 0원" },
      { icon: "🛡️", title: "분쟁률 0%", desc: "450+사 무사고" },
    ],
  },
};

function schemaPrompt(template) {
  if (template === "numberShock") {
    return `JSON 스키마 (numberShock 템플릿):
{
  "badge": "큰 숫자 위 작은 뱃지 (15자 이내, '450+ 기업이 선택한' 같은 소셜프루프)",
  "bigNumber": "임팩트 있는 거대 숫자 (예: '3억 2천만원')",
  "headline": "충격 헤드라인 1줄 (질문형 권장)",
  "subhead": "서브카피 1~2줄 (해결 방향 암시)",
  "ctaText": "행동 지시적 CTA (예: '30초 만에 절감액 확인')",
  "comparison": {
    "before": "현재 부담금 (예: '3.2억원')",
    "after": "도입 후 비용 (예: '0.8억원')",
    "saving": "연간 절감액 (예: '2.4억원')"
  },
  "painPoints": ["페인 1 (질문 또는 공감)", "페인 2", "페인 3"],
  "usps": [
    {"icon": "🏠", "title": "USP 제목", "desc": "한줄 설명"},
    {"icon": "📋", "title": "USP 제목", "desc": "한줄 설명"},
    {"icon": "🛡️", "title": "USP 제목", "desc": "한줄 설명"}
  ]
}`;
  }
  if (template === "story") {
    return `JSON 스키마 (story 템플릿):
{
  "headline": "질문형 헤드라인 (공감 유도)",
  "subhead": "서브카피 1~2줄",
  "ctaText": "행동 지시 CTA",
  "story": [
    {"icon": "💸", "label": "STAGE 1", "title": "문제 단계", "desc": "구체 상황 설명 1~2문장"},
    {"icon": "💡", "label": "STAGE 2", "title": "발견 단계", "desc": "솔루션 발견 1~2문장"},
    {"icon": "🚀", "label": "STAGE 3", "title": "도입 단계", "desc": "실행 1~2문장"},
    {"icon": "🏆", "label": "STAGE 4", "title": "결과 단계", "desc": "성과 수치 포함 1~2문장"}
  ],
  "testimonial": {
    "quote": "고객 후기 1~2문장 (실제처럼 자연스럽게)",
    "name": "고객사명",
    "title": "직함"
  }
}`;
  }
  return `JSON 스키마 (diagnostic 템플릿):
{
  "headline": "30초/즉시 가치 제안 헤드라인",
  "subhead": "왜 즉시 진단이 가능한지 설명 1~2줄",
  "uspBadges": ["짧은 USP 1", "USP 2", "USP 3"],
  "ctaText": "행동 지시 CTA",
  "usps": [
    {"icon": "💰", "title": "USP 제목", "desc": "구체 실적/숫자"},
    {"icon": "🏠", "title": "USP 제목", "desc": "구체 실적/숫자"},
    {"icon": "🛡️", "title": "USP 제목", "desc": "구체 실적/숫자"}
  ]
}`;
}

function buildPrompt({ keyword, target, usps, tone, template }) {
  return `브이드림 B2B 랜딩 페이지 카피를 생성하세요. 시스템 프롬프트의 카피 원칙을 엄격히 따르세요.

[입력]
- 키워드: ${keyword}
- 타겟: ${target || "HR 담당자"}
- 강조 USP: ${(usps || []).join(", ") || "자유 선택"}
- 톤: ${tone || "정보형"}
- 템플릿: ${template}

${schemaPrompt(template)}

응답은 한국어 JSON만. 백틱·마크다운 금지.`;
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

  const { template = "numberShock" } = body || {};
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
        max_tokens: 2000,
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

    if (!parsed.headline && !parsed.bigNumber) {
      return Response.json({
        ...FALLBACKS[template],
        fallback: true,
        reason: "missing required fields",
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
