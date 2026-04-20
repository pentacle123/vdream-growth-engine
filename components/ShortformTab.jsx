"use client";

import { useState, useMemo } from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";
import Spinner from "./ui/Spinner";
import {
  CATEGORIES,
  OPPORTUNITIES,
  CTA_META,
  byCategory,
  findOpportunity,
  findCategory,
} from "@/data/opportunities";
import { SEARCH_DATA } from "@/data/searchData";

const C = {
  bg: "#060b14",
  sf: "#0f1623",
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
  b: "rgba(255,255,255,0.05)",
  bl2: "rgba(255,255,255,0.08)",
};

/* ============================================================
 * 메인 컨테이너 — 3-depth 상태머신
 * ============================================================ */

export default function ShortformTab({ onNavigateTab }) {
  const [view, setView] = useState({ type: "home" });

  const totalSearchVolume = useMemo(
    () => SEARCH_DATA.reduce((acc, k) => acc + (k.volumeTotal || 0), 0),
    []
  );

  const goHome = () => setView({ type: "home" });
  const goList = (categoryKey) => setView({ type: "list", categoryKey });
  const goDetail = (id) => setView({ type: "detail", id });

  return (
    <div>
      <EngineHeader totalSearch={totalSearchVolume} />

      <Breadcrumb view={view} onHome={goHome} onList={goList} />

      {view.type === "home" && <CategoryHome onSelect={goList} />}
      {view.type === "list" && (
        <OpportunityList categoryKey={view.categoryKey} onSelect={goDetail} />
      )}
      {view.type === "detail" && (
        <OpportunityDetail
          id={view.id}
          onBack={() => goList(findOpportunity(view.id)?.category)}
          onNavigateTab={onNavigateTab}
        />
      )}
    </div>
  );
}

/* ============================================================
 * 엔진 헤더 (상시 표시)
 * ============================================================ */

function EngineHeader({ totalSearch }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: C.t, margin: 0 }}>
          🎬 Brandformance Engine
        </h2>
        <Badge color={C.ac}>18 Opportunities</Badge>
      </div>
      <p style={{ fontSize: 12, color: C.td, margin: "4px 0 0" }}>
        ListeningMind 기반 숏폼 콘텐츠 기회 발견 엔진 ·{" "}
        <span style={{ color: C.ac, fontWeight: 600 }}>
          총 검색 시그널 {totalSearch.toLocaleString("ko-KR")}회
        </span>
      </p>
    </div>
  );
}

/* ============================================================
 * Breadcrumb
 * ============================================================ */

