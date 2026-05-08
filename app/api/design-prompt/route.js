// POST /api/design-prompt
// 랜딩 페이지 카피 + 템플릿 → DALL-E/Ductape/Figma용 디자인 프롬프트 생성
// Request:  { template, copy, keyword, target, tone }
// Response: { dalleHeroImage, dalleStyleGuide, ductapeLandingPrompt, figmaDescription }

import { COPY_AND_DESIGN_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const FALLBACK = (req) => ({
  dalleHeroImage: `Modern B2B SaaS landing page hero illustration, abstract concept of cost savings and HR automation, teal (#00C9A7) and blue (#1D85EB) gradient color palette, clean white background, minimalist corporate style, no people, isometric or geometric shapes representing growth and efficiency, --ar 16:9 --style raw`,
  dalleStyleGuide: `Overall design system: Light theme with white (#FFFFFF) base, surface (#F8FAFC) cards. Brand teal #00C9A7 and blue #1D85EB used sparingly for CTAs and key numbers. Typography: Noto Sans KR for body, JetBrains Mono for numbers. Generous whitespace. Mobile-first. Subtle radial gradient accents. Soft shadows (0 1px 3px rgba(0,0,0,0.06)). Border radius 12-16px on cards.`,
  ductapeLandingPrompt: `B2B SaaS 랜딩 페이지 (브이드림 — 장애인 재택근무 인사관리 솔루션)

타입: ${req.template || "numberShock"}
키워드: ${req.keyword}
타겟: ${req.target || "HR 담당자"}

[레이아웃]
- 풀와이드 히어로 (높이 80vh, 중앙 정렬 텍스트)
- 우측 상단에 미묘한 틸→블루 radial gradient 글로우 (반경 480px, opacity 0.18)
- 5섹션 구조: 히어로 → 비교/스토리 → 페인포인트 → USP → 소셜프루프 → CTA

[색상]
- 배경: #FFFFFF (메인), #F8FAFC (서브 섹션 교차)
- 액센트: #00C9A7 (틸), #1D85EB (블루) — CTA와 임팩트 숫자에만 집중
- 텍스트: #0F172A (헤딩), #334155 (본문), #64748B (보조)
- 위험: #EF4444 (페인 카드 보더), 성공: #10B981

[타이포그래피]
- 폰트: 'Noto Sans KR' (메인), 'JetBrains Mono' (숫자 강조)
- 거대 숫자: clamp(56px, 11vw, 132px), font-weight 900, 그라데이션 텍스트
- 헤드라인: clamp(28px, 4.5vw, 48px), font-weight 900, letter-spacing -1px
- 본문: 15~18px, line-height 1.6, color #334155
- 라벨: 11px, letter-spacing 2~3px, font-weight 800 (대문자)

[CTA 버튼]
- background: linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)
- padding: 20px 40px, border-radius: 16px, color: #FFFFFF
- font-weight: 900, font-size: 16~18px
- box-shadow: 0 10px 30px rgba(0,201,167,0.30)
- hover: translateY(-2px) scale(1.02)

[카드]
- background: #FFFFFF, border: 1px solid #E2E8F0
- border-radius: 16~24px, padding: 28~40px
- box-shadow: 0 1px 3px rgba(0,0,0,0.06)

[모바일]
- 1열 스택, 폰트 크기 자동 축소 (clamp 활용)
- 히어로 텍스트 가운데 정렬
- 섹션 간 padding 60px → 40px`,
  figmaDescription: `Figma 디자인 브리프 — 브이드림 B2B 랜딩 (${req.template || "numberShock"})

[프레임]
- Desktop: 1440 × 자유 길이
- Mobile: 375 × 자유 길이
- 브레이크포인트 768px

[컴포넌트 라이브러리]
1. Hero (variants: NumberShock / Story / Diagnostic)
2. Comparison Card (Before/After/Saving)
3. Pain Card (Red border accent)
4. USP Card (Icon + Title + Desc)
5. Stat Pill (Big number + label)
6. CTA Button (Primary gradient)
7. FAQ Accordion

[그리드]
- Desktop: 12 columns, gutter 24px, max-width 1200px
- Mobile: 4 columns, gutter 16px

[타이포 스타일]
- H1 Hero: 48/56 SemiBold (Noto Sans KR), letter-spacing -1px
- H2: 32/40 Bold
- H3: 20/28 Bold
- Body L: 18/28 Regular
- Body M: 15/24 Regular
- Caption: 12/16 Medium

[색상 토큰]
- brand/primary: #00C9A7
- brand/secondary: #1D85EB
- text/heading: #0F172A
- text/body: #334155
- text/mute: #64748B
- bg/main: #FFFFFF
- bg/surface: #F8FAFC
- border/default: #E2E8F0

[효과]
- shadow/sm: 0 1px 3px rgba(0,0,0,0.06)
- shadow/md: 0 8px 24px rgba(0,0,0,0.08)
- shadow/cta: 0 10px 30px rgba(0,201,167,0.30)`,
});

function buildPrompt({ template, copy, keyword, target, tone }) {
  const copyContext = copy
    ? `\n[현재 카피 컨텍스트]\n${JSON.stringify(copy, null, 2).slice(0, 1500)}`
    : "";
  return `당신은 DALL-E와 Ductape, Figma용 디자인 프롬프트 전문가입니다. 브이드림 B2B 랜딩 페이지를 위한 디자인 프롬프트를 생성하세요.

[랜딩 정보]
- 타입: ${template} (numberShock=숫자충격형 / story=스토리형 / diagnostic=진단기 임베드형)
- 키워드: ${keyword}
- 타겟: ${target || "HR 담당자"}
- 톤: ${tone || "정보형"}
- 브랜드 색상: Teal #00C9A7 (primary), Blue #1D85EB (secondary)
- 폰트: Noto Sans KR${copyContext}

JSON만 응답 (백틱·마크다운 금지):
{
  "dalleHeroImage": "DALL-E용 히어로 배경 이미지 프롬프트 (영문, 상세, --ar 16:9 포함, no people, abstract, corporate clean)",
  "dalleStyleGuide": "전체 디자인 스타일 지시 (영문, 컬러·타이포·간격·shadow 등 종합)",
  "ductapeLandingPrompt": "Ductape에 넣을 전체 랜딩 페이지 디자인 프롬프트 (한글, 매우 상세하게 — 레이아웃·섹션·색상·폰트·CTA 위치·간격·모바일 대응 모두 포함)",
  "figmaDescription": "Figma 디자이너에게 전달할 디자인 브리프 (한글, 컴포넌트 라이브러리·그리드·타이포 스타일·색상 토큰·효과 정의 포함)"
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
        max_tokens: 3000,
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

    if (!parsed.dalleHeroImage || !parsed.ductapeLandingPrompt) {
      return Response.json({ ...FALLBACK(body), fallback: true, reason: "missing fields" });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ ...FALLBACK(body), fallback: true, reason: err.message || "unknown" });
  }
}
