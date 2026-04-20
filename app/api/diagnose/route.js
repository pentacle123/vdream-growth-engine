// POST /api/diagnose
// 진단 결과 + 업종을 받아 Claude API에 맞춤 직무 추천을 요청한다.
// Request:  { industry, employees, shortage, hireNeeded }
// Response: { jobs: [{title, type, difficulty, desc, fit}], tip }

export const runtime = "nodejs";

const FALLBACK = {
  jobs: [
    { title: "데이터 라벨링", type: "지체/뇌병변", difficulty: "하", desc: "AI 학습 데이터 분류·태깅", fit: "적합도 높음" },
    { title: "온라인 모니터링", type: "지체/시각", difficulty: "중", desc: "웹사이트·앱 품질 모니터링", fit: "적합도 높음" },
    { title: "문서/자료 관리", type: "지체/내부장애", difficulty: "하", desc: "사내 문서 정리·데이터 입력", fit: "적합도 높음" },
    { title: "디자인 보조", type: "지체/청각", difficulty: "중", desc: "배너·카드뉴스 그래픽 보조", fit: "보통" },
    { title: "CS 채팅 상담", type: "청각/지체", difficulty: "중", desc: "채팅 기반 고객 응대", fit: "보통" },
  ],
  tip: "재택근무 기반 직무라 편의시설 투자 없이 2~4주 내 도입 가능합니다.",
};

function buildPrompt({ industry, employees, shortage, hireNeeded }) {
  return `당신은 장애인 고용 전문 컨설턴트입니다. 다음 기업에 적합한 장애인 재택근무 직무를 5개 추천하세요.

기업 정보:
- 업종: ${industry}
- 상시 근로자: ${employees}명
- 의무 부족 인원: ${shortage}명
- 필요 추가채용(중증 환산): ${hireNeeded}명

JSON만 응답하세요 (백틱이나 마크다운 없이, 설명 없이 JSON만):
{
  "jobs": [
    {"title":"직무명","type":"적합 장애유형","difficulty":"상/중/하","desc":"한 줄 설명","fit":"적합도 높음/보통"}
  ],
  "tip":"${industry} 업종 특화 팁 한 줄"
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

  const { industry = "기타", employees = 0, shortage = 0, hireNeeded = 0 } = body || {};
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json({ ...FALLBACK, fallback: true, reason: "ANTHROPIC_API_KEY missing" });
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
        messages: [{ role: "user", content: buildPrompt({ industry, employees, shortage, hireNeeded }) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ ...FALLBACK, fallback: true, reason: `upstream ${res.status}: ${errText.slice(0, 200)}` });
    }

    const data = await res.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    const parsed = parseJson(text);

    if (!Array.isArray(parsed.jobs) || parsed.jobs.length === 0) {
      return Response.json({ ...FALLBACK, fallback: true, reason: "empty jobs array" });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ ...FALLBACK, fallback: true, reason: err.message || "unknown error" });
  }
}