function Breadcrumb({ view, onHome, onList }) {
  if (view.type === "home") return null;

  const cat =
    view.type === "list"
      ? findCategory(view.categoryKey)
      : view.type === "detail"
      ? (() => {
          const opp = findOpportunity(view.id);
          return opp ? findCategory(opp.category) : null;
        })()
      : null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        color: C.tm,
        marginBottom: 12,
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={onHome}
        style={{
          background: "none",
          border: "none",
          color: C.td,
          cursor: "pointer",
          padding: 0,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        🏠 엔진 홈
      </button>
      {cat && (
        <>
          <span>›</span>
          <button
            onClick={view.type === "detail" ? () => onList(cat.key) : undefined}
            disabled={view.type === "list"}
            style={{
              background: "none",
              border: "none",
              color: view.type === "list" ? cat.color : C.td,
              cursor: view.type === "detail" ? "pointer" : "default",
              padding: 0,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {cat.icon} 카테고리 {cat.code}
          </button>
        </>
      )}
      {view.type === "detail" && (
        <>
          <span>›</span>
          <span style={{ color: C.t, fontWeight: 700 }}>
            {findOpportunity(view.id)?.title}
          </span>
        </>
      )}
    </div>
  );
}

/* ============================================================
 * Depth 0: 카테고리 홈 (3 hero 카드)
 * ============================================================ */

function CategoryHome({ onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {CATEGORIES.map((cat) => {
        const opps = byCategory(cat.key);
        const topScore = Math.max(...opps.map((o) => o.score));
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            style={{
              textAlign: "left",
              padding: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            <Card
              style={{
                padding: 20,
                background: `linear-gradient(135deg, ${cat.color}14 0%, ${cat.color}04 100%)`,
                border: `1px solid ${cat.color}44`,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: `${cat.color}22`,
                    border: `1px solid ${cat.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  {cat.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: cat.color,
                        letterSpacing: 1.5,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      CATEGORY {cat.code}
                    </span>
                    <Badge color={cat.color}>
                      {opps.length} Opportunities
                    </Badge>
                    <Badge color={C.wn}>최고 임팩트 {topScore}</Badge>
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 800,
                      color: C.t,
                      lineHeight: 1.3,
                    }}
                  >
                    {cat.title}
                  </h3>
                  <p
                    style={{
                      margin: "6px 0 10px",
                      fontSize: 12,
                      color: C.td,
                      lineHeight: 1.6,
                    }}
                  >
                    {cat.tagline}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {opps.slice(0, 3).map((o) => (
                      <span
                        key={o.id}
                        style={{
                          padding: "4px 9px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.04)",
                          border: `1px solid ${cat.color}22`,
                          fontSize: 11,
                          color: C.td,
                          fontWeight: 500,
                        }}
                      >
                        {o.emoji} {o.title}
                      </span>
                    ))}
                    {opps.length > 3 && (
                      <span
                        style={{
                          padding: "4px 9px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.04)",
                          fontSize: 11,
                          color: C.tm,
                          fontWeight: 500,
                        }}
                      >
                        +{opps.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 20,
                    color: cat.color,
                    alignSelf: "center",
                    flexShrink: 0,
                  }}
                >
                  →
                </div>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Depth 1: 기회 리스트
 * ============================================================ */

function OpportunityList({ categoryKey, onSelect }) {
  const cat = findCategory(categoryKey);
  const opps = byCategory(categoryKey).sort((a, b) => b.score - a.score);

  if (!cat) return null;

  return (
    <div>
      <div
        style={{
          marginBottom: 14,
          padding: "12px 14px",
          borderRadius: 10,
          background: `${cat.color}0e`,
          border: `1px solid ${cat.color}33`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 3,
          }}
        >
          <span style={{ fontSize: 18 }}>{cat.icon}</span>
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 800,
              color: cat.color,
            }}
          >
            {cat.title}
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: C.td }}>{cat.tagline}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 10,
        }}
      >
        {opps.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opp={opp}
            catColor={cat.color}
            onClick={() => onSelect(opp.id)}
          />
        ))}
      </div>
    </div>
  );
}

function OpportunityCard({ opp, catColor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
      }}
    >
      <Card
        style={{
          padding: 14,
          height: "100%",
          transition: "all 0.15s ease",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 22 }}>{opp.emoji}</span>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: catColor,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {opp.id}
              </div>
              <h4
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 800,
                  color: C.t,
                }}
              >
                {opp.title}
              </h4>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: C.tm }}>임팩트</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: opp.score >= 90 ? C.ac : opp.score >= 80 ? C.bl : C.wn,
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1,
              }}
            >
              {opp.score}
            </div>
          </div>
        </div>

        <ProgressBar
          value={opp.score}
          color={opp.score >= 90 ? C.ac : opp.score >= 80 ? C.bl : C.wn}
          height={3}
        />

        <div
          style={{
            fontSize: 11,
            color: C.td,
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {opp.target}
        </div>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Badge color={C.tm} background={C.sh}>
            콘텐츠 {opp.contents.length}개
          </Badge>
          <Badge color={C.tm} background={C.sh}>
            크리에이터 {opp.creators.length}개
          </Badge>
        </div>
      </Card>
    </button>
  );
}

/* ============================================================
 * Depth 2: 기회 상세
 * ============================================================ */

function OpportunityDetail({ id, onBack, onNavigateTab }) {
  const opp = findOpportunity(id);
  const cat = opp ? findCategory(opp.category) : null;
  const [scripts, setScripts] = useState({}); // { contentIndex: { hook, ... } | null }
  const [loading, setLoading] = useState({}); // { contentIndex: boolean }

  if (!opp || !cat) return null;

  const generate = async (contentIndex) => {
    const content = opp.contents[contentIndex];
    setLoading((p) => ({ ...p, [contentIndex]: true }));
    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity: opp, content }),
      });
      const data = await res.json();
      setScripts((p) => ({ ...p, [contentIndex]: data }));
    } catch {
      setScripts((p) => ({
        ...p,
        [contentIndex]: {
          hook: "네트워크 오류",
          problem: "스크립트를 불러오지 못했습니다.",
          solution: "",
          proof: "",
          cta: "",
          caption: "",
          hashtags: [],
          thumbnail: "",
          fallback: true,
        },
      }));
    } finally {
      setLoading((p) => ({ ...p, [contentIndex]: false }));
    }
  };

  const scoreColor =
    opp.score >= 90 ? C.ac : opp.score >= 80 ? C.bl : C.wn;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* 히어로 */}
      <Card
        style={{
          padding: 20,
          background: `linear-gradient(135deg, ${cat.color}18 0%, ${cat.color}06 100%)`,
          border: `1px solid ${cat.color}44`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `${cat.color}22`,
              border: `1px solid ${cat.color}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              flexShrink: 0,
            }}
          >
            {opp.emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: cat.color,
                  letterSpacing: 1.5,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {opp.id} · {cat.icon} {cat.title}
              </span>
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 900,
                color: C.t,
                lineHeight: 1.3,
              }}
            >
              {opp.title}
            </h3>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: C.tm }}>임팩트</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: scoreColor,
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1,
              }}
            >
              {opp.score}
            </div>
          </div>
        </div>

        {/* 타겟 + 인사이트 */}
        <SubSection label="🎯 타겟" color={cat.color}>
          {opp.target}
        </SubSection>
        <SubSection label="💡 핵심 인사이트" color={cat.color}>
          {opp.insight}
        </SubSection>
      </Card>

      {/* 검색 데이터 */}
      {opp.signals.length > 0 && (
        <Card>
          <SectionTitle>🔎 검색 데이터 시그널</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {opp.signals.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 11px",
                  borderRadius: 8,
                  background: C.sa,
                  fontSize: 12,
                  color: C.td,
                  lineHeight: 1.5,
                  borderLeft: `3px solid ${C.pp}`,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 숏폼 콘텐츠 전략 + AI 스크립트 */}
      <Card>
        <SectionTitle>📝 숏폼 콘텐츠 전략</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {opp.contents.map((content, i) => (
            <ContentBlock
              key={i}
              content={content}
              catColor={cat.color}
              script={scripts[i]}
              loading={!!loading[i]}
              onGenerate={() => generate(i)}
            />
          ))}
        </div>
      </Card>

      {/* 추천 크리에이터 */}
      <Card>
        <SectionTitle>🤝 추천 크리에이터</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {opp.creators.map((cr, i) => {
            const fitColor =
              cr.fit >= 90 ? C.ac : cr.fit >= 80 ? C.bl : C.wn;
            return (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: C.t }}
                  >
                    {cr.name}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: fitColor,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    적합도 {cr.fit}%
                  </span>
                </div>
                <ProgressBar value={cr.fit} color={fitColor} height={4} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* 메타 (플랫폼 + 시즌) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 10, color: C.tm, fontWeight: 700, marginBottom: 6 }}>
            📱 추천 플랫폼
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {opp.platforms.map((p, i) => (
              <Badge key={i} color={C.bl}>
                {p}
              </Badge>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 14 }}>
          <div style={{ fontSize: 10, color: C.tm, fontWeight: 700, marginBottom: 6 }}>
            📅 시즌
          </div>
          <div style={{ fontSize: 12, color: C.t, fontWeight: 600 }}>
            {opp.season}
          </div>
        </Card>
      </div>

      {/* CTA 섹션 */}
      <Card
        style={{
          padding: 18,
          background: `linear-gradient(135deg, ${C.ac}14 0%, ${C.bl}14 100%)`,
          border: `1px solid ${C.ac}44`,
        }}
      >
        <SectionTitle color={C.ac}>🚀 이 기회의 CTA</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {opp.ctas.map((ctaKey, i) => (
            <CTAButton
              key={i}
              ctaKey={ctaKey}
              onNavigateTab={onNavigateTab}
            />
          ))}
        </div>
      </Card>

      {/* 뒤로 */}
      <button
        onClick={onBack}
        style={{
          padding: "10px",
          borderRadius: 10,
          border: `1px solid ${C.bl2}`,
          background: C.sf,
          color: C.td,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          marginTop: 4,
        }}
      >
        ← {cat.title} 리스트로 돌아가기
      </button>
    </div>
  );
}

/* ============================================================
 * 콘텐츠 아이디어 블록 + AI 스크립트
 * ============================================================ */

function ContentBlock({ content, catColor, script, loading, onGenerate }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: C.sa,
        border: `1px solid ${C.bl2}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              gap: 5,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <Badge color={C.wn}>{content.type}</Badge>
            <Badge color={C.tm} background={C.sh}>
              {content.duration}
            </Badge>
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.t,
              marginBottom: 2,
            }}
          >
            "{content.title}"
          </div>
          <div style={{ fontSize: 11, color: C.td, lineHeight: 1.5 }}>
            {content.desc}
          </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading}
        style={{
          width: "100%",
          padding: "9px",
          borderRadius: 8,
          border: `1px solid ${catColor}55`,
          background: `${catColor}12`,
          color: catColor,
          fontSize: 12,
          fontWeight: 700,
          cursor: loading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
        }}
      >
        {loading ? <Spinner color={catColor} /> : "✨"}{" "}
        {loading ? "Claude가 스크립트 작성 중..." : "AI 스크립트 생성"}
      </button>

      {script && <ScriptOutput script={script} catColor={catColor} />}
    </div>
  );
}

function ScriptOutput({ script, catColor }) {
  const fields = [
    { label: "HOOK", key: "hook", color: C.rd, emoji: "🎣" },
    { label: "PROBLEM", key: "problem", color: C.wn, emoji: "❓" },
    { label: "SOLUTION", key: "solution", color: C.ac, emoji: "💡" },
    { label: "PROOF", key: "proof", color: C.bl, emoji: "📊" },
    { label: "CTA", key: "cta", color: C.pp, emoji: "🚀" },
  ];

  return (
    <div
      style={{
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        background: C.bg,
        border: `1px solid ${catColor}33`,
      }}
    >
      {script.fallback && (
        <div
          style={{
            fontSize: 10,
            color: C.tm,
            marginBottom: 6,
            fontStyle: "italic",
          }}
        >
          ⚠ 샘플 스크립트 (API 키 미설정 또는 오류)
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {fields.map((f) => {
          if (!script[f.key]) return null;
          return (
            <div key={f.key}>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: f.color,
                  letterSpacing: 1.2,
                  marginBottom: 2,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {f.emoji} {f.label}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.t,
                  lineHeight: 1.5,
                  padding: "6px 8px",
                  borderRadius: 6,
                  background: C.sa,
                }}
              >
                {script[f.key]}
              </div>
            </div>
          );
        })}
      </div>

      {script.caption && (
        <div style={{ marginTop: 9 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: C.ac,
              letterSpacing: 1.2,
              marginBottom: 2,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            📝 CAPTION
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.td,
              lineHeight: 1.6,
              padding: "6px 8px",
              borderRadius: 6,
              background: C.sa,
              whiteSpace: "pre-wrap",
            }}
          >
            {script.caption}
          </div>
        </div>
      )}

      {Array.isArray(script.hashtags) && script.hashtags.length > 0 && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          {script.hashtags.map((h, i) => (
            <Badge key={i} color={C.ac} background={`${C.ac}12`}>
              {h}
            </Badge>
          ))}
        </div>
      )}

      {script.thumbnail && (
        <div
          style={{
            marginTop: 8,
            padding: "7px 10px",
            borderRadius: 6,
            background: `${C.wn}0c`,
            border: `1px solid ${C.wn}28`,
            fontSize: 11,
            color: C.wn,
            lineHeight: 1.5,
          }}
        >
          🖼️ <strong>썸네일 카피:</strong> {script.thumbnail}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * 재사용 보조
 * ============================================================ */

function SectionTitle({ children, color = "#E2E8F0" }) {
  return (
    <h4
      style={{
        margin: "0 0 10px",
        fontSize: 13,
        fontWeight: 800,
        color,
      }}
    >
      {children}
    </h4>
  );
}

function SubSection({ label, color, children }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color,
          letterSpacing: 1.2,
          marginBottom: 3,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 12, color: C.td, lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
}

function CTAButton({ ctaKey, onNavigateTab }) {
  const meta = CTA_META[ctaKey];
  if (!meta) return null;

  const isDiagnose = ctaKey === "diagnose";
  const isExternal = !!meta.href;

  const baseStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${C.ac}55`,
    background: "rgba(255,255,255,0.04)",
    color: C.t,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
  };

  const content = (
    <>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{meta.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800 }}>{meta.label}</div>
        <div
          style={{
            fontSize: 11,
            color: C.td,
            fontWeight: 500,
            marginTop: 1,
          }}
        >
          {meta.description}
        </div>
      </div>
      <span style={{ color: C.ac, fontSize: 16 }}>→</span>
    </>
  );

  if (isDiagnose) {
    return (
      <button
        onClick={() => onNavigateTab && onNavigateTab(meta.tabIndex)}
        style={{ ...baseStyle, border: "none", padding: "12px 14px" }}
      >
        {content}
      </button>
    );
  }

  if (isExternal) {
    return (
      <a
        href={meta.href}
        target={meta.href.startsWith("http") ? "_blank" : undefined}
        rel={meta.href.startsWith("http") ? "noopener noreferrer" : undefined}
        style={baseStyle}
      >
        {content}
      </a>
    );
  }

  return null;
}
