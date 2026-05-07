"use client";

import { useState } from "react";
import Badge from "./ui/Badge";
import CampaignDiagnosis from "./performance/CampaignDiagnosis";
import KeywordStrategy from "./performance/KeywordStrategy";
import LandingBuilder from "./performance/LandingBuilder";
import BannerStudio from "./performance/BannerStudio";
import CrossChannel from "./performance/CrossChannel";

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

const SUBTABS = [
  { key: "diagnosis", label: "캠페인 진단",       icon: "📊", desc: "데이터 진단 + AI 분석" },
  { key: "keywords",  label: "키워드 & 메시지",   icon: "🎯", desc: "전략 + 카피 생성" },
  { key: "landing",   label: "AI 랜딩 빌더",      icon: "🖥️", desc: "맞춤 LP 자동 생성" },
  { key: "banner",    label: "AI DA 배너",        icon: "🎨", desc: "사이즈별 배너" },
  { key: "channels",  label: "크로스채널 전략",   icon: "📈", desc: "예산 시뮬레이터" },
];

export default function PerformanceLabView() {
  const [sub, setSub] = useState("diagnosis");

  return (
    <div>
      {/* 헤더 */}
      <div
        style={{
          marginBottom: 18,
          padding: "20px 22px",
          borderRadius: 16,
          background: `linear-gradient(135deg, ${C.ac}14 0%, ${C.bl}10 100%)`,
          border: `1px solid ${C.ac}33`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: C.ac,
              letterSpacing: 3,
            }}
          >
            DA PERFORMANCE LAB
          </div>
          <Badge color={C.ac}>5 모듈 통합</Badge>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 900,
            color: C.t,
            lineHeight: 1.3,
          }}
        >
          캠페인 진단부터{" "}
          <span style={{ color: C.ac }}>랜딩·배너 자동 생성</span>까지
        </h2>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 12,
            color: C.td,
            lineHeight: 1.7,
            maxWidth: 700,
          }}
        >
          광고 데이터 기반 KPI 진단 → 키워드/메시지 전략 → 랜딩·배너 크리에이티브 → 크로스채널
          예산 시뮬레이터까지. 펜타클의 광고 운영 노하우를 AI 모듈로 코드화한 통합 퍼포먼스 랩.
        </p>
      </div>

      {/* 서브탭 네비 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 5,
          marginBottom: 16,
        }}
      >
        {SUBTABS.map((t) => {
          const active = sub === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setSub(t.key)}
              style={{
                padding: "10px 8px",
                borderRadius: 10,
                border: active ? `1px solid ${C.ac}66` : `1px solid ${C.bl2}`,
                background: active ? `${C.ac}14` : C.sf,
                color: active ? C.ac : C.td,
                fontSize: 11,
                fontWeight: active ? 800 : 600,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                textAlign: "center",
                lineHeight: 1.3,
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: 17 }}>{t.icon}</span>
              <span>{t.label}</span>
              <span
                style={{
                  fontSize: 9,
                  color: C.tm,
                  fontWeight: 500,
                }}
              >
                {t.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* 서브탭 본문 */}
      {sub === "diagnosis" && <CampaignDiagnosis />}
      {sub === "keywords" && <KeywordStrategy />}
      {sub === "landing" && <LandingBuilder />}
      {sub === "banner" && <BannerStudio />}
      {sub === "channels" && <CrossChannel />}
    </div>
  );
}
