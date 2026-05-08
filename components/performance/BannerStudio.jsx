"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";

const C = {
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
  bl2: "#CBD5E1",
};

const SIZES = [
  { key: "naver_h", platform: "네이버 DA", label: "320×100", w: 320, h: 100 },
  { key: "naver_s", platform: "네이버 DA", label: "300×250", w: 300, h: 250 },
  { key: "meta_sq", platform: "메타", label: "1080×1080", w: 1080, h: 1080 },
  { key: "meta_ld", platform: "메타", label: "1200×628", w: 1200, h: 628 },
  { key: "linkedin", platform: "링크드인", label: "1200×627", w: 1200, h: 627 },
  { key: "youtube", platform: "유튜브", label: "1280×720", w: 1280, h: 720 },
];

export default function BannerStudio() {
  const [size, setSize] = useState(SIZES[1]);
  const [headline, setHeadline] = useState("고용부담금 0원으로 만들기");
  const [subCopy, setSubCopy] = useState("재택근무 기반 장애인 고용 솔루션");
  const [cta, setCta] = useState("무료 진단받기");
  const [theme, setTheme] = useState("dark"); // dark | light | both
  const [output, setOutput] = useState(null);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          width: size.w,
          height: size.h,
          headline,
          subCopy,
          cta,
        }),
      });
      const data = await res.json();
      setOutput(data);
      setFallback(!!data.fallback);
    } catch {
      setOutput({ dark: "<div>네트워크 오류</div>", light: "<div>네트워크 오류</div>" });
      setFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const copyHtml = async (html, key) => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("복사하세요:", html);
    }
  };

  return (
    <div>
      {/* 사이즈 그리드 */}
      <Card style={{ padding: 14, marginBottom: 12 }}>
        <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: C.bl, letterSpacing: 1 }}>
          📐 사이즈 선택
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 6,
          }}
        >
          {SIZES.map((s) => {
            const active = size.key === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSize(s)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 8,
                  border: active ? `2px solid ${C.ac}` : `1px solid ${C.bl2}`,
                  background: active ? `${C.ac}14` : C.sa,
                  color: active ? C.ac : C.t,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 10, color: C.tm, fontWeight: 600 }}>{s.platform}</div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 800,
                    color: active ? C.ac : C.t,
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 입력 */}
      <Card style={{ padding: 14, marginBottom: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <div>
            <Label>📝 헤드라인</Label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={50}
              style={inputStyle}
            />
          </div>
          <div>
            <Label>💬 서브카피 (선택)</Label>
            <input
              type="text"
              value={subCopy}
              onChange={(e) => setSubCopy(e.target.value)}
              maxLength={80}
              style={inputStyle}
            />
          </div>
          <div>
            <Label>🎯 CTA 문구</Label>
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              maxLength={20}
              style={inputStyle}
            />
          </div>
          <div>
            <Label>🎨 표시 테마</Label>
            <div style={{ display: "flex", gap: 5 }}>
              {[
                { key: "dark", label: "다크" },
                { key: "light", label: "라이트" },
                { key: "both", label: "둘 다" },
              ].map((t) => (
                <Pill key={t.key} active={theme === t.key} onClick={() => setTheme(t.key)} color={C.am}>
                  {t.label}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !headline}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            border: "none",
            background: !headline ? C.sa : `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
            color: !headline ? C.tm : "#000",
            fontSize: 13,
            fontWeight: 900,
            cursor: loading ? "wait" : !headline ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
          }}
        >
          {loading ? <Spinner color="#000" /> : "🤖"}{" "}
          {loading ? "Claude가 배너 생성 중 (다크+라이트)..." : `🤖 ${size.label} 배너 생성`}
        </button>
      </Card>

      {/* 프리뷰 */}
      {output && (
        <div>
          {fallback && (
            <div style={{ padding: "8px 12px", borderRadius: 8, background: `${C.am}10`, border: `1px solid ${C.am}33`, color: C.am, fontSize: 11, marginBottom: 10 }}>
              ⚠ 샘플 배너 (API 오류 또는 키 미설정)
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                theme === "both" ? "1fr 1fr" : "1fr",
              gap: 10,
            }}
          >
            {(theme === "dark" || theme === "both") && (
              <BannerPreview
                title="🌑 Dark"
                size={size}
                html={output.dark}
                copied={copied === "dark"}
                onCopy={() => copyHtml(output.dark, "dark")}
              />
            )}
            {(theme === "light" || theme === "both") && (
              <BannerPreview
                title="☀️ Light"
                size={size}
                html={output.light}
                copied={copied === "light"}
                onCopy={() => copyHtml(output.light, "light")}
              />
            )}
          </div>
          <button
            onClick={generate}
            disabled={loading}
            style={{
              marginTop: 10,
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${C.bl2}`,
              background: "transparent",
              color: C.td,
              fontSize: 12,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            🔄 다시 생성
          </button>
        </div>
      )}
    </div>
  );
}

function BannerPreview({ title, size, html, copied, onCopy }) {
  // 컨테이너 폭에 맞춰 자동 스케일
  const maxPreviewW = 480;
  const scale = size.w > maxPreviewW ? maxPreviewW / size.w : 1;
  const scaledW = size.w * scale;
  const scaledH = size.h * scale;

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "8px 12px",
          borderBottom: `1px solid ${C.bl2}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 800, color: C.t }}>{title}</span>
        <span
          style={{
            fontSize: 10,
            color: C.tm,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {size.platform} · {size.label}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={onCopy}
          style={{
            padding: "4px 8px",
            borderRadius: 5,
            border: `1px solid ${copied ? C.ac : C.bl2}`,
            background: copied ? `${C.ac}14` : "transparent",
            color: copied ? C.ac : C.td,
            fontSize: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {copied ? "✅" : "📋 HTML"}
        </button>
      </div>
      <div
        style={{
          padding: 14,
          background:
            "repeating-conic-gradient(#E2E8F0 0% 25%, #F8FAFC 0% 50%) 50% / 16px 16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: scaledH + 28,
        }}
      >
        <div
          style={{
            width: scaledW,
            height: scaledH,
            transform: scale === 1 ? "none" : `scale(1)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <iframe
            title={title}
            srcDoc={`<!doctype html><html><head><meta charset="utf-8"/></head><body style="margin:0;padding:0;">${html || ""}</body></html>`}
            style={{
              width: size.w,
              height: size.h,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: "none",
              background: "transparent",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </Card>
  );
}

function Label({ children }) {
  return (
    <label style={{ display: "block", fontSize: 10, color: C.td, fontWeight: 700, marginBottom: 5, letterSpacing: 0.5 }}>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 8,
  border: `1px solid ${C.bl2}`,
  background: C.sa,
  color: C.t,
  fontSize: 12,
  outline: "none",
  boxSizing: "border-box",
};

function Pill({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 11px",
        borderRadius: 999,
        border: active ? `1px solid ${color}` : `1px solid ${C.bl2}`,
        background: active ? `${color}22` : "transparent",
        color: active ? color : C.td,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
