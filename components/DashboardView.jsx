"use client";

import { useState, useMemo } from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import CalendarTab from "./CalendarTab";
import SearchDataTab from "./SearchDataTab";
import { OPPORTUNITIES, CATEGORIES } from "@/data/opportunities";
import {
  TARGET_COMPANIES,
  PIPELINE_STATUSES,
  calculateScore,
  TIER_META,
} from "@/data/targetCompanies";
import { SEARCH_DATA } from "@/data/searchData";
import { formatWon } from "@/lib/calculate";

const C = {
  bg: "#050a12",
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

const SUBVIEWS = [
  { key: "overview", label: "종합 통계", icon: "📊" },
  { key: "calendar", label: "캠페인 캘린더", icon: "📅" },
  { key: "search", label: "검색 데이터", icon: "📡" },
];

export default function DashboardView() {
  const [sub, setSub] = useState("overview");

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.t }}>
          📊 통합 대시보드
        </h2>
        <p style={{ fontSize: 12, color: C.td, margin: "6px 0 0", lineHeight: 1.6 }}>
          엔진 전체 현황 + 캠페인 캘린더 + 검색 데이터 인사이트를 한 화면에서 확인합니다.
        </p>
      </div>

      {/* Sub nav */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {SUBVIEWS.map((s) => {
          const active = sub === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setSub(s.key)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 10,
                border: active ? `1px solid ${C.ac}55` : `1px solid ${C.bl2}`,
                background: active ? `${C.ac}14` : C.sf,
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

      {sub === "overview" && <OverviewSection />}
      {sub === "calendar" && <CalendarTab />}
      {sub === "search" && <SearchDataTab />}
    </div>
  );
}

/* ============================================================
 * 종합 통계 섹션
 * ============================================================ */

function OverviewSection() {
  const stats = useMemo(() => {
    const totalSearch = SEARCH_DATA.reduce(
      (a, k) => a + (k.volumeTotal || 0),
      0
    );

    const tierCount = { hot: 0, warm: 0, cold: 0 };
    let totalPenalty = 0;
    TARGET_COMPANIES.forEach((c) => {
      tierCount[calculateScore(c).tier]++;
      totalPenalty += c.estimatedPenalty;
    });

    const topOpp = [...OPPORTUNITIES].sort((a, b) => b.score - a.score)[0];
    const topCompany = [...TARGET_COMPANIES]
      .map((c) => ({ c, s: calculateScore(c) }))
      .sort((a, b) => b.s.total - a.s.total)[0];

    return {
      totalSearch,
      tierCount,
      totalPenalty,
      topOpp,
      topCompany,
    };
  }, []);

  return (
    <div>
      {/* KPI 카드 4개 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <KpiCard
          icon="🔍"
          label="총 콘텐츠 기회"
          value={`${OPPORTUNITIES.length}개`}
          sub={`${CATEGORIES.length} 카테고리`}
          color={C.bl}
        />
        <KpiCard
          icon="📡"
          label="총 검색 시그널"
          value={stats.totalSearch.toLocaleString("ko-KR")}
          sub={`${SEARCH_DATA.length} 키워드 추적`}
          color={C.ac}
        />
        <KpiCard
          icon="🎯"
          label="타겟 기업"
          value={`${TARGET_COMPANIES.length}개`}
          sub={`총 부담금 ${formatWon(stats.totalPenalty)}`}
          color={C.am}
        />
        <KpiCard
          icon="🤖"
          label="활성 AI 모듈"
          value="5종"
          sub="Claude API 연동"
          color={C.pp}
        />
      </div>

      {/* 카테고리별 기회 분포 */}
      <Card style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: C.ac }}>
          📂 콘텐츠 기회 카테고리 분포
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {CATEGORIES.map((cat) => {
            const opps = OPPORTUNITIES.filter((o) => o.category === cat.key);
            const avgScore = Math.round(
              opps.reduce((a, o) => a + o.score, 0) / opps.length
            );
            return (
              <div
                key={cat.key}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: `${cat.color}0e`,
                  border: `1px solid ${cat.color}33`,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: cat.color,
                    letterSpacing: 1.5,
                    marginBottom: 6,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {cat.icon} CATEGORY {cat.code}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.t,
                    marginBottom: 5,
                    lineHeight: 1.3,
                  }}
                >
                  {cat.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    flexWrap: "wrap",
                  }}
                >
                  <Badge color={cat.color}>{opps.length}개</Badge>
                  <Badge color={C.am}>평균 {avgScore}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 영업 파이프라인 타이어 */}
      <Card style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: C.am }}>
          🎯 타겟 기업 우선순위 분포
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
          }}
        >
          {[
            { key: "hot", count: stats.tierCount.hot },
            { key: "warm", count: stats.tierCount.warm },
            { key: "cold", count: stats.tierCount.cold },
          ].map(({ key, count }) => {
            const meta = TIER_META[key];
            return (
              <div
                key={key}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: `${meta.color}0e`,
                  border: `1px solid ${meta.color}33`,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 2 }}>{meta.emoji}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: meta.color,
                    fontWeight: 700,
                  }}
                >
                  {meta.label}
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: meta.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    marginTop: 2,
                  }}
                >
                  {count}
                </div>
                <div style={{ fontSize: 10, color: C.tm, marginTop: 2 }}>
                  / {TARGET_COMPANIES.length}개
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 베스트 기회 + 베스트 타겟 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Card style={{ borderColor: `${C.ac}33` }}>
          <div style={{ fontSize: 10, color: C.tm, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>
            🏆 TOP OPPORTUNITY
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: C.t,
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {stats.topOpp.emoji} {stats.topOpp.title}
          </div>
          <div style={{ fontSize: 11, color: C.td, lineHeight: 1.5 }}>
            {stats.topOpp.target}
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 5 }}>
            <Badge color={C.ac}>임팩트 {stats.topOpp.score}</Badge>
            <Badge color={C.bl}>{stats.topOpp.id}</Badge>
          </div>
        </Card>
        <Card style={{ borderColor: `${C.rd}33` }}>
          <div style={{ fontSize: 10, color: C.tm, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>
            🎯 HOTTEST TARGET
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: C.t,
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {stats.topCompany.c.name}
          </div>
          <div style={{ fontSize: 11, color: C.td, lineHeight: 1.5 }}>
            {stats.topCompany.c.industry} · {stats.topCompany.c.region} · 부담금{" "}
            <span style={{ color: C.rd, fontWeight: 700 }}>
              {formatWon(stats.topCompany.c.estimatedPenalty)}
            </span>
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 5 }}>
            <Badge color={C.rd}>스코어 {stats.topCompany.s.total}</Badge>
            <Badge color={C.am}>부족 {stats.topCompany.c.deficit}명</Badge>
          </div>
        </Card>
      </div>

      {/* 시스템 상태 */}
      <Card style={{ borderColor: `${C.bl}33` }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: C.bl }}>
          ⚙️ AI 모듈 상태
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { name: "/api/diagnose", desc: "맞춤 직무 추천", status: "active" },
            { name: "/api/report", desc: "경영진 리포트 생성", status: "active" },
            { name: "/api/script", desc: "숏폼 스크립트 생성", status: "active" },
            { name: "/api/proposal", desc: "기업 맞춤 제안서", status: "active" },
            { name: "/api/outreach", desc: "아웃바운드 메시지", status: "active" },
          ].map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 11px",
                borderRadius: 8,
                background: C.sa,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    color: C.bl,
                    fontWeight: 700,
                  }}
                >
                  {m.name}
                </span>
                <span style={{ fontSize: 11, color: C.td, marginLeft: 8 }}>
                  {m.desc}
                </span>
              </div>
              <Badge color={C.ac}>● Active</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, color }) {
  return (
    <Card style={{ padding: 12, borderColor: `${color}33` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 10, color: C.tm, fontWeight: 700, letterSpacing: 1 }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 900,
          color,
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: C.tm, marginTop: 3 }}>{sub}</div>
      )}
    </Card>
  );
}
