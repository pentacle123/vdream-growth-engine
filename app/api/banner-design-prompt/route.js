// POST /api/banner-design-prompt
// 배너 카피 + 사이즈 → DALL-E/Ductape/Canva용 디자인 프롬프트
// Request:  { template, size: {w,h}, headline, subCopy, cta, tone }
// Response: { dallePrompt, ductapePrompt, canvaGuide }

import { COPY_AND_DESIGN_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const FALLBACK = (req) => {
  const ar =
    req.size && req.size.w === req.size.h
      ? "1:1"
      : req.size && req.size.h > req.size.w
      ? "9:16"
      : "16:9";
  return {
    dallePrompt: `Modern B2B banner advertisement, ${req.size?.w || 1200}×${req.size?.h || 628}px, abstract corporate concept, teal (#00C9A7) and blue (#1D85EB) gradient color palette on white background, minimalist clean design, bold large typography placeholder area on left, geometric shapes representing growth and savings, no people, professional trustworthy mood --ar ${ar} --style raw`,
    ductapePrompt: `브이드림 B2B 퍼포먼스 배너

[사양]
- 사이즈: ${req.size?.w || 1200}×${req.size?.h || 628}px
- 템플릿: ${req.template || "number"}
- 헤드라인: ${req.headline || ""}
- CTA: ${req.cta || "무료 진단받기"}

[디자인 가이드]
배경: #FFFFFF (메인) — 우측 상단에 틸→블루 radial gradient 글로우 (반경 80% 짧은 변, opacity 0.18)
좌상단: V Dream 로고 (V는 #00C9A7, Dream은 #0F172A)
중앙 좌측: 거대 임팩트 숫자/헤드라인 (font-weight 900, letter-spacing -1px, 그라데이션 텍스트)
우측 또는 하단: CTA 버튼 (linear-gradient #00C9A7→#1D85EB, 흰 텍스트, border-radius 12px, box-shadow 0 8px 18px rgba(0,201,167,0.3))
하단: 그라데이션 라인 바 (12px 두께, 풀와이드)

[타이포]
- 폰트: 'Noto Sans KR', 'Pretendard'
- 메인 숫자: 짧은 변의 14~16% 크기, 그라데이션 텍스트
- 서브 텍스트: 짧은 변의 6~8% 크기, #0F172A
- CTA: 짧은 변의 4.5%, 흰색 #FFFFFF

[정렬]
${req.size?.w > req.size?.h ? "가로형: 좌측 텍스트 + 우측 CTA" : req.size?.h > req.size?.w ? "세로형: 상단 텍스트 + 하단 CTA" : "정사각형: 중앙 정렬 풀"}`,
    canvaGuide: `Canva에서 만들 때 (${req.size?.w}×${req.size?.h}):

1. 새 디자인 → 사용자 정의 사이즈 ${req.size?.w}×${req.size?.h}px 입력
2. 배경: 흰색 (#FFFFFF)
3. 우측 상단에 틸/블루 그라데이션 원형 추가 (Elements → Shape → Circle, opacity 20%)
4. 텍스트:
   - 거대 숫자/헤드라인 — Pretendard ExtraBold, ${req.size?.w * 0.13}px, 그라데이션 컬러 (Effects → Gradient: #00C9A7 → #1D85EB)
   - 서브 텍스트 — Pretendard Bold, 색상 #0F172A
5. CTA 버튼:
   - Rectangle 추가 → 모서리 radius 12px
   - Color: 그라데이션 #00C9A7 → #1D85EB
   - 텍스트: "${req.cta || "무료 진단받기"}" 흰색, Bold
   - Effects → Shadow: Outer, Color rgba(0,201,167,0.3), Blur 18, Distance 8
6. 좌상단에 'V Dream' 로고 텍스트 (V=#00C9A7, Dream=#0F172A)
7. 하단에 풀와이드 그라데이션 라인 (높이 12px, #00C9A7→#1D85EB)
8. 다운로드 → PNG (투명 배경 비활성화)`,
  };
};

function buildPrompt({ template, size, headline, subCopy, cta, tone }) {
  const ar =
    size && size.w === size.h ? "1:1" : size && size.h > size.w ? "9:16" : "16:9";
  return `당신은 AI 디자인 툴 프롬프트 전문가입니다. 브이드림 B2B 배너용 디자인 프롬프트를 생성하세요.

[배너 정보]
- 사이즈: ${size?.w || "1200"}×${size?.h || "628"}px (aspect ratio ${ar})
- 템플릿: ${template} (number/compare/urgent/trust/question)
- 헤드라인: ${headline || ""}
- 서브카피: ${subCopy || ""}
- CTA: ${cta || ""}
- 톤: ${tone || "정보형"}
- 브랜드: Teal #00C9A7 (primary), Blue #1D85EB (secondary)

JSON만 응답 (백틱·마크다운 금지):
{
  "dallePrompt": "DALL-E 배너 이미지 프롬프트 (영문, --ar ${ar} 포함, no people, abstract, corporate, clean white bg with teal/blue gradient accents)",
  "ductapePrompt": "Ductape에 넣을 배너 디자인 프롬프트 (한글, 레이아웃·타이포·색상·CTA 위치 상세)",
  "canvaGuide": "Canva에서 만들 때 단계별 가이드 (한글, 사이즈/요소/색상/효과/다운로드 순서)"
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
  if (!body.template) {
    return Response.json({ error: "template required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ ...FALLBACK(body), fallback: true, reason: "ANTHROPIC_API_KEY missing" });
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
        max_tokens: 2200,
        system: COPY_AND_DESIGN_SYSTEM,
        messages: [{ role: "user", content: buildPrompt(body) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ ...FALLBACK(body), fallback: true, reason: `upstream ${res.status}: ${errText.slice(0, 200)}` });
    }

    const data = await res.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    const parsed = parseJson(text);

    if (!parsed.dallePrompt) {
      return Response.json({ ...FALLBACK(body), fallback: true, reason: "missing dallePrompt" });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ ...FALLBACK(body), fallback: true, reason: err.message || "unknown" });
  }
}
