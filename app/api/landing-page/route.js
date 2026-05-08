// POST /api/landing-page
// 키워드·타겟·USP·톤 → 완전한 HTML 랜딩 페이지
// Request:  { keyword, target, usps[], tone }
// Response: { html: "<full html>" }

export const runtime = "nodejs";

const FALLBACK_HTML = (req) => `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>브이드림 — 고용부담금 진단</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans KR',sans-serif;background:#F8FAFC;color:#0F172A;line-height:1.6}
.hero{padding:80px 24px;text-align:center;background:radial-gradient(ellipse at top,rgba(0,201,167,.18),transparent 60%)}
.tag{font-size:11px;letter-spacing:3px;color:#00C9A7;font-weight:800;margin-bottom:14px}
h1{font-size:42px;font-weight:900;line-height:1.2;letter-spacing:-1px;background:linear-gradient(135deg,#00C9A7,#1D85EB);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.sub{font-size:16px;color:#334155;margin:18px auto;max-width:560px}
.cta{display:inline-block;margin-top:24px;padding:14px 32px;border-radius:10px;background:linear-gradient(135deg,#00C9A7,#1D85EB);color:#000;font-weight:900;text-decoration:none}
.section{padding:60px 24px;max-width:960px;margin:0 auto}
h2{font-size:24px;font-weight:800;margin-bottom:24px;color:#0F172A}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.card{padding:20px;border-radius:14px;background:#FFFFFF;border:1px solid #E2E8F0;box-shadow:0 1px 3px rgba(0,0,0,0.06)}
.card h3{font-size:16px;font-weight:800;color:#00C9A7;margin-bottom:8px}
.card p{font-size:13px;color:#334155}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;text-align:center}
.stats .num{font-size:34px;font-weight:900;color:#00C9A7;font-family:'JetBrains Mono',monospace}
.stats .lbl{font-size:11px;color:#64748B;margin-top:6px}
.steps{display:flex;gap:10px;flex-wrap:wrap}
.step{flex:1;min-width:170px;padding:18px;border-radius:12px;background:#F1F5F9;border-left:3px solid #1D85EB}
.step .w{font-size:11px;color:#1D85EB;font-weight:800;letter-spacing:2px}
.step .l{font-size:14px;color:#0F172A;font-weight:700;margin-top:6px}
.cta-final{padding:60px 24px;text-align:center;background:linear-gradient(135deg,rgba(0,201,167,.12),rgba(29,133,235,.12));border-top:1px solid rgba(0,201,167,.3)}
.tel{display:block;margin-top:14px;font-size:14px;color:#00C9A7;font-family:'JetBrains Mono',monospace}
@media(max-width:640px){h1{font-size:32px}.stats{grid-template-columns:repeat(2,1fr)}}
</style></head>
<body>
<section class="hero">
  <div class="tag">VDREAM × ${(req.target || "HR").toUpperCase()}</div>
  <h1>${req.keyword || "고용부담금"}, 30초면 답이 나옵니다</h1>
  <p class="sub">기업 정보 입력만으로 부담금·절감액·맞춤 직무까지 AI가 즉시 진단합니다.</p>
  <a class="cta" href="#cta">무료 부담금 진단받기</a>
</section>
<section class="section">
  <h2>이런 고민이 있으신가요?</h2>
  <div class="grid">
    <div class="card"><h3>💰 매년 부담금 수억</h3><p>의무 미달성으로 발생하는 고용부담금을 매년 반복 납부.</p></div>
    <div class="card"><h3>🏢 편의시설 투자 부담</h3><p>장애인 직원 위한 사무실 개조·시설 투자가 부담스러움.</p></div>
    <div class="card"><h3>⚖️ 노무 리스크 우려</h3><p>채용 후 분쟁이나 관리 이슈가 생길까 걱정됨.</p></div>
  </div>
</section>
<section class="section">
  <h2>브이드림이 해결합니다</h2>
  <div class="grid">
    <div class="card"><h3>🏠 재택근무 기반</h3><p>편의시설 투자 0원. 2~4주 내 도입.</p></div>
    <div class="card"><h3>📋 플립 시스템</h3><p>채용·근태·급여·증빙 한 화면 통합.</p></div>
    <div class="card"><h3>🛡️ 분쟁률 0%</h3><p>450+사·24,000명 채용, 노무 분쟁 0건.</p></div>
  </div>
</section>
<section class="section">
  <h2>숫자가 증명합니다</h2>
  <div class="stats">
    <div><div class="num">450+</div><div class="lbl">고객사</div></div>
    <div><div class="num">24,000</div><div class="lbl">누적 채용</div></div>
    <div><div class="num">8,300억</div><div class="lbl">절감 누적</div></div>
    <div><div class="num">0건</div><div class="lbl">분쟁</div></div>
  </div>
</section>
<section class="section">
  <h2>도입 프로세스</h2>
  <div class="steps">
    <div class="step"><div class="w">W1</div><div class="l">상담·계약</div></div>
    <div class="step"><div class="w">W2</div><div class="l">직무 설계</div></div>
    <div class="step"><div class="w">W3</div><div class="l">채용 매칭</div></div>
    <div class="step"><div class="w">W4</div><div class="l">운영 시작</div></div>
  </div>
</section>
<section class="cta-final" id="cta">
  <h2>지금 무료 상담 신청하세요</h2>
  <a class="cta" href="https://www.vdream.co.kr/inquiry">📞 무료 상담 신청</a>
  <a class="tel" href="tel:1644-8619">또는 1644-8619 전화 상담</a>
</section>
</body></html>`;

