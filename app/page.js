"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import HomeView from "@/components/HomeView";
import PerformanceLabView from "@/components/PerformanceLabView";
import DiagnosticTab from "@/components/DiagnosticTab";
import ShortformTab from "@/components/ShortformTab";
import IntelligenceTab from "@/components/IntelligenceTab";
import DashboardView from "@/components/DashboardView";
import AssetLibraryView from "@/components/AssetLibraryView";
import DataUpload from "@/components/DataUpload";

const NAV_ITEMS = [
  { key: "performance",   label: "DA 퍼포먼스" },
  { key: "opportunities", label: "콘텐츠 전략" },
  { key: "diagnose",      label: "AI 진단기" },
  { key: "intelligence",  label: "타겟 인텔리전스" },
  { key: "dashboard",     label: "대시보드" },
  { key: "library",       label: "자산 라이브러리" },
  { key: "upload",        label: "📤 데이터 업로드" },
];

const C = {
  bg: "#FFFFFF",
  sf: "#F8FAFC",
  ac: "#00C9A7",
  bl: "#1D85EB",
  t: "#0F172A",
  td: "#334155",
  tm: "#64748B",
  bl2: "#CBD5E1",
};

export default function Home() {
  const [view, setView] = useState("home");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("emp")) {
      setView("diagnose");
    }
  }, []);

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

      <main
        style={{
          flex: 1,
          padding: "0 18px",
          maxWidth: 1080,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {view === "home" && <HomeView onNavigate={navigate} />}

        {view !== "home" && (
          <div
            style={{
              paddingTop: 28,
              paddingBottom: 48,
              maxWidth: 880,
              margin: "0 auto",
            }}
          >
            {view === "performance" && <PerformanceLabView />}
            {view === "opportunities" && <ShortformTab onNavigate={navigate} />}
            {view === "diagnose" && (
              <Suspense fallback={null}>
                <DiagnosticTab />
              </Suspense>
            )}
            {view === "intelligence" && <IntelligenceTab />}
            {view === "dashboard" && <DashboardView />}
            {view === "library" && <AssetLibraryView onNavigate={navigate} />}
            {view === "upload" && <DataUpload />}
          </div>
        )}
      </main>
    </div>
  );
}

function TopNav({ view, onNavigate }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
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
          <div
            style={{
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              lineHeight: 1,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: C.t,
                letterSpacing: -0.3,
              }}
            >
              VDream <span style={{ color: C.ac }}>Growth Engine</span>
            </span>
            <span
              style={{
                fontSize: 9,
                color: C.tm,
                marginTop: 3,
                letterSpacing: 0.5,
              }}
            >
              AI B2B Marketing Platform
            </span>
          </div>
        </button>

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
                  padding: "7px 11px",
                  borderRadius: 8,
                  border: "none",
                  background: active ? `${C.ac}14` : "transparent",
                  color: active ? C.ac : C.td,
                  fontSize: 12,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s ease, background 0.15s ease",
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

        <div style={{ flexShrink: 0 }}>
          <Badge color={C.ac}>by Pentacle</Badge>
        </div>
      </div>
    </header>
  );
}
