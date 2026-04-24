"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import HomeView from "@/components/HomeView";
import DiagnosticTab from "@/components/DiagnosticTab";
import ShortformTab from "@/components/ShortformTab";
import CalendarTab from "@/components/CalendarTab";
import SearchDataTab from "@/components/SearchDataTab";
import IntelligenceTab from "@/components/IntelligenceTab";

const NAV_ITEMS = [
  { key: "opportunities", label: "기회 발견" },
  { key: "diagnose",      label: "AI 진단기" },
  { key: "intelligence",  label: "타겟 인텔리전스" },
  { key: "calendar",      label: "캠페인 캘린더" },
  { key: "search",        label: "검색 데이터" },
];

const C = {
  bg: "#060b14",
  sf: "#0f1623",
  sa: "#141d2e",
  ac: "#36CFBA",
  bl: "#1D85EB",
  pp: "#A78BFA",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

export default function Home() {
  const [view, setView] = useState("home");

  // 공유 링크(?emp=...)로 진입하면 자동으로 진단기 뷰로
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("emp")) {
      setView("diagnose");
    }
  }, []);

  // 뷰 전환 시 스크롤 맨 위로 (홈 제외)
  const navigate = useCallback((next) => {
    setView(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.t,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopNav view={view} onNavigate={navigate} />

      <main style={{ flex: 1, padding: "0 18px", maxWidth: 980, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {view === "home" && <HomeView onNavigate={navigate} />}

        {view !== "home" && (
          <div style={{ paddingTop: 28, paddingBottom: 48, maxWidth: 860, margin: "0 auto" }}>
            {view === "opportunities" && <ShortformTab onNavigate={navigate} />}
            {view === "diagnose" && (
              <Suspense fallback={null}>
                <DiagnosticTab />
              </Suspense>
            )}
            {view === "intelligence" && <IntelligenceTab />}
            {view === "calendar" && <CalendarTab />}
            {view === "search" && <SearchDataTab />}
          </div>
        )}
      </main>
    </div>
  );
}

/* ============================================================
 * Sticky 상단 네비게이션
 * ============================================================ */

function TopNav({ view, onNavigate }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(6, 11, 20, 0.78)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `1px solid ${C.bl2}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* 로고 */}
        <button
          onClick={() => onNavigate("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 900,
              color: "#000",
            }}
          >
            V
          </div>
          <div style={{ textAlign: "left", display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: C.t, letterSpacing: -0.3 }}>
              VDream <span style={{ color: C.ac }}>Growth Engine</span>
            </span>
            <span style={{ fontSize: 9, color: C.tm, marginTop: 3, letterSpacing: 0.5 }}>
              AI B2B Marketing Platform
            </span>
          </div>
        </button>

        {/* 네비 (중앙) */}
        <nav
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            overflowX: "auto",
            minWidth: 0,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: active ? `${C.ac}14` : "transparent",
                  color: active ? C.ac : C.td,
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.color = C.t;
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.color = C.td;
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 우측 배지 */}
        <div style={{ flexShrink: 0 }}>
          <Badge color={C.ac}>by Pentacle</Badge>
        </div>
      </div>
    </header>
  );
}
