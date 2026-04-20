"use client";

import { useState } from "react";
import TabButton from "@/components/ui/TabButton";
import Badge from "@/components/ui/Badge";
import DiagnosticTab from "@/components/DiagnosticTab";
import ShortformTab from "@/components/ShortformTab";
import CreatorTab from "@/components/CreatorTab";
import CalendarTab from "@/components/CalendarTab";

const TABS = [
  { icon: "🏥", label: "AI 진단기" },
  { icon: "🎬", label: "숏폼 전략" },
  { icon: "🤝", label: "크리에이터" },
  { icon: "📅", label: "캘린더" },
  { icon: "📡", label: "검색데이터" },
];

function ComingSoon({ icon, label }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        color: "#64748B",
      }}
    >
      <div style={{ fontSize: 42, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#94A3B8", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 12 }}>다음 단계에서 빌드 예정 탭입니다.</div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "#060b14", color: "#E2E8F0" }}>
      {/* 헤더 */}
      <div
        style={{
          padding: "14px 18px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "linear-gradient(180deg, #141d2e 0%, #060b14 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #36CFBA, #1D85EB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 900,
                color: "#000",
              }}
            >
              V
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 900, letterSpacing: -0.5 }}>
                VDream <span style={{ color: "#36CFBA" }}>Growth Engine</span>
              </h1>
              <div style={{ fontSize: 10, color: "#64748B" }}>
                AI-Powered B2B Marketing Platform v2.0
              </div>
            </div>
          </div>
          <Badge>by Pentacle</Badge>
        </div>
      </div>

      {/* 탭바 */}
      <div
        style={{
          padding: "9px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            minWidth: "max-content",
            margin: "0 auto",
          }}
        >
          {TABS.map((t, i) => (
            <TabButton
              key={i}
              icon={t.icon}
              label={t.label}
              active={tab === i}
              onClick={() => setTab(i)}
            />
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div style={{ padding: 18, maxWidth: 860, margin: "0 auto" }}>
        {tab === 0 && <DiagnosticTab />}
        {tab === 1 && <ShortformTab />}
        {tab === 2 && <CreatorTab />}
        {tab === 3 && <CalendarTab />}
        {tab === 4 && <ComingSoon icon="📡" label="검색 데이터 분석" />}
      </div>
    </div>
  );
}