function buildPrompt({ keyword, target, usps, tone }) {
  return `브이드림 B2B 랜딩 페이지를 HTML로 생성하세요.

키워드: ${keyword}
타겟: ${target}
USP: ${(usps || []).join(", ") || "자유"}
톤: ${tone || "정보형"}

다음 구조의 완전한 HTML을 생성하세요 (인라인 CSS 포함, <!doctype html>로 시작하는 완전한 문서):

1. 히어로: 헤드라인 (키워드 맞춤 임팩트), 서브카피 2줄, CTA "무료 부담금 진단받기"
2. 문제 제기: 키워드 검색자의 페인포인트 3개 (아이콘+짧은 설명)
3. 솔루션: "브이드림이 해결합니다" + 선택된 USP 카드
4. 숫자 증거: 450+사 / 24,000명 / 8,300억원 절감 / 분쟁 0건
5. 도입 프로세스: 상담→직무설계→채용매칭→운영관리 (W1~W4 타임라인)
6. CTA: "지금 무료 상담 신청" 버튼 + 전화번호 1644-8619

[디자인]
- 배경 #F8FAFC (메인), 카드 #FFFFFF + border #E2E8F0 + box-shadow 0 1px 3px rgba(0,0,0,0.06)
- 액센트 #00C9A7 (teal), 보조 #1D85EB (blue)
- 텍스트: 헤딩 #0F172A, 본문 #334155, 보조 #64748B
- CTA 버튼: linear-gradient(135deg, #00C9A7, #1D85EB), color #FFFFFF
- 라이트 테마, 깔끔한 SaaS 스타일, 모바일 반응형
- HTML 응답만 (설명·마크다운 없이). \`\`\` 백틱 금지.`;
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }
  if (!body.keyword) return Response.json({ error: "keyword required" }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ html: FALLBACK_HTML(body), fallback: true, reason: "ANTHROPIC_API_KEY missing" });
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
        max_tokens: 4000,
        messages: [{ role: "user", content: buildPrompt(body) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ html: FALLBACK_HTML(body), fallback: true, reason: `upstream ${res.status}: ${errText.slice(0, 200)}` });
    }

    const data = await res.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    const cleaned = text
      .replace(/^```html/i, "")
      .replace(/^```/i, "")
      .replace(/```\s*$/, "")
      .trim();

    if (!cleaned || cleaned.length < 200 || !/<html/i.test(cleaned)) {
      return Response.json({ html: FALLBACK_HTML(body), fallback: true, reason: "invalid html" });
    }

    return Response.json({ html: cleaned });
  } catch (err) {
    return Response.json({ html: FALLBACK_HTML(body), fallback: true, reason: err.message || "unknown" });
  }
}
