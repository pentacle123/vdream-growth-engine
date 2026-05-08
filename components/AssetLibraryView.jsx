"use client";

import Card from "./ui/Card";
import Badge from "./ui/Badge";
import {
  USP_CARDS,
  SUCCESS_CASES,
  REGULATION_GUIDE,
  COMPETITORS,
} from "@/data/brandAssets";

const C = {
  bg: "#050a12",
  sf: "#0c1220",
  sa: "#141d2e",
  sh: "#1a2540",
  ac: "#00C9A7",
  bl: "#1D85EB",
  pp: "#A78BFA",
  am: "#F59E0B",
  rd: "#EF4444",
  gn: "#10B981",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

export default function AssetLibraryView({ onNavigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Hero />
      <USPSection />
      <SuccessCasesSection />
      <RegulationSection onNavigate={onNavigate} />
      <CompetitorSection />
    </div>
  );
}

/* ============================================================
 * Hero
 * ============================================================ */

function Hero() {
  return (
    <div
      style={{
        padding: "18px 22px",
        borderRadius: 14,
        background: `linear-gradient(135deg, ${C.pp}14 0%, ${C.bl}10 100%)`,
        border: `1px solid ${C.pp}33`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: C.pp,
          letterSpacing: 3,
          marginBottom: 4,
        }}
      >
        BRAND ASSET LIBRARY
      </div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.t }}>
        📚 브랜드 자산 라이브러리
      </h2>
      <p style={{ margin: "6px 0 0", fontSize: 12, color: C.td, lineHeight: 1.6 }}>
        브이드림 USP · 성공 사례 · 제도 가이드 · 경쟁사 비교 — 콘텐츠/제안서/세일즈에 즉시 활용
      </p>
    </div>
  );
}

/* ============================================================
 * Section 1: USP 카드 (5)
 * ============================================================ */

