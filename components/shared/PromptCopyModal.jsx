"use client";

import { useState, useEffect } from "react";
import Spinner from "../ui/Spinner";

const C = {
  bg: "#FFFFFF",
  sf: "#F8FAFC",
  sa: "#F1F5F9",
  ac: "#00C9A7",
  bl: "#1D85EB",
  pp: "#A78BFA",
  am: "#F59E0B",
  rd: "#EF4444",
  t: "#0F172A",
  td: "#334155",
  tm: "#64748B",
  border: "#E2E8F0",
};

/**
 * 디자인 프롬프트 복사 모달
 *
 * Props:
 *   open: boolean
 *   onClose: () => void
 *   title: string
 *   loading: boolean
 *   tabs: [{ key, label, content, lang?: "en"|"ko" }]
 */
export default function PromptCopyModal({ open, onClose, title, loading, tabs = [] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (open && tabs[0]) setActive(tabs[0].key);
  }, [open, tabs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const activeTab = tabs.find((t) => t.key === active) || tabs[0];

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("복사하세요:", text);
    }
  };

  const copyAll = () => {
    const all = tabs
      .map((t) => `[${t.label}]\n${t.content || ""}`)
      .join("\n\n---\n\n");
    copy(all, "__all");
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg,
          width: "100%",
          maxWidth: 760,
          maxHeight: "90vh",
          borderRadius: 16,
          border: `1px solid ${C.border}`,
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.18)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: C.ac,
                letterSpacing: 2,
                marginBottom: 2,
              }}
            >
              🎨 EXTERNAL DESIGN PROMPTS
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.t }}>
              {title || "디자인 프롬프트"}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: C.bg,
              color: C.tm,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* 탭 */}
        {tabs.length > 0 && !loading && (
          <div
            style={{
              display: "flex",
              gap: 4,
              padding: "10px 14px 0",
              borderBottom: `1px solid ${C.border}`,
              overflowX: "auto",
            }}
          >
            {tabs.map((t) => {
              const on = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px 8px 0 0",
                    border: "none",
                    borderBottom: on ? `2px solid ${C.ac}` : "2px solid transparent",
                    background: on ? `${C.ac}10` : "transparent",
                    color: on ? C.ac : C.tm,
                    fontSize: 12,
                    fontWeight: on ? 800 : 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 본문 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 18,
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "60px 20px",
                textAlign: "center",
                color: C.tm,
              }}
            >
              <Spinner color={C.ac} size={28} />
              <div style={{ marginTop: 14, fontSize: 13 }}>
                Claude가 디자인 프롬프트를 생성 중...
              </div>
            </div>
          ) : activeTab ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: C.tm,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                  }}
                >
                  {activeTab.lang === "en" ? "ENGLISH" : "한글"}
                  {" · "}
                  {(activeTab.content || "").length.toLocaleString("ko-KR")}자
                </div>
                <button
                  onClick={() => copy(activeTab.content || "", activeTab.key)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 7,
                    border: `1px solid ${copied === activeTab.key ? C.ac : C.border}`,
                    background: copied === activeTab.key ? `${C.ac}14` : C.bg,
                    color: copied === activeTab.key ? C.ac : C.td,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {copied === activeTab.key ? "✅ 복사됨" : "📋 복사"}
                </button>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: 14,
                  borderRadius: 10,
                  background: C.sf,
                  border: `1px solid ${C.border}`,
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: C.t,
                  fontFamily:
                    activeTab.lang === "en"
                      ? "'JetBrains Mono', monospace"
                      : "'Noto Sans KR', sans-serif",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  maxHeight: "55vh",
                  overflowY: "auto",
                }}
              >
                {activeTab.content || "(내용 없음)"}
              </pre>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: "center", color: C.tm, fontSize: 13 }}>
              표시할 프롬프트가 없습니다.
            </div>
          )}
        </div>

        {/* 하단: 전체 복사 */}
        {!loading && tabs.length > 1 && (
          <div
            style={{
              padding: "12px 18px",
              borderTop: `1px solid ${C.border}`,
              background: C.sf,
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              onClick={copyAll}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {copied === "__all" ? "✅ 전체 복사됨" : "📋 전체 복사"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
