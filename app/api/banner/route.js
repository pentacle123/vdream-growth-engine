// POST /api/banner
// 사이즈·카피·테마 → HTML 배너 (다크/라이트 동시)
// Request:  { width, height, headline, subCopy, cta, theme }
// Response: { dark: "<html>", light: "<html>" }

import { COPY_AND_DESIGN_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const fallbackBanner = (req, theme) => {
  const isDark = theme === "dark";
  const bg = isDark ? "#F8FAFC" : "#ffffff";
  const fg = isDark ? "#0F172A" : "#F8FAFC";
  const sub = isDark ? "#334155" : "#64748B";
  return `<div style="width:${req.width}px;height:${req.height}px;background:${bg};color:${fg};font-family:system-ui,sans-serif;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:${Math.min(req.width, req.height) * 0.06}px;box-sizing:border-box;border-radius:${Math.min(req.width, req.height) * 0.04}px;background-image:radial-gradient(ellipse at top right,rgba(0,201,167,.18),transparent 60%);overflow:hidden;position:relative;">
  <div style="position:absolute;top:${Math.min(req.width, req.height) * 0.06}px;right:${Math.min(req.width, req.height) * 0.06}px;font-size:${Math.min(req.width, req.height) * 0.06}px;font-weight:900;color:#00C9A7;letter-spacing:1px;">V<span style="color:${fg};">Dream</span></div>
  <div style="font-size:${Math.min(req.width / 16, req.height / 8)}px;font-weight:900;line-height:1.2;letter-spacing:-0.5px;max-width:90%;">${req.headline || "고용부담금 0원 만들기"}</div>
  <div style="font-size:${Math.min(req.width / 30, req.height / 14)}px;color:${sub};margin-top:${Math.min(req.width, req.height) * 0.025}px;max-width:90%;">${req.subCopy || "재택근무 기반 장애인 고용 솔루션"}</div>
  <div style="margin-top:${Math.min(req.width, req.height) * 0.04}px;padding:${Math.min(req.width, req.height) * 0.025}px ${Math.min(req.width, req.height) * 0.05}px;background:linear-gradient(135deg,#00C9A7,#1D85EB);color:#000;font-weight:900;border-radius:${Math.min(req.width, req.height) * 0.03}px;font-size:${Math.min(req.width / 30, req.height / 14)}px;">${req.cta || "무료 진단받기"} →</div>
</div>`;
};

function buildPrompt({ width, height, headline, subCopy, cta, theme }) {
  const isDark = theme === "dark";
  return `다음 사양의 HTML/CSS 배너를 생성하세요.

[사양]
- 정확한 사이즈: ${width}×${height}px
- 헤드라인: ${headline}
- 서브카피: ${subCopy || "(없음, 생략 가능)"}
- CTA: ${cta || "무료 진단받기"}
- 테마: ${isDark ? "다크 (배경 #F8FAFC, 텍스트 #0F172A)" : "라이트 (배경 #ffffff, 텍스트 #F8FAFC)"}

[요구사항]
- 완전한 인라인 CSS (외부 의존성 없음)
- 브랜드 컬러: 메인 #00C9A7, 보조 #1D85EB, 그라데이션 활용
- 좌상단 또는 우상단에 "V Dream" 로고 텍스트 (V만 #00C9A7)
- CTA는 그라데이션 버튼 모양으로 눈에 띄게
- 폰트: system-ui (웹폰트 미사용)
- ${width}×${height}px에 정확히 맞는 단일 div
- 깔끔하고 프로페셔널한 B2B 톤
- 사이즈에 맞춰 폰트 크기 자동 조정 (긴 가로 배너 vs 정사각형 vs 세로형 구분)

응답: HTML만. 단일 <div> 하나로 시작해서 끝나야 함. 백틱·설명·마크다운 금지.`;
}

async function generateOne(apiKey, body, theme) {
  const fallback = fallbackBanner(body, theme);
  if (!apiKey) return { html: fallback, fallback: true };

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
        messages: [{ role: "user", content: buildPrompt({ ...body, theme }) }],
      }),
    });

    if (!res.ok) return { html: fallback, fallback: true };

    const data = await res.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    const cleaned = text
      .replace(/^```html/i, "")
      .replace(/^```/i, "")
      .replace(/```\s*$/, "")
      .trim();

    if (!cleaned.startsWith("<div")) return { html: fallback, fallback: true };

    return { html: cleaned };
  } catch {
    return { html: fallback, fallback: true };
  }
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }
  if (!body.headline) return Response.json({ error: "headline required" }, { status: 400 });
  if (!body.width || !body.height) return Response.json({ error: "width/height required" }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // 다크 + 라이트 두 버전 동시 생성
  const [dark, light] = await Promise.all([
    generateOne(apiKey, body, "dark"),
    generateOne(apiKey, body, "light"),
  ]);

  return Response.json({
    dark: dark.html,
    light: light.html,
    fallback: dark.fallback || light.fallback,
  });
}
