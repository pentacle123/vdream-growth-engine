"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";
import { KEYWORD_STRATEGY, PRIORITY_META } from "@/data/keywordStrategy";
import { USP_MATRIX, TONE_OPTIONS, TARGET_OPTIONS } from "@/data/uspMatrix";

const C = {
  sf: "#F8FAFC",
  sa: "#F1F5F9",
  sh: "#E2E8F0",
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

export default function KeywordStrategy() {
  const [keyword, setKeyword] = useState(KEYWORD_STRATEGY[0].kw);
  const [target, setTarget] = useState("hr");
  const [usps, setUsps] = useState(["💰 부담금 절감"]);
  const [tone, setTone] = useState("info");
  const [copy, setCopy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const toggleUsp = (u) => {
    setUsps((prev) =>
      prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]
    );
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ad-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, target, usps, tone }),
      });
      const data = await res.json();
      setCopy(data);
    } catch {
      setCopy({ fallback: true, naver: { titles: [], descs: [] } });
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (txt, key) => {
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("복사하세요:", txt);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* 섹션 1: 우선순위 매트릭스 */}
      <Section title="🎯 B2B 키워드 우선순위 매트릭스" subtitle="ListeningMind 검색량 + 현재 광고 데이터 교차 분석">
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760, fontSize: 11 }}>
              <thead>
                <tr style={{ background: C.sh }}>
                  <Th>우선순위</Th>
                  <Th>키워드</Th>
                  <Th align="right">검색량</Th>
                  <Th align="right">현재 노출</Th>
                  <Th align="right">클릭</Th>
                  <Th>타겟</Th>
                  <Th>액션</Th>
                  <Th align="center">생성</Th>
                </tr>
              </thead>
              <tbody>
                {KEYWORD_STRATEGY.map((k, i) => {
                  const meta = PRIORITY_META[k.priorityCode];
                  return (
                    <tr key={i} style={{ borderTop: `1px solid ${C.bl2}` }}>
                      <Td>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: meta.bg,
                            border: `1px solid ${meta.border}`,
                            color: meta.color,
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          {k.priority}
                        </span>
                      </Td>
                      <Td>
                        <div style={{ color: C.t, fontWeight: 700, fontSize: 12 }}>{k.kw}</div>
                        <div style={{ color: C.tm, fontSize: 10, marginTop: 2 }}>{k.reason}</div>
                      </Td>
                      <Td align="right">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.bl, fontWeight: 700 }}>
                          {k.lmVol > 0 ? k.lmVol.toLocaleString("ko-KR") : "—"}
                        </span>
                        <div style={{ fontSize: 9, color: C.tm }}>{k.lmCpc}</div>
                      </Td>
                      <Td align="right">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.t }}>
                          {k.currentImp.toLocaleString("ko-KR")}
                        </span>
                      </Td>
                      <Td align="right">
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: k.currentClick === 0 ? C.rd : C.ac, fontWeight: 700 }}>
                          {k.currentClick}
                        </span>
                      </Td>
                      <Td><span style={{ color: C.td, fontSize: 10 }}>{k.target}</span></Td>
                      <Td><span style={{ color: C.td, fontSize: 10 }}>{k.action}</span></Td>
                      <Td align="center">
                        <button
                          onClick={() => {
                            setKeyword(k.kw);
                            window.scrollTo({
                              top: document.body.scrollHeight,
                              behavior: "smooth",
                            });
                          }}
                          style={{
                            padding: "5px 9px",
                            borderRadius: 6,
                            border: `1px solid ${C.ac}55`,
                            background: `${C.ac}14`,
                            color: C.ac,
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          카피 →
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* 섹션 2: USP × 타겟 매트릭스 */}
      <Section title="🎁 USP × 타겟 메시지 매트릭스" subtitle="5개 USP × 3개 타겟 조합 메시지 사전">
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760, fontSize: 11 }}>
              <thead>
                <tr style={{ background: C.sh }}>
                  <Th>USP</Th>
                  {USP_MATRIX.targets.map((t, i) => (
                    <Th key={i}>{t}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {USP_MATRIX.usps.map((u, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.bl2}` }}>
                    <Td>
                      <span style={{ color: C.ac, fontWeight: 700, fontSize: 12 }}>{u}</span>
                    </Td>
                    {USP_MATRIX.messages[i].map((m, j) => (
                      <Td key={j}>
                        <div style={{ fontSize: 11, color: C.t, lineHeight: 1.5 }}>{m}</div>
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>

      {/* 섹션 3: AI 카피 생성기 */}
      <Section title="🤖 AI 광고 카피 생성기" subtitle="키워드 · 타겟 · USP · 톤 → 5개 채널 카피 동시 생성">
        <Card style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {/* 키워드 */}
            <div>
              <Label>🔑 키워드</Label>
              <select
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={inputStyle}
              >
                {KEYWORD_STRATEGY.map((k) => (
                  <option key={k.kw} value={k.kw}>
                    {k.priority} {k.kw}
                  </option>
                ))}
              </select>
            </div>
            {/* 톤 */}
            <div>
              <Label>🎨 톤</Label>
              <div style={{ display: "flex", gap: 5 }}>
                {TONE_OPTIONS.map((t) => (
                  <Pill
                    key={t.key}
                    active={tone === t.key}
                    onClick={() => setTone(t.key)}
                    color={C.am}
                  >
                    {t.label}
                  </Pill>
                ))}
              </div>
            </div>
          </div>

          {/* 타겟 */}
          <div style={{ marginBottom: 12 }}>
            <Label>👥 타겟</Label>
            <div style={{ display: "flex", gap: 6 }}>
              {TARGET_OPTIONS.map((t) => (
                <Pill key={t.key} active={target === t.key} onClick={() => setTarget(t.key)} color={C.bl}>
                  {t.emoji} {t.label}
                </Pill>
              ))}
            </div>
          </div>

          {/* USP */}
          <div style={{ marginBottom: 14 }}>
            <Label>💎 USP 강조 (복수 선택)</Label>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {USP_MATRIX.usps.map((u) => (
                <Pill
                  key={u}
                  active={usps.includes(u)}
                  onClick={() => toggleUsp(u)}
                  color={C.ac}
                >
                  {u}
                </Pill>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            disabled={loading || usps.length === 0}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: usps.length === 0 ? C.sa : `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
              color: usps.length === 0 ? C.tm : "#000",
              fontSize: 13,
              fontWeight: 900,
              cursor: loading ? "wait" : usps.length === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            {loading ? <Spinner color="#000" /> : "✨"}{" "}
            {loading ? "Claude가 5채널 카피 생성 중..." : "AI 카피 생성"}
          </button>
        </Card>

        {copy && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {copy.fallback && (
              <div style={{ padding: "8px 12px", borderRadius: 8, background: `${C.am}10`, border: `1px solid ${C.am}33`, color: C.am, fontSize: 11 }}>
                ⚠ 샘플 카피 (API 오류 또는 키 미설정)
              </div>
            )}
            <ChannelPreview title="네이버 검색광고" icon="🔍" color="#03C75A" onCopy={copyText} copiedKey={copied}>
              {copy.naver?.titles?.map((t, i) => (
                <CopyRow key={`nt${i}`} label={`제목 ${i + 1}`} text={t} onCopy={() => copyText(t, `nt${i}`)} copied={copied === `nt${i}`} />
              ))}
              {copy.naver?.descs?.map((d, i) => (
                <CopyRow key={`nd${i}`} label={`설명 ${i + 1}`} text={d} onCopy={() => copyText(d, `nd${i}`)} copied={copied === `nd${i}`} />
              ))}
            </ChannelPreview>
            <ChannelPreview title="메타 광고 (FB/IG)" icon="📱" color="#0866FF">
              <CopyRow label="헤드라인" text={copy.meta?.headline} onCopy={() => copyText(copy.meta?.headline, "mh")} copied={copied === "mh"} />
              <CopyRow label="본문" text={copy.meta?.body} onCopy={() => copyText(copy.meta?.body, "mb")} copied={copied === "mb"} />
              <CopyRow label="CTA" text={copy.meta?.cta} onCopy={() => copyText(copy.meta?.cta, "mc")} copied={copied === "mc"} />
            </ChannelPreview>
            <ChannelPreview title="링크드인" icon="💼" color="#0A66C2">
              <CopyRow label="헤드라인" text={copy.linkedin?.headline} onCopy={() => copyText(copy.linkedin?.headline, "lh")} copied={copied === "lh"} />
              <CopyRow label="인트로" text={copy.linkedin?.intro} onCopy={() => copyText(copy.linkedin?.intro, "li")} copied={copied === "li"} />
            </ChannelPreview>
            <ChannelPreview title="유튜브 6초 범퍼" icon="▶️" color="#FF0000">
              <CopyRow label="스크립트" text={copy.youtube?.bumper6s} onCopy={() => copyText(copy.youtube?.bumper6s, "yb")} copied={copied === "yb"} />
            </ChannelPreview>
            <ChannelPreview title="랜딩 페이지" icon="🖥️" color={C.ac}>
              <CopyRow label="헤드라인" text={copy.landing?.headline} onCopy={() => copyText(copy.landing?.headline, "lph")} copied={copied === "lph"} />
              <CopyRow label="서브카피" text={copy.landing?.sub} onCopy={() => copyText(copy.landing?.sub, "lps")} copied={copied === "lps"} />
              <CopyRow label="CTA" text={copy.landing?.cta} onCopy={() => copyText(copy.landing?.cta, "lpc")} copied={copied === "lpc"} />
            </ChannelPreview>
          </div>
        )}
      </Section>
    </div>
  );
}

/* 보조 컴포넌트 */

function Section({ title, subtitle, children }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: C.t }}>{title}</h3>
      <p style={{ margin: "0 0 10px", fontSize: 11, color: C.tm }}>{subtitle}</p>
      {children}
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      style={{
        padding: "9px 11px",
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
  return <td style={{ padding: "9px 11px", textAlign: align, verticalAlign: "top" }}>{children}</td>;
}

function Label({ children }) {
  return (
    <label style={{ display: "block", fontSize: 11, color: C.td, fontWeight: 700, marginBottom: 5, letterSpacing: 0.5 }}>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
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
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function ChannelPreview({ title, icon, color, children }) {
  return (
    <Card style={{ borderColor: `${color}33`, padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "9px 14px",
          background: `${color}12`,
          borderBottom: `1px solid ${color}22`,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color }}>{title}</span>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {children}
      </div>
    </Card>
  );
}

function CopyRow({ label, text, onCopy, copied }) {
  if (!text) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 10px",
        borderRadius: 7,
        background: C.sa,
      }}
    >
      <div style={{ fontSize: 9, color: C.tm, fontWeight: 700, width: 60, flexShrink: 0, letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ flex: 1, fontSize: 12, color: C.t, lineHeight: 1.5 }}>{text}</div>
      <button
        onClick={onCopy}
        style={{
          padding: "4px 8px",
          borderRadius: 5,
          border: `1px solid ${copied ? C.ac : C.bl2}`,
          background: copied ? `${C.ac}14` : "transparent",
          color: copied ? C.ac : C.td,
          fontSize: 9,
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {copied ? "✅" : "복사"}
      </button>
    </div>
  );
}
