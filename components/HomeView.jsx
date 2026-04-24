"use client";

import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { OPPORTUNITIES } from "@/data/opportunities";
import { TARGET_COMPANIES, computeROI } from "@/data/targetCompanies";

const C = {
  bg: "#060b14",
  sf: "#0f1623",
  sa: "#141d2e",
  ac: "#36CFBA",
  bl: "#1D85EB",
  pp: "#A78BFA",
  wn: "#F59E0B",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

// 3 기능 카드 정의 — 스펙대로 좌측 액센트 바 컬러 유지
const FEATURES = [
  {
    key: "opportunities",
    icon: "🔍",
    accent: "#00C9A7",
    emojiGroup: ["💰", "🏠", "⚡", "🛡️", "📋", "🏆"],
    title: "기회 발견 & 콘텐츠 전략",
    description:
      "브이드림 USP · 제도 상황 · 숨겨진 관심사에서 출발한 숏폼 기회를 발견하고 AI가 스크립트까지 생성합니다.",
    stats: ["18개 기회", "연간 57,000회+ 검색"],
    previews: [
      { emoji: "💰", title: "부담금보다 싸다", desc: "비용 비교 충격형" },
      { emoji: "📅", title: "1월 신고 공포", desc: "시즌 긴급형 콘텐츠" },
      { emoji: "📢", title: "명단 공표 리스크", desc: "CEO 위기형 후킹" },
    ],
    cta: "기회 보기",
  },
  {
    key: "diagnose",
    icon: "🏥",
    accent: "#1D85EB",
    emojiGroup: ["🏥", "📊", "🤖", "📋", "💡"],
    title: "AI 고용부담금 진단기",
    description:
      "기업 정보 입력 → 부담금·절감·맞춤직무·경영진 리포트까지 Claude API가 실시간 분석합니다.",
    stats: ["실시간 AI 분석", "Claude API 연동"],
    previews: [
      { emoji: "📊", title: "부담금 즉시 산출", desc: "업종별 벤치마크 비교" },
      { emoji: "🤖", title: "AI 맞춤 직무 추천", desc: "업종별 재택 직무 5선" },
      { emoji: "📋", title: "경영진 보고 리포트", desc: "PDF 출력 + 공유 링크" },
    ],
    cta: "진단 시작",
  },
  {
    key: "intelligence",
    icon: "🎯",
    accent: "#A78BFA",
    emojiGroup: ["🎯", "📋", "🤖", "📧", "🏆"],
    title: "타겟 기업 인텔리전스",
    description:
      "고용노동부 공표 불이행 기업 → AI 우선순위 → 맞춤 제안서 → 이메일·링크드인·카톡 메시지까지 자동화.",
    stats: [], // 동적 계산
    previews: [
      { emoji: "📋", title: "불이행 기업 DB", desc: "AI 우선순위 + 파이프라인" },
      { emoji: "🤖", title: "맞춤 제안서 생성", desc: "ROI 차트 + 1페이지 자동 작성" },
      { emoji: "📧", title: "3채널 아웃바운드", desc: "이메일·링크드인·카카오톡" },
    ],
    cta: "인텔리전스 보기",
  },
];

export default function HomeView({ onNavigate }) {
  // 동적 통계
  const totalPenalty = TARGET_COMPANIES.reduce(
    (acc, c) => acc + c.estimatedPenalty,
    0
  );
  const totalPenaltyText = `${Math.round(totalPenalty / 1e8).toLocaleString("ko-KR")}억원+`;

  // intelligence 카드 stats 동적 주입
  const features = FEATURES.map((f) => {
    if (f.key === "intelligence") {
      return {
        ...f,
        stats: [`${TARGET_COMPANIES.length}개 타겟 기업`, `총 부담금 ${totalPenaltyText}`],
      };
    }
    return f;
  });

  return (
    <div>
      {/* ============================================================
       * HERO
       * ============================================================ */}
      <section
        style={{
          padding: "72px 20px 56px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* 백그라운드 글로우 장식 */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 580,
            height: 380,
            background: `radial-gradient(ellipse, ${C.ac}0c 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 80,
            right: "12%",
            width: 220,
            height: 220,
            background: `radial-gradient(circle, ${C.bl}12 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 140,
            left: "12%",
            width: 180,
            height: 180,
            background: `radial-gradient(circle, ${C.pp}14 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: C.ac,
              letterSpacing: 4,
              marginBottom: 14,
            }}
          >
            VDREAM × PENTACLE
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(36px, 6.4vw, 58px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -1.2,
              background: `linear-gradient(135deg, ${C.ac} 0%, ${C.bl} 55%, ${C.pp} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Growth Engine
          </h1>

          <p
            style={{
              fontSize: 15,
              color: C.td,
              maxWidth: 640,
              margin: "22px auto 26px",
              lineHeight: 1.75,
              fontWeight: 400,
            }}
          >
            장애인 고용의 숨겨진 기회를 발견하고, AI가 콘텐츠와 영업을 자동화하는 B2B 마케팅
            플랫폼. 소비자 검색 데이터에서 출발해 숏폼 콘텐츠를 기획하고, 타겟 기업에 자동으로
            제안합니다.
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <HeroStat icon="🔍" label="전체 기회" value={`${OPPORTUNITIES.length}개`} color={C.ac} />
            <HeroStat icon="📡" label="연간 검색량" value="57,000회+" color={C.bl} />
            <HeroStat icon="🎯" label="타겟 기업" value={`${TARGET_COMPANIES.length}개`} color={C.pp} />
          </div>
        </div>
      </section>

      {/* ============================================================
       * 3 FEATURE CARDS
       * ============================================================ */}
      <section style={{ padding: "0 0 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {features.map((f) => (
            <FeatureCard key={f.key} feature={f} onClick={() => onNavigate(f.key)} />
          ))}
        </div>
      </section>

      {/* ============================================================
       * FOOTER BAR
       * ============================================================ */}
      <footer
        style={{
          textAlign: "center",
          padding: "32px 20px 40px",
          borderTop: `1px solid ${C.bl2}`,
          marginTop: 32,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: C.tm,
            letterSpacing: 4,
          }}
        >
          PENTACLE × AI &nbsp;·&nbsp; ALGORITHM PERFORMANCE PLATFORM
        </div>
        <div
          style={{
            fontSize: 10,
            color: C.tm,
            marginTop: 6,
            opacity: 0.6,
          }}
        >
          © 2026 Pentacle · Powered by Claude API · VDream Brandformance Engine
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
 * HERO STAT PILL
 * ============================================================ */

function HeroStat({ icon, label, value, color }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "8px 14px",
        borderRadius: 999,
        background: `${color}0f`,
        border: `1px solid ${color}33`,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{ fontSize: 11, color: C.td, fontWeight: 600 }}>{label}</span>
      <span
        style={{
          fontSize: 13,
          color,
          fontWeight: 800,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
 * FEATURE CARD
 * ============================================================ */

function FeatureCard({ feature, onClick }) {
  const { icon, accent, emojiGroup, title, description, stats, previews, cta } = feature;

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: 18,
        background: `linear-gradient(180deg, ${C.sf} 0%, ${C.bg} 100%)`,
        border: `1px solid ${accent}22`,
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 14px 30px ${accent}26`;
        e.currentTarget.style.borderColor = `${accent}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = `${accent}22`;
      }}
    >
      {/* 좌측 액센트 바 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 22,
          bottom: 22,
          width: 4,
          background: `linear-gradient(180deg, ${accent}, ${accent}44)`,
          borderRadius: "0 4px 4px 0",
        }}
      />

      <div style={{ padding: "22px 20px 20px 26px" }}>
        {/* 이모지 그룹 */}
        <div
          style={{
            display: "flex",
            gap: 3,
            marginBottom: 14,
            fontSize: 18,
            letterSpacing: 2,
            opacity: 0.95,
          }}
        >
          {emojiGroup.map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>

        {/* 타이틀 */}
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 900,
            color: C.t,
            lineHeight: 1.3,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 20 }}>{icon}</span>
          {title}
        </h3>

        {/* 설명 */}
        <p
          style={{
            margin: "8px 0 12px",
            fontSize: 12,
            color: C.td,
            lineHeight: 1.65,
          }}
        >
          {description}
        </p>

        {/* 통계 뱃지 */}
        {stats.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 5,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            {stats.map((s, i) => (
              <span
                key={i}
                style={{
                  padding: "3px 9px",
                  borderRadius: 999,
                  background: `${accent}14`,
                  border: `1px solid ${accent}33`,
                  fontSize: 10,
                  color: accent,
                  fontWeight: 700,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* 미리보기 3개 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {previews.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "7px 9px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.025)",
                border: `1px solid rgba(255,255,255,0.03)`,
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{p.emoji}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.t,
                    lineHeight: 1.3,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.tm,
                    lineHeight: 1.4,
                    marginTop: 1,
                  }}
                >
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 10,
            border: `1px solid ${accent}55`,
            background: `${accent}12`,
            color: accent,
            fontSize: 13,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "background 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${accent}22`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${accent}12`;
          }}
        >
          {cta}
          <span style={{ fontSize: 14 }}>→</span>
        </button>
      </div>
    </div>
  );
}
