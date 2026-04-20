"use client";

import { useState } from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import {
  SEARCH_DATA,
  SEARCH_JOURNEYS,
  PERCEPTION_CLUSTERS,
} from "@/data/searchData";

const C = {
  sa: "#141d2e",
  sh: "#1a2540",
  ac: "#36CFBA",
  bl: "#1D85EB",
  wn: "#F59E0B",
  rd: "#EF4444",
  pp: "#A78BFA",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
};

const SECTIONS = [
  { key: "keywords", icon: "🔑", label: "키워드 검색량" },
  { key: "journeys", icon: "🗺", label: "검색 여정" },
  { key: "clusters", icon: "🧭", label: "인식 클러스터" },
];

function fmt(n) {
  return new Intl.NumberFormat("ko-KR").format(n);
}

function trendColor(trend) {
  if (!trend) return C.tm;
  if (trend.startsWith("+")) return C.ac;
  if (trend.startsWith("-")) return C.rd;
  return C.tm;
}

export default function SearchDataTab() {
  const [section, setSection] = useState("keywords");

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: C.t, margin: 0 }}>
          📡 검색 데이터 분석
        </h2>
        <p style={{ fontSize: 12, color: C.td, margin: "5px 0 0" }}>
          ListeningMind 실데이터 (2026.04.20) — 콘텐츠 기회 발굴
        </p>
      </div>

      {/* 섹션 스위처 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {SECTIONS.map((s) => {
          const active = section === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              style={{
                flex: 1,
                padding: "9px 10px",
                borderRadius: 8,
                border: active
                  ? `1px solid ${C.ac}66`
                  : "1px solid rgba(255,255,255,0.06)",
                background: active ? `${C.ac}14` : "#0f1623",
                color: active ? C.ac : C.td,
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      {section === "keywords" && <KeywordsSection />}
      {section === "journeys" && <JourneysSection />}
      {section === "clusters" && <ClustersSection />}
    </div>
  );
}

function KeywordsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {SEARCH_DATA.map((k, i) => {
        const tc = trendColor(k.trend);
        return (
          <Card key={i}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
                gap: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.t,
                  }}
                >
                  {k.keyword}
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    marginTop: 5,
                  }}
                >
                  <Badge color={C.ac}>월평균 {fmt(k.volumeAvg)}회</Badge>
                  <Badge color={C.bl}>누적 {fmt(k.volumeTotal)}</Badge>
                  {k.trend && <Badge color={tc}>트렌드 {k.trend}</Badge>}
                  {k.cpc && (
                    <Badge color={C.wn}>CPC {k.cpc}</Badge>
                  )}
                  {k.intent && (
                    <Badge color={C.pp}>{k.intent}</Badge>
                  )}
                </div>
              </div>
            </div>

            {k.demographics && (
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  marginBottom: 6,
                }}
              >
                {Object.entries(k.demographics).map(([key, value]) => (
                  <Badge key={key} color={C.tm} background={C.sh}>
                    {labelDemographic(key)} {value}
                  </Badge>
                ))}
              </div>
            )}

            {k.peakMonth && (
              <div
                style={{
                  fontSize: 11,
                  color: C.td,
                  marginBottom: 6,
                }}
              >
                <strong style={{ color: C.wn }}>📈 피크:</strong> {k.peakMonth}
              </div>
            )}

            <div
              style={{
                fontSize: 12,
                color: C.td,
                lineHeight: 1.6,
                marginBottom: 7,
              }}
            >
              {k.insight}
            </div>

            <div
              style={{
                padding: "6px 9px",
                borderRadius: 6,
                background: `${C.ac}08`,
                border: `1px solid ${C.ac}15`,
                fontSize: 12,
                color: C.ac,
              }}
            >
              💡 <strong>숏폼 기회:</strong> {k.shortformOpp}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function JourneysSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {SEARCH_JOURNEYS.map((j, i) => (
        <Card key={i}>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: C.t,
            }}
          >
            {j.name}
          </h3>
          <div style={{ marginTop: 5 }}>
            <Badge color={C.pp}>{j.persona}</Badge>
          </div>

          <div
            style={{
              marginTop: 8,
              padding: "8px 10px",
              borderRadius: 6,
              background: C.sa,
              fontSize: 12,
              color: C.td,
              lineHeight: 1.7,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {j.path}
          </div>

          <div
            style={{
              fontSize: 12,
              color: C.td,
              lineHeight: 1.6,
              marginTop: 8,
            }}
          >
            {j.insight}
          </div>

          <div
            style={{
              marginTop: 7,
              padding: "6px 9px",
              borderRadius: 6,
              background: `${C.ac}08`,
              border: `1px solid ${C.ac}15`,
              fontSize: 12,
              color: C.ac,
            }}
          >
            🎬 <strong>숏폼 프레임:</strong> {j.shortformFrame}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ClustersSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {PERCEPTION_CLUSTERS.map((c, i) => (
        <Card key={i}>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 700,
              color: C.t,
            }}
          >
            {c.cluster}
          </h3>

          <div
            style={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              marginTop: 7,
            }}
          >
            {c.keywords.map((kw, j) => (
              <Badge key={j} color={C.tm} background={C.sh}>
                {kw}
              </Badge>
            ))}
          </div>

          <div
            style={{
              fontSize: 12,
              color: C.td,
              lineHeight: 1.6,
              marginTop: 8,
            }}
          >
            {c.insight}
          </div>

          <div
            style={{
              marginTop: 7,
              padding: "6px 9px",
              borderRadius: 6,
              background: `${C.bl}0a`,
              border: `1px solid ${C.bl}18`,
              fontSize: 12,
              color: C.bl,
            }}
          >
            🚀 <strong>기회:</strong> {c.opportunity}
          </div>
        </Card>
      ))}
    </div>
  );
}

function labelDemographic(key) {
  const map = {
    male: "남성",
    female: "여성",
    age20s: "20대",
    age30s: "30대",
    age40s: "40대",
    age50s: "50대",
  };
  return map[key] || key;
}
