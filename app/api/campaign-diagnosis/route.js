// POST /api/campaign-diagnosis
// 네이버 광고 데이터 → Claude → 문제점 + 개선안 + 즉시조치 진단
// Request:  { totals, groups, byTag, sampleKeywords }
// Response: { problems:[{title,desc}], solutions:[{title,desc}], quickWins:[{title,desc}] }

import { COPY_EXPERT_SYSTEM } from "@/lib/expertSkills";

export const runtime = "nodejs";

const FALLBACK = {
  problems: [
    {
      title: "전체 캠페인 전환율 0% — 광고비만 소진",
      desc: "노출 27,000회 + 클릭 651회 + 비용 약 90만원이 발생했지만 전환은 0건. 광고비가 비즈니스 성과로 연결되지 못하는 구조적 문제.",
    },
    {
      title: "최고 CPC 키워드 '장애인고용부담금'의 CTR 0.38%",
      desc: "월 5,765 노출에 클릭 22건. CPC 32,075원 대비 클릭률이 산업 평균(B2B 검색광고 1~2%)에 크게 미달. 광고 카피가 검색 의도와 맞지 않음.",
    },
    {
      title: "B2C 키워드(지역+장애인일자리)에 예산 분산",
      desc: "구직자 검색 트래픽인데 B2B 캠페인에 묶여있음. 5,000회 노출이 무관한 청중에 소진됨.",
    },
  ],
  solutions: [
    {
      title: "검색 의도별 카피 분리 (B2B / 세무 / 일반)",
      desc: "'장애인고용부담금' = HR 의사결정자 / '손금·경정청구' = 세무담당자 / '재택근무' = 솔루션 탐색자. 3가지 카피·랜딩 분리 운영.",
    },
    {
      title: "AI 진단기를 메인 랜딩으로 전환",
      desc: "현재 랜딩이 무엇이든 즉시 진단기(/diagnose)로 연결. 검색→진단→리드 경로를 단축. 30초 진단으로 부담금 즉시 산출.",
    },
    {
      title: "B2C 트래픽을 별도 캠페인으로 분리",
      desc: "지역+장애인일자리 키워드는 채용 사이트 LP로. B2B 부담금 키워드와 예산·성과 분리 측정.",
    },
  ],
  quickWins: [
    {
      title: "1주 내: '장애인고용부담금' 카피 A/B 테스트",
      desc: "현재 카피 vs '○억 부담금, 0원 만드는 방법' 충격형 카피. CTR 0.38% → 1.5% 목표.",
    },
    {
      title: "2주 내: 세무 프레임 카피 신규 제작",
      desc: "'손금 처리보다 더 좋은 방법' 카피로 손금/경정청구 클러스터 1,240회 노출 활용.",
    },
    {
      title: "3주 내: 진단기 랜딩 전환 트래킹 설치",
      desc: "GA4 + 네이버 전환 스크립트로 진단 완료·리드수집 이벤트 측정. 데이터 없는 최적화 종료.",
    },
  ],
};

function buildPrompt({ totals, groups, byTag, sampleKeywords }) {
  return `당신은 한국 B2B 검색광고(네이버 파워링크) 전문가입니다. 브이드림(장애인 재택근무 SaaS 1위)의 실제 운영 데이터를 분석해 문제점·개선안·즉시조치를 도출하세요.

[전체 집계]
- 총 노출: ${totals.imp.toLocaleString("ko-KR")}회
- 총 클릭: ${totals.click.toLocaleString("ko-KR")}회
- 평균 CTR: ${totals.ctr.toFixed(2)}%
- 평균 CPC: ${Math.round(totals.avgCpc).toLocaleString("ko-KR")}원
- 총 비용: ${totals.cost.toLocaleString("ko-KR")}원
- 총 전환: ${totals.conv}건 (전환율 0%)

[광고 그룹별 성과]
${groups.map((g) => `- ${g.name} (${g.tag}): 노출 ${g.imp}, 클릭 ${g.click}, 비용 ${g.cost.toLocaleString("ko-KR")}원, 전환 ${g.conv}`).join("\n")}

[키워드 분류 분포]
${byTag.map((t) => `- ${t.name}: ${t.value}개 키워드`).join("\n")}

[주요 키워드 샘플]
${sampleKeywords.slice(0, 10).map((k) => `- ${k.kw}: 노출 ${k.imp}, 클릭 ${k.click}, CTR ${k.ctr}%, CPC ${k.cpc.toLocaleString("ko-KR")}원, 비용 ${k.cost.toLocaleString("ko-KR")}원, 태그 ${k.tag}`).join("\n")}

[브이드림 컨텍스트]
- 핵심 제품: 플립(Flipped) 장애인 재택근무 인사관리 SaaS
- 핵심 USP: 450+사 도입, 누적 24,000명, 분쟁률 0%, 2~4주 도입, 편의시설 불필요
- B2B 타겟: HR 담당자(주력), CFO/경영진, CEO/대표
- 진단기 보유: 부담금 즉시 산출 + AI 직무추천

JSON만 응답 (백틱·마크다운 금지):
{
  "problems": [
    {"title":"핵심 문제 1줄","desc":"구체적 데이터 근거 2~3문장"},
    {"title":"핵심 문제 1줄","desc":"구체적 데이터 근거 2~3문장"},
    {"title":"핵심 문제 1줄","desc":"구체적 데이터 근거 2~3문장"}
  ],
  "solutions": [
    {"title":"개선안 1줄","desc":"실행 방안 2~3문장"},
    {"title":"개선안 1줄","desc":"실행 방안 2~3문장"},
    {"title":"개선안 1줄","desc":"실행 방안 2~3문장"}
  ],
  "quickWins": [
    {"title":"1~3주 내 즉시 조치 1줄","desc":"구체적 액션과 기대 효과 2~3문장"},
    {"title":"1~3주 내 즉시 조치 1줄","desc":"구체적 액션과 기대 효과 2~3문장"},
    {"title":"1~3주 내 즉시 조치 1줄","desc":"구체적 액션과 기대 효과 2~3문장"}
  ]
}`;
}

function parseJson(text) {
  const clean = String(text || "").replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(clean);
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "invalid JSON" }, { status: 400 }); }

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
        max_tokens: 2000,
        system: COPY_EXPERT_SYSTEM,
        messages: [{ role: "user", content: buildPrompt(body) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ ...FALLBACK, fallback: true, reason: `upstream ${res.status}: ${errText.slice(0, 200)}` });
    }

    const data = await res.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    const parsed = parseJson(text);

    if (!Array.isArray(parsed.problems) || !Array.isArray(parsed.solutions) || !Array.isArray(parsed.quickWins)) {
      return Response.json({ ...FALLBACK, fallback: true, reason: "missing arrays" });
    }

    return Response.json(parsed);
  } catch (err) {
    return Response.json({ ...FALLBACK, fallback: true, reason: err.message || "unknown" });
  }
}
