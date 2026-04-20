"use client";

import Card from "./ui/Card";
import ProgressBar from "./ui/ProgressBar";
import { CALENDAR, FUNNEL_STAGES } from "@/data/calendar";

const C = {
  sa: "#141d2e",
  ac: "#36CFBA",
  bl: "#1D85EB",
  wn: "#F59E0B",
  rd: "#EF4444",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

function intensityColor(i) {
  if (i >= 90) return C.rd;
  if (i >= 70) return C.wn;
  return C.ac;
}

export default function CalendarTab() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: C.t, margin: 0 }}>
          📅 연간 캠페인 캘린더
        </h2>
        <p style={{ fontSize: 12, color: C.td, margin: "5px 0 0" }}>
          시즌별 숏폼·광고 스케줄 — 10~1월 골든타임 집중
        </p>
      </div>

      {/* 전환 퍼널 */}
      <Card style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ac, margin: "0 0 12px" }}>
          🔄 전환 퍼널
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {FUNNEL_STAGES.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: `${s.color}1a`,
                    border: `2px solid ${s.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {s.icon}
                </div>
                {i < FUNNEL_STAGES.length - 1 && (
                  <div
                    style={{
                      width: 14,
                      height: 2,
                      background: C.bl2,
                      margin: "0 -1px",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: C.td,
                  marginTop: 5,
                  fontWeight: 600,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 월별 인텐시티 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {CALENDAR.map((m, i) => {
          const color = intensityColor(m.intensity);
          return (
            <Card key={i} style={{ padding: "11px 13px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 54, textAlign: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: C.t,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {m.month}
                  </div>
                  <div style={{ fontSize: 14, marginTop: 1 }}>{m.phase}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.t }}>
                      {m.label}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        fontFamily: "'JetBrains Mono', monospace",
                        color,
                      }}
                    >
                      {m.intensity}%
                    </span>
                  </div>
                  <ProgressBar value={m.intensity} color={color} height={4} />
                  <div style={{ fontSize: 10, color: C.td, marginTop: 5 }}>
                    {m.action}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 핵심 인사이트 */}
      <Card
        style={{
          marginTop: 14,
          background: `linear-gradient(135deg, ${C.wn}06, ${C.rd}06)`,
          border: `1px solid ${C.wn}22`,
        }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.wn, margin: "0 0 6px" }}>
          🔑 핵심 인사이트
        </h3>
        <div style={{ fontSize: 12, color: C.td, lineHeight: 1.7 }}>
          <strong style={{ color: C.rd }}>10~1월 골든타임.</strong> 숏폼 광고 예산{" "}
          <strong style={{ color: C.ac }}>60% 집중 투하.</strong> 모든 CTA →{" "}
          <strong style={{ color: C.ac }}>AI 진단기(TAB 1)</strong>로 수렴.
        </div>
      </Card>
    </div>
  );
}
