"use client";

import { useState } from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";
import { PERSONAS } from "@/data/personas";

const C = {
  sa: "#141d2e",
  ac: "#36CFBA",
  ad: "rgba(54,207,186,0.12)",
  bl: "#1D85EB",
  wn: "#F59E0B",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  b: "rgba(255,255,255,0.05)",
};

export default function ShortformTab() {
  const [selected, setSelected] = useState(0);
  const persona = PERSONAS[selected];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: C.t, margin: 0 }}>
          🎬 숏폼 콘텐츠 전략
        </h2>
        <p style={{ fontSize: 12, color: C.td, margin: "5px 0 0" }}>
          타겟 페르소나별 콘텐츠 유형·후킹·CTA 전략
        </p>
      </div>

      {/* 페르소나 탭 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {PERSONAS.map((p, i) => {
          const active = selected === i;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                flex: 1,
                padding: "11px 8px",
                borderRadius: 10,
                border: active ? `2px solid ${C.ac}` : `1px solid ${C.b}`,
                background: active ? C.ad : "#0f1623",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 2 }}>{p.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: active ? C.ac : C.t }}>
                {p.label}
              </div>
              <div style={{ fontSize: 10, color: C.tm }}>{p.age}</div>
            </button>
          );
        })}
      </div>

      {/* 페르소나 상세 */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: C.ad,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {persona.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.t }}>
              {persona.label}
            </h3>
            <p style={{ margin: "4px 0 7px", fontSize: 12, color: C.td, lineHeight: 1.6 }}>
              {persona.desc}
            </p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              <Badge color={C.ac}>훅: {persona.hook}</Badge>
              <Badge color={C.bl}>페인: {persona.pain}</Badge>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: C.tm }}>
              <strong style={{ color: C.td }}>플랫폼:</strong> {persona.platform}
            </div>
          </div>
        </div>
      </Card>

      {/* 추천 콘텐츠 */}
      <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ac, margin: "14px 0 8px" }}>
        📝 추천 숏폼 콘텐츠 ({persona.contents.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {persona.contents.map((c, i) => (
          <ContentCard key={i} content={c} />
        ))}
      </div>
    </div>
  );
}

function ContentCard({ content }) {
  const highImpact = content.score >= 90;
  const barColor = highImpact ? C.ac : C.bl;

  return (
    <Card style={{ padding: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 5,
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Badge color={C.wn}>{content.type}</Badge>
          <h4
            style={{
              margin: "5px 0 2px",
              fontSize: 13,
              fontWeight: 700,
              color: C.t,
            }}
          >
            "{content.title}"
          </h4>
          <p style={{ margin: 0, fontSize: 11, color: C.td }}>{content.desc}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: C.tm }}>임팩트</div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 900,
              color: barColor,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {content.score}
          </div>
        </div>
      </div>
      <ProgressBar value={content.score} color={barColor} />
      <div
        style={{
          marginTop: 7,
          padding: "5px 8px",
          borderRadius: 6,
          background: C.sa,
          fontSize: 11,
          color: C.td,
        }}
      >
        <strong style={{ color: C.ac }}>CTA →</strong> "지금 우리 회사 고용부담금 무료 진단받기" → 진단기(TAB 1)로 유도
      </div>
    </Card>
  );
}