function USPSection() {
  return (
    <div>
      <SectionHeader icon="💎" color={C.ac}>
        USP — 5개 핵심 가치제안
      </SectionHeader>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 10,
        }}
      >
        {USP_CARDS.map((u, i) => (
          <Card key={i} style={{ padding: 16, borderColor: `${C.ac}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: `${C.ac}1a`,
                  border: `1px solid ${C.ac}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {u.emoji}
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 800,
                  color: C.t,
                  lineHeight: 1.3,
                }}
              >
                {u.title}
              </h3>
            </div>

            {/* Proof — 강조 */}
            <div
              style={{
                padding: "8px 10px",
                borderRadius: 7,
                background: `${C.ac}0e`,
                border: `1px solid ${C.ac}33`,
                fontSize: 11,
                color: C.ac,
                fontWeight: 600,
                marginBottom: 8,
                lineHeight: 1.5,
              }}
            >
              💡 <strong>{u.proof}</strong>
            </div>

            {/* Detail */}
            <p style={{ margin: "0 0 10px", fontSize: 11, color: C.td, lineHeight: 1.6 }}>
              {u.detail}
            </p>

            {/* Use Cases */}
            <div>
              <div style={{ fontSize: 9, color: C.tm, fontWeight: 700, marginBottom: 5, letterSpacing: 0.5 }}>
                활용처
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {u.useCases.map((uc, j) => (
                  <Badge key={j} color={C.tm} background={C.sh}>
                    {uc}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Section 2: 성공 사례
 * ============================================================ */

function SuccessCasesSection() {
  return (
    <div>
      <SectionHeader icon="🏆" color={C.am}>
        고객 성공 사례 — Before / After
      </SectionHeader>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 10,
        }}
      >
        {SUCCESS_CASES.map((c, i) => (
          <Card key={i} style={{ padding: 16, borderColor: `${c.typeColor}33` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 800,
                  color: C.t,
                }}
              >
                {c.company}
              </h3>
              <Badge color={C.tm} background={C.sh}>
                {c.industry}
              </Badge>
              <Badge color={c.typeColor}>{c.type}</Badge>
            </div>

            {/* Before / After */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                gap: 8,
                alignItems: "stretch",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  padding: "9px 10px",
                  borderRadius: 8,
                  background: `${C.rd}0c`,
                  border: `1px solid ${C.rd}33`,
                }}
              >
                <div style={{ fontSize: 9, color: C.rd, fontWeight: 800, marginBottom: 4, letterSpacing: 1 }}>
                  BEFORE
                </div>
                <div style={{ fontSize: 12, color: C.t, lineHeight: 1.5 }}>{c.before}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 18,
                  color: c.typeColor,
                }}
              >
                →
              </div>
              <div
                style={{
                  padding: "9px 10px",
                  borderRadius: 8,
                  background: `${C.ac}0c`,
                  border: `1px solid ${C.ac}33`,
                }}
              >
                <div style={{ fontSize: 9, color: C.ac, fontWeight: 800, marginBottom: 4, letterSpacing: 1 }}>
                  AFTER
                </div>
                <div style={{ fontSize: 12, color: C.t, lineHeight: 1.5 }}>{c.after}</div>
              </div>
            </div>

            {/* Saving */}
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `linear-gradient(135deg, ${c.typeColor}14, ${c.typeColor}06)`,
                border: `1px solid ${c.typeColor}55`,
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 9, color: c.typeColor, fontWeight: 800, marginBottom: 3, letterSpacing: 1 }}>
                💰 EFFECT
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: c.typeColor,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {c.saving}
              </div>
            </div>

            {/* Detail */}
            <p style={{ margin: 0, fontSize: 11, color: C.td, lineHeight: 1.6 }}>
              {c.detail}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Section 3: 제도 가이드
 * ============================================================ */

function RegulationSection({ onNavigate }) {
  return (
    <div>
      <SectionHeader icon="📜" color={C.bl}>
        제도 가이드 — 6 핵심 항목
      </SectionHeader>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 10,
        }}
      >
        {REGULATION_GUIDE.map((r, i) => (
          <Card key={i} style={{ padding: 14, borderColor: `${C.bl}33` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${C.bl}1a`,
                  border: `1px solid ${C.bl}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {r.icon}
              </div>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.t }}>
                {r.title}
              </h4>
            </div>

            <div
              style={{
                padding: "8px 10px",
                borderRadius: 7,
                background: C.sa,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: C.bl,
                fontWeight: 800,
                marginBottom: 7,
                lineHeight: 1.4,
              }}
            >
              {r.value}
            </div>

            <p style={{ margin: "0 0 9px", fontSize: 11, color: C.td, lineHeight: 1.6 }}>
              {r.note}
            </p>

            <button
              onClick={() => onNavigate && onNavigate("opportunities")}
              style={{
                width: "100%",
                padding: "7px",
                borderRadius: 7,
                border: `1px solid ${C.ac}33`,
                background: `${C.ac}0c`,
                color: C.ac,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              💡 이 제도 숏폼 기회 보기 →
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Section 4: 경쟁사 비교
 * ============================================================ */

function CompetitorSection() {
  return (
    <div>
      <SectionHeader icon="⚔️" color={C.rd}>
        경쟁사 비교 — 브이드림이 압도적 1위
      </SectionHeader>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 11,
              minWidth: 660,
            }}
          >
            <thead>
              <tr style={{ background: C.sh }}>
                <Th>업체</Th>
                <Th align="center">고객사</Th>
                <Th align="center">인재풀</Th>
                <Th align="center">시스템</Th>
                <Th align="center">분쟁률</Th>
                <Th align="center">도입속도</Th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map((c, i) => {
                const hl = c.highlight;
                const rowStyle = hl
                  ? {
                      background: `linear-gradient(90deg, ${C.ac}1a, ${C.bl}0a)`,
                      borderTop: `1px solid ${C.ac}55`,
                    }
                  : {
                      borderTop: `1px solid ${C.bl2}`,
                    };
                return (
                  <tr key={c.name} style={rowStyle}>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {hl && <span style={{ fontSize: 14 }}>👑</span>}
                        <span
                          style={{
                            color: hl ? C.ac : C.t,
                            fontWeight: hl ? 900 : 700,
                            fontSize: hl ? 13 : 12,
                          }}
                        >
                          {c.name}
                        </span>
                        {hl && <Badge color={C.ac}>1위</Badge>}
                      </div>
                    </Td>
                    <Td align="center">
                      <CellValue value={c.customers} hl={hl} />
                    </Td>
                    <Td align="center">
                      <CellValue value={c.pool} hl={hl} />
                    </Td>
                    <Td align="center">
                      <CellValue value={c.system} hl={hl} />
                    </Td>
                    <Td align="center">
                      <CellValue value={c.dispute} hl={hl} highlightZero />
                    </Td>
                    <Td align="center">
                      <CellValue value={c.speed} hl={hl} />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div
        style={{
          marginTop: 10,
          padding: "10px 12px",
          borderRadius: 8,
          background: `${C.ac}0c`,
          border: `1px solid ${C.ac}33`,
          fontSize: 11,
          color: C.td,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: C.ac }}>👑 브이드림 우위:</strong> 고객사·인재풀·시스템·분쟁률·속도 5개 항목 모두 1위.
        특히 자체 개발 플립 시스템과 분쟁률 0%는 경쟁사가 따라올 수 없는 트랙레코드.
      </div>
    </div>
  );
}

/* ============================================================
 * 보조
 * ============================================================ */

function SectionHeader({ icon, color, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        marginBottom: 10,
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color }}>
        {children}
      </h3>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      style={{
        padding: "10px 12px",
        textAlign: align,
        fontSize: 10,
        color: C.tm,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return <td style={{ padding: "10px 12px", textAlign: align }}>{children}</td>;
}

function CellValue({ value, hl, highlightZero }) {
  const isZero = String(value).trim() === "0%" || String(value).trim() === "0건";
  const color = hl ? (highlightZero && isZero ? C.ac : C.t) : C.td;
  return (
    <span
      style={{
        fontSize: hl ? 12 : 11,
        fontWeight: hl ? 800 : 600,
        color,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {value}
    </span>
  );
}
