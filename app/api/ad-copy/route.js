// POST /api/ad-copy
// 키워드 + 타겟 + USP + 톤 → 멀티채널 광고 카피
// Request:  { keyword, target, usps[], tone }
// Response: { naver:{titles[3], descs[3]}, meta:{headline, body, cta}, linkedin:{headline, intro}, youtube:{bumper6s}, landing:{headline, sub, cta} }

import { COPY_AND_DESIGN_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const TARGET_LABEL = {
  hr: "HR 담당자 (인사·총무 실무자)",
  cfo: "CFO·경영진 (비용·예산 의사결정자)",
  ceo: "CEO·대표 (전사 의사결정자)",
};

const TONE_LABEL = {
  info: "정보형 (팩트·데이터 중심, 차분한 톤)",
  urgent: "긴급형 (기한·리스크 강조, 행동 촉구)",
  empathy: "공감형 (페인포인트 공감, 솔루션 제시)",
};

const FALLBACK = (req) => ({
  naver: {
    titles: [
      "부담금보다 채용이 싸다",
      `${req.keyword || "장애인 고용부담금"} 진단`,
      "30초만에 부담금 계산",
    ],
    descs: [
      "450+사 검증 / 분쟁률 0% / 2~4주 도입. 무료 부담금 진단 받기.",
      "사무실 개조 없이 재택근무로 의무고용 충족. 30만+ 인재풀 매칭.",
      "1644-8619 무료 상담. 도입 시 연간 ○억 절감 가능.",
    ],
  },
  meta: {
    headline: "고용부담금, 0원으로 만드는 법",
    body: "재택근무 기반 장애인 채용으로 부담금→채용비용 전환. 450+사가 이미 시작했습니다. 2~4주 내 도입 가능, 편의시설 투자 불필요.",
    cta: "무료 진단받기",
  },
  linkedin: {
    headline: "당신의 회사도 부담금을 0원으로 만들 수 있습니다",
    intro:
      "HR 담당자라면 매년 1월의 고통을 알고 계실 겁니다. 신고만 반복할 게 아니라, 채용으로 전환하면 비용이 더 적습니다. 30분이면 우리 회사 시나리오를 보여드립니다.",
  },
  youtube: {
    bumper6s: "고용부담금? 진단 30초면 끝. 브이드림.",
  },
  landing: {
    headline: "당신 회사 고용부담금, 30초면 알 수 있습니다",
    sub: "기업 정보 입력 → 부담금·절감액·맞춤직무까지 AI가 즉시 진단",
    cta: "무료 진단 시작",
  },
});

function buildPrompt({ keyword, target, usps, tone }) {
  const uspList = (usps || []).join(", ");
  return `당신은 브이드림(장애인 재택근무 SaaS 1위) B2B 광고 카피라이터입니다. 멀티채널 카피를 한 번에 생성하세요.

[입력]
- 키워드: ${keyword}
- 타겟: ${TARGET_LABEL[target] || target}
- 강조 USP: ${uspList || "(자유)"}
- 톤: ${TONE_LABEL[tone] || tone}

[브이드림 USP 사전]
- 💰 부담금 절감: 채용비용이 부담금보다 싸다
- 🏠 재택근무: 편의시설 투자 불필요, 2~4주 도입
- 📋 플립 시스템: 채용·근태·급여·증빙 한 시스템
- 🛡️ 분쟁률 0%: 450+사·24,000명 채용, 노무 분쟁 0건
- 🏆 시장 1위: 누적 절감 8,300억원, 30만 인재풀

[채널별 글자수 규칙]
- 네이버 제목: 15자 이내, 설명: 45자 이내, 각 3개 변형
- 메타: 헤드라인 25자, 본문 90자, CTA 짧게
- 링크드인: 헤드라인 1줄, 인트로 100자
- 유튜브 6초 범퍼: 12자~25자 한 줄
- 랜딩: 헤드라인 1줄, 서브 1~2줄, CTA 짧게

JSON만 응답 (백틱·마크다운 금지):
{
  "naver": {
    "titles": ["제목1","제목2","제목3"],
    "descs": ["설명1","설명2","설명3"]
  },
  "meta": {
    "headline": "메타 헤드라인",
    "body": "메타 본문",
    "cta": "CTA"
  },
  "linkedin": {
    "headline": "링크드인 헤드라인",
    "intro": "링크드인 인트로 텍스트"
  },
  "youtube": {
    "bumper6s": "유튜브 6초 범퍼 스크립트"
  },
  "landing": {
    "headline": "랜딩 헤드라인",
    "sub": "랜딩 서브카피",
    "cta": "랜딩 CTA"
  }
}`;
}

function parseJson(text) {
  const clean = String(text || "").replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(clean);
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }

  if (!body.keyword) return Response.json({ error: "keyword required" }, { status: 400 });

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
        max_tokens: 2000,
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

    if (!parsed.naver || !parsed.meta) {
      return Response.json({ ...FALLBACK(body), fallback: true, reason: "missing channels" });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ ...FALLBACK(body), fallback: true, reason: err.message || "unknown" });
  }
}
