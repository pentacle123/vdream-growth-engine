"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";
import { KEYWORD_STRATEGY } from "@/data/keywordStrategy";
import { USP_MATRIX, TONE_OPTIONS, TARGET_OPTIONS } from "@/data/uspMatrix";

const C = {
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

const PRESETS = [
  {
    key: "bdgt",
    label: "고용부담금 검색자용",
    icon: "💰",
    keyword: "장애인 고용부담금",
    target: "hr",
    usps: ["💰 부담금 절감", "🏠 재택근무"],
    tone: "info",
  },
  {
    key: "hire",
    label: "장애인 채용 검색자용",
    icon: "🤝",
    keyword: "장애인 채용",
    target: "hr",
    usps: ["🏠 재택근무", "📋 플립 시스템", "🛡️ 분쟁률 0%"],
    tone: "empathy",
  },
  {
    key: "esg",
    label: "ESG 검색자용",
    icon: "🌱",
    keyword: "ESG 장애인 고용",
    target: "ceo",
    usps: ["🏆 시장 1위", "🛡️ 분쟁률 0%"],
    tone: "info",
  },
];

export default function LandingBuilder() {
  const [keyword, setKeyword] = useState(KEYWORD_STRATEGY[0].kw);
  const [target, setTarget] = useState("hr");
  const [usps, setUsps] = useState(["💰 부담금 절감"]);
  const [tone, setTone] = useState("info");
  const [html, setHtml] = useState(null);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState("desktop");
  const [copied, setCopied] = useState(null);

  const applyPreset = (p) => {
    setKeyword(p.keyword);
    setTarget(p.target);
    setUsps(p.usps);
    setTone(p.tone);
  };

  const toggleUsp = (u) => {
    setUsps((prev) =>
      prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]
    );
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, target, usps, tone }),
      });
      const data = await res.json();
      setHtml(data.html);
      setFallback(!!data.fallback);
    } catch {
      setHtml("<p style='color:red'>네트워크 오류</p>");
      setFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const copyHtml = async (key) => {
    if (!html) return;
    try {
      await navigator.clipboard.writeText(html);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("복사하세요:", html);
    }
  };

  const copyReact = async () => {
    if (!html) return;
    const wrapped = `export default function LandingPage() {\n  return (\n    <div dangerouslySetInnerHTML={{ __html: \`${html.replace(/`/g, "\\`")}\` }} />\n  );\n}`;
    try {
      await navigator.clipboard.writeText(wrapped);
      setCopied("react");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("복사하세요:", wrapped);
    }
  };

  return (
    <div>
      {/* 프리셋 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p)}
            style={{
              flex: 1,
              minWidth: 180,
              padding: "10px 12px",
              borderRadius: 10,
              border: `1px solid ${C.ac}33`,
              background: `${C.ac}0c`,
              color: C.t,
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span style={{ fontSize: 16 }}>{p.icon}</span>
            <span style={{ flex: 1, textAlign: "left" }}>
              <div>{p.label}</div>
              <div style={{ fontSize: 10, color: C.tm, fontWeight: 500, marginTop: 1 }}>
                프리셋 적용 →
              </div>
            </span>
          </button>
        ))}
      </div>

      {/* 좌(입력) + 우(프리뷰) 30/70 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(240px, 1fr) 2fr",
          gap: 10,
          alignItems: "start",
        }}
      >
        {/* 입력 */}
        <Card style={{ padding: 14 }}>
          <h4 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: C.bl, letterSpacing: 1 }}>
            ⚙️ 페이지 설정
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <Label>키워드 그룹</Label>
              <select value={keyword} onChange={(e) => setKeyword(e.target.value)} style={inputStyle}>
                {KEYWORD_STRATEGY.map((k) => (
                  <option key={k.kw} value={k.kw}>{k.kw}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>타겟 페르소나</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {TARGET_OPTIONS.map((t) => (
                  <Pill key={t.key} active={target === t.key} onClick={() => setTarget(t.key)} color={C.bl}>
                    {t.emoji} {t.label}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <Label>USP 강조 (복수)</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {USP_MATRIX.usps.map((u) => (
                  <Pill key={u} active={usps.includes(u)} onClick={() => toggleUsp(u)} color={C.ac}>
                    {u}
                  </Pill>
                ))}
              </div>
            </div>
            <div>
              <Label>헤드라인 톤</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {TONE_OPTIONS.map((t) => (
                  <Pill key={t.key} active={tone === t.key} onClick={() => setTone(t.key)} color={C.am}>
                    {t.label}
                  </Pill>
                ))}
              </div>
            </div>
            <button
              onClick={generate}
              disabled={loading}
              style={{
                padding: "12px",
                borderRadius: 10,
                border: "none",
                background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
                color: "#000",
                fontSize: 13,
                fontWeight: 900,
                cursor: loading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              {loading ? <Spinner color="#000" /> : "🤖"}{" "}
              {loading ? "랜딩 생성 중..." : "🤖 랜딩 생성"}
            </button>
          </div>
        </Card>

        {/* 프리뷰 */}
        <Card style={{ padding: 0, overflow: "hidden", minHeight: 460 }}>
          <div
            style={{
              padding: "10px 14px",
              borderBottom: `1px solid ${C.bl2}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <h4 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.ac, letterSpacing: 1 }}>
              🖥️ 프리뷰
            </h4>
            {fallback && (
              <span style={{ fontSize: 10, color: C.am, fontWeight: 600 }}>
                (샘플 — API 오류)
              </span>
            )}
            <div style={{ flex: 1 }} />
            <DeviceToggle device={device} setDevice={setDevice} />
          </div>

          <div
            style={{
              padding: 14,
              background: "#000",
              display: "flex",
              justifyContent: "center",
              minHeight: 400,
            }}
          >
            {!html ? (
              <div
                style={{
                  fontSize: 12,
                  color: C.tm,
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                좌측에서 설정 후 "랜딩 생성" 버튼을 누르세요.
              </div>
            ) : (
              <iframe
                title="landing-preview"
                srcDoc={html}
                style={{
                  width: device === "mobile" ? 375 : "100%",
                  maxWidth: device === "mobile" ? 375 : "100%",
                  height: 600,
                  border: `1px solid ${C.bl2}`,
                  borderRadius: 8,
                  background: "#fff",
                  transition: "width 0.3s ease",
                }}
              />
            )}
          </div>

          {html && (
            <div
              style={{
                padding: "10px 14px",
                borderTop: `1px solid ${C.bl2}`,
                display: "flex",
                gap: 6,
              }}
            >
              <button
                onClick={() => copyHtml("html")}
                style={btnStyle(copied === "html", C.ac)}
              >
                {copied === "html" ? "✅ HTML 복사됨" : "📋 HTML 복사"}
              </button>
              <button onClick={copyReact} style={btnStyle(copied === "react", C.bl)}>
                {copied === "react" ? "✅ React 복사됨" : "⚛️ React 복사"}
              </button>
              <button onClick={generate} style={btnStyle(false, C.tm)} disabled={loading}>
                🔄 다시 생성
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function DeviceToggle({ device, setDevice }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[
        { key: "desktop", label: "🖥️ Desktop" },
        { key: "mobile", label: "📱 Mobile" },
      ].map((d) => {
        const active = device === d.key;
        return (
          <button
            key={d.key}
            onClick={() => setDevice(d.key)}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border: active ? `1px solid ${C.ac}55` : `1px solid ${C.bl2}`,
              background: active ? `${C.ac}14` : "transparent",
              color: active ? C.ac : C.td,
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {d.label}
          </button>
        );
      })}
    </div>
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
  padding: "8px 10px",
  borderRadius: 7,
  border: `1px solid ${C.bl2}`,
  background: C.sa,
  color: C.t,
  fontSize: 11,
  outline: "none",
  boxSizing: "border-box",
};

function Pill({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: active ? `1px solid ${color}` : `1px solid ${C.bl2}`,
        background: active ? `${color}22` : "transparent",
        color: active ? color : C.td,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {children}
    </button>
  );
}

function btnStyle(active, color) {
  return {
    flex: 1,
    padding: "8px",
    borderRadius: 7,
    border: `1px solid ${active ? color : C.bl2}`,
    background: active ? `${color}14` : "transparent",
    color: active ? color : C.td,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  };
}
