"use client";

import Card from "./ui/Card";
import Badge from "./ui/Badge";

const C = {
  bg: "#050a12",
  sf: "#0c1220",
  sa: "#141d2e",
  ac: "#00C9A7",
  bl: "#1D85EB",
  pp: "#A78BFA",
  am: "#F59E0B",
  rd: "#EF4444",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

const MODULES = [
  {
    icon: "📊",
    title: "캠페인 진단",
    status: "Beta",
    statusColor: C.bl,
    desc: "구글 광고·메타 광고 KPI를 자동 분석. 노출·CTR·CPA·ROAS 임계치 비교 후 개선 액션 도출.",
    bullets: [
      "Supermetrics·Google Ads API 연동",
      "AI 인사이트 엔진 (저성과 키워드/소재 자동 진단)",
      "주간 리포트 슬랙·이메일 자동 발송",
    ],
  },
  {
    icon: "🎨",
    title: "랜딩 페이지 자동 생성",
    status: "Coming Soon",
    statusColor: C.am,
    desc: "기업 정보·캠페인 목적·타겟 페르소나 입력 → AI가 LP 카피·비주얼 컴포넌트 자동 생성.",
    bullets: [
      "Hero / Pain / Solution / Social Proof / CTA 5섹션",
      "TipTap 에디터로 즉시 편집 가능",
      "Vercel 1-click 퍼블리싱",
    ],
  },
  {
    icon: "📐",
    title: "배너 크리에이티브 자동 생성",
    status: "Coming Soon",
    statusColor: C.am,
    desc: "한 줄 카피 + 이미지 → 메타·구글·네이버 권장 사이즈별 배너 세트 자동 생성.",
    bullets: [
      "9개 권장 사이즈 (320×100 ~ 1200×628) 일괄 생성",
      "A/B 안 4개 자동 생성 → 비교 뷰",
      "DALL-E·Stable Diffusion 백엔드",
    ],
  },
  {
    icon: "🧠",
    title: "광고 카피 A/B 테스트",
    status: "Roadmap",
    statusColor: C.pp,
    desc: "기존 카피를 입력하면 톤/길이/후킹별 변형 5종 생성 + 예상 CTR 시뮬레이션.",
    bullets: [
      "GPT 검증 + Claude 생성 듀얼 엔진",
      "과거 캠페인 데이터 기반 CTR 예측",
      "Best/Worst 자동 라벨",
    ],
  },
  {
    icon: "📈",
    title: "성과 트래킹 대시보드",
    status: "Roadmap",
    statusColor: C.pp,
    desc: "전 캠페인 통합 대시보드. 매체별·기업별 ROAS 비교, 주간 자동 리포트.",
    bullets: [
      "Supermetrics·Amplitude 데이터 통합",
      "Recharts 인터랙티브 차트",
      "이상치 알림 (Slack 웹훅)",
    ],
  },
];

export default function PerformanceLabView() {
  return (
    <div>
      {/* Hero */}
      <div
        style={{
          marginBottom: 18,
          padding: "22px 20px",
          borderRadius: 16,
          background: `linear-gradient(135deg, ${C.ac}14 0%, ${C.bl}10 100%)`,
          border: `1px solid ${C.ac}33`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: C.ac,
            letterSpacing: 3,
            marginBottom: 6,
          }}
        >
          DA PERFORMANCE LAB
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 900,
            color: C.t,
            lineHeight: 1.3,
          }}
        >
          캠페인 진단부터{" "}
          <span style={{ color: C.ac }}>랜딩·배너 자동 생성</span>까지
        </h2>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            color: C.td,
            lineHeight: 1.7,
            maxWidth: 640,
          }}
        >
          광고 데이터 기반 KPI 진단과 크리에이티브 자동화를 통합한 디지털 광고 퍼포먼스 랩. 펜타클의
          광고 운영 노하우를 AI 모듈로 코드화하여 브이드림 캠페인 전체 사이클을 가속합니다.
        </p>
        <div style={{ marginTop: 12, display: "flex", gap: 5, flexWrap: "wrap" }}>
          <Badge color={C.bl}>Beta 1 / Coming 2 / Roadmap 2</Badge>
          <Badge color={C.am}>크리에이티브 자동화</Badge>
          <Badge color={C.pp}>광고 데이터 통합</Badge>
        </div>
      </div>

      {/* 5 modules */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MODULES.map((m, i) => (
          <Card key={i} style={{ padding: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${m.statusColor}14`,
                    border: `1px solid ${m.statusColor}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  {m.icon}
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 800,
                      color: C.t,
                    }}
                  >
                    {m.title}
                  </h3>
                  <div style={{ marginTop: 3 }}>
                    <Badge color={m.statusColor}>{m.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                color: C.td,
                lineHeight: 1.6,
              }}
            >
              {m.desc}
            </p>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 18px",
                fontSize: 11,
                color: C.tm,
                lineHeight: 1.7,
              }}
            >
              {m.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* CTA 하단 */}
      <Card
        style={{
          marginTop: 14,
          padding: 18,
          background: `linear-gradient(135deg, ${C.ac}10, ${C.bl}10)`,
          border: `1px solid ${C.ac}33`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.ac,
            letterSpacing: 2,
            marginBottom: 6,
          }}
        >
          DRY-RUN PILOT
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: C.t,
            marginBottom: 4,
          }}
        >
          파일럿 캠페인 진단 신청
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.td,
            marginBottom: 12,
            lineHeight: 1.6,
          }}
        >
          현재 운영 중인 광고 계정 데이터를 펜타클 팀이 직접 진단해 드립니다.
        </div>
        <a
          href="https://www.vdream.co.kr/inquiry"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "10px 22px",
            borderRadius: 10,
            background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
            color: "#000",
            fontWeight: 900,
            fontSize: 12,
            textDecoration: "none",
          }}
        >
          🚀 파일럿 신청하기
        </a>
      </Card>
    </div>
  );
}
