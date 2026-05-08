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
  parseCreator,
} from "@/data/opportunities";
import { SEARCH_DATA } from "@/data/searchData";

const C = {
  bg: "#FFFFFF",
  sf: "#F8FAFC",
  sa: "#F1F5F9",
  sh: "#E2E8F0",
  ac: "#00C9A7",
  bl: "#1D85EB",
  wn: "#F59E0B",
  rd: "#EF4444",
  pp: "#A78BFA",
  t: "#0F172A",
  td: "#334155",
  tm: "#64748B",
  b: "#E2E8F0",
  bl2: "#CBD5E1",
};

/* ============================================================
 * 메인 컨테이너 — 3-depth 상태머신
 * ============================================================ */

export default function ShortformTab({ onNavigate }) {
  const [view, setView] = useState({ type: "home" });

  const totalSearch = useMemo(
    () => SEARCH_DATA.reduce((acc, k) => acc + (k.volumeTotal || 0), 0),
    []
  );

  const goHome = () => setView({ type: "home" });
  const goList = (catKey) => setView({ type: "list", catKey });
  const goDetail = (id) => setView({ type: "detail", id });

  return (
    <div>
      <Header totalSearch={totalSearch} />
      <Breadcrumb view={view} onHome={goHome} onList={goList} />

      {view.type === "home" && <CategoryHome onSelect={goList} />}
      {view.type === "list" && (
        <OpportunityList catKey={view.catKey} onSelect={goDetail} onBack={goHome} />
      )}
      {view.type === "detail" && (
        <OpportunityDetail
          id={view.id}
          onBack={() => goList(findOpportunity(view.id)?.cat)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

/* ============================================================
 * 헤더
 * ============================================================ */

function Header({ totalSearch }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: C.t, margin: 0 }}>
          🎬 기회 발견 & 콘텐츠 전략
        </h2>
        <Badge color={C.ac}>전체 기회 {OPPORTUNITIES.length}개</Badge>
      </div>
      <p style={{ fontSize: 12, color: C.td, margin: "4px 0 0", lineHeight: 1.6 }}>
        ListeningMind 실데이터 기반 — 연간 검색 시그널{" "}
        <span style={{ color: C.ac, fontWeight: 700 }}>
          {totalSearch.toLocaleString("ko-KR")}회+
        </span>
        {" · "}트립닷컴 Brandformance Engine 방법론 적용
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
      ? findCategory(view.catKey)
      : view.type === "detail"
      ? (() => {
          const opp = findOpportunity(view.id);
          return opp ? findCategory(opp.cat) : null;
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
        🏠 홈
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
            {cat.icon} 카테고리 {cat.key} · {cat.title}
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
                position: "relative",
                padding: "20px 22px 20px 26px",
                background: `linear-gradient(135deg, ${cat.color}14 0%, ${cat.color}04 100%)`,
                border: `1px solid ${cat.color}44`,
                transition: "all 0.2s ease",
                overflow: "hidden",
              }}
            >
              {/* 좌측 액센트 바 */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 22,
                  bottom: 22,
                  width: 4,
                  background: `linear-gradient(180deg, ${cat.color}, ${cat.color}44)`,
                  borderRadius: "0 4px 4px 0",
                }}
              />

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
                      CATEGORY {cat.key}
                    </span>
                    <Badge color={cat.color}>{opps.length}개 기회</Badge>
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
                      margin: "6px 0 12px",
                      fontSize: 12,
                      color: C.td,
                      lineHeight: 1.6,
                    }}
                  >
                    {cat.tagline}
                  </p>

                  {/* 이모지 그룹 */}
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginBottom: 10,
                      fontSize: 18,
                    }}
                  >
                    {opps.map((o) => (
                      <span key={o.id} title={o.title}>{o.emoji}</span>
                    ))}
                  </div>

                  {/* 대표 기회 3개 미리보기 */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {opps
                      .slice()
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((o) => (
                        <span
                          key={o.id}
                          style={{
                            padding: "4px 9px",
                            borderRadius: 999,
                            background: "#F1F5F9",
                            border: `1px solid ${cat.color}22`,
                            fontSize: 11,
                            color: C.td,
                            fontWeight: 500,
                          }}
                        >
                          {o.emoji} {o.title}
                        </span>
                      ))}
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 12,
                      fontWeight: 700,
                      color: cat.color,
                    }}
                  >
                    기회 보기 →
                  </div>
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

function OpportunityList({ catKey, onSelect }) {
  const cat = findCategory(catKey);
  const opps = byCategory(catKey).sort((a, b) => b.score - a.score);
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
            카테고리 {cat.key} · {cat.title}
          </h3>
          <Badge color={cat.color}>{opps.length}개</Badge>
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
  const topContent = opp.contents
    .slice()
    .sort((a, b) => b.score - a.score)[0];
  const scoreColor = opp.score >= 90 ? C.ac : opp.score >= 80 ? C.bl : C.wn;

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
            <span style={{ fontSize: 24 }}>{opp.emoji}</span>
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
                fontSize: 18,
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

        <ProgressBar value={opp.score} color={scoreColor} height={3} />

        <div
          style={{
            fontSize: 11,
            color: C.td,
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          🎯 {opp.target}
        </div>

        {/* 대표 콘텐츠 1개 미리보기 */}
        {topContent && (
          <div
            style={{
              padding: "7px 9px",
              borderRadius: 7,
              background: C.sa,
              fontSize: 11,
              color: C.td,
              lineHeight: 1.4,
              borderLeft: `3px solid ${catColor}`,
            }}
          >
            <div style={{ display: "flex", gap: 5, marginBottom: 3 }}>
              <Badge color={C.wn}>{topContent.type}</Badge>
              <Badge color={C.tm} background={C.sh}>
                {topContent.dur}
              </Badge>
            </div>
            <div style={{ color: C.t, fontWeight: 600 }}>
              "{topContent.title}"
            </div>
          </div>
        )}
      </Card>
    </button>
  );
}

/* ============================================================
 * Depth 2: 기회 상세
 * ============================================================ */

function OpportunityDetail({ id, onBack, onNavigate }) {
  const opp = findOpportunity(id);
  const cat = opp ? findCategory(opp.cat) : null;
  const [scripts, setScripts] = useState({});
  const [loading, setLoading] = useState({});

  if (!opp || !cat) return null;

  const generate = async (idx) => {
    const content = opp.contents[idx];
    setLoading((p) => ({ ...p, [idx]: true }));
    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity: opp, content }),
      });
      const data = await res.json();
      setScripts((p) => ({ ...p, [idx]: data }));
    } catch {
      setScripts((p) => ({
        ...p,
        [idx]: {
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
      setLoading((p) => ({ ...p, [idx]: false }));
    }
  };

  const scoreColor = opp.score >= 90 ? C.ac : opp.score >= 80 ? C.bl : C.wn;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* 1. 기회 정의 (히어로) */}
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
            marginBottom: 12,
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

        <SubSection label="🎯 타겟" color={cat.color}>
          {opp.target}
        </SubSection>
        <SubSection label="💡 핵심 인사이트" color={cat.color}>
          {opp.insight}
        </SubSection>
      </Card>

      {/* 2. 검색 데이터 시그널 */}
      <Card>
        <SectionTitle>🔎 검색 데이터 시그널</SectionTitle>
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: C.sa,
            fontSize: 12,
            color: C.td,
            lineHeight: 1.6,
            borderLeft: `3px solid ${C.pp}`,
          }}
        >
          {opp.signal}
        </div>
      </Card>

      {/* 3. 숏폼 콘텐츠 전략 + AI 스크립트 */}
      <Card>
        <SectionTitle>📝 숏폼 콘텐츠 전략 ({opp.contents.length})</SectionTitle>
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

      {/* 4. 추천 크리에이터 */}
      <Card>
        <SectionTitle>🤝 추천 크리에이터</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {opp.creators.map((cr, i) => {
            const parsed = parseCreator(cr);
            const fitColor =
              parsed.fit >= 90 ? C.ac : parsed.fit >= 80 ? C.bl : C.wn;
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
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.t }}>
                    {parsed.name}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: fitColor,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    적합도 {parsed.fit}%
                  </span>
                </div>
                {parsed.fit > 0 && (
                  <ProgressBar value={parsed.fit} color={fitColor} height={4} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5+6. 플랫폼 + 시즌 */}
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
            {opp.season || "연중 상시"}
          </div>
        </Card>
      </div>

      {/* 7. CTA */}
      <Card
        style={{
          padding: 18,
          background: `linear-gradient(135deg, ${C.ac}14 0%, ${C.bl}14 100%)`,
          border: `1px solid ${C.ac}44`,
        }}
      >
        <SectionTitle color={C.ac}>🚀 이 기회의 CTA</SectionTitle>
        <CTAButton ctaKey={opp.cta} onNavigate={onNavigate} />
      </Card>

      <button
        onClick={onBack}
        style={{
          padding: 10,
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
 * 콘텐츠 아이템 + AI 스크립트
 * ============================================================ */

function ContentBlock({ content, catColor, script, loading, onGenerate }) {
  const scoreColor =
    content.score >= 90 ? C.ac : content.score >= 80 ? C.bl : C.wn;
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
          <div style={{ display: "flex", gap: 5, marginBottom: 4, flexWrap: "wrap" }}>
            <Badge color={C.wn}>{content.type}</Badge>
            <Badge color={C.tm} background={C.sh}>
              {content.dur}
            </Badge>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.t }}>
            "{content.title}"
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: C.tm }}>임팩트</div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: scoreColor,
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 1,
            }}
          >
            {content.score}
          </div>
        </div>
      </div>

      <ProgressBar value={content.score} color={scoreColor} height={3} />

      <button
        onClick={onGenerate}
        disabled={loading}
        style={{
          marginTop: 9,
          width: "100%",
          padding: 9,
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
        {loading ? "Claude가 스크립트 작성 중..." : "🤖 AI 숏폼 스크립트 생성"}
      </button>

      {script && <ScriptOutput script={script} catColor={catColor} />}
    </div>
  );
}

function ScriptOutput({ script, catColor }) {
  const scenes = [
    { label: "HOOK", key: "hook", color: C.rd, emoji: "🎣", sec: "0~3초" },
    { label: "PROBLEM", key: "problem", color: C.wn, emoji: "❓", sec: "3~13초" },
    { label: "SOLUTION", key: "solution", color: C.ac, emoji: "💡", sec: "13~33초" },
    { label: "PROOF", key: "proof", color: C.bl, emoji: "📊", sec: "33~38초" },
    { label: "CTA", key: "cta", color: C.pp, emoji: "🚀", sec: "38~40초" },
  ];

  const allText = scenes
    .filter((s) => script[s.key])
    .map((s) => `[${s.label}] ${script[s.key]}`)
    .join("\n");

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(allText);
    } catch {
      window.prompt("복사하세요:", allText);
    }
  };

  const copyCaption = async () => {
    if (!script.caption) return;
    const txt = [
      script.caption,
      "",
      Array.isArray(script.hashtags) ? script.hashtags.join(" ") : "",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      window.prompt("복사하세요:", txt);
    }
  };

  return (
    <div
      style={{
        marginTop: 10,
        padding: 12,
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
            marginBottom: 8,
            fontStyle: "italic",
          }}
        >
          ⚠ 샘플 스크립트 (API 키 미설정 또는 오류)
        </div>
      )}

      {/* 씬별 카드 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {scenes.map((s) => {
          if (!script[s.key]) return null;
          return (
            <div key={s.key}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 3,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: s.color,
                    letterSpacing: 1.5,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {s.emoji} {s.label}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    color: C.tm,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {s.sec}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.t,
                  lineHeight: 1.5,
                  padding: "6px 9px",
                  borderRadius: 6,
                  background: C.sa,
                  borderLeft: `3px solid ${s.color}`,
                }}
              >
                {script[s.key]}
              </div>
            </div>
          );
        })}
      </div>

      {/* 캡션 */}
      {script.caption && (
        <div style={{ marginTop: 9 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: C.ac,
              letterSpacing: 1.5,
              marginBottom: 3,
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
              padding: "7px 9px",
              borderRadius: 6,
              background: C.sa,
              whiteSpace: "pre-wrap",
            }}
          >
            {script.caption}
          </div>
        </div>
      )}

      {/* 해시태그 */}
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

      {/* 썸네일 */}
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

      {/* 복사 버튼 */}
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <button
          onClick={copyAll}
          style={btnStyle(C.ac)}
        >
          📋 전체 복사
        </button>
        {script.caption && (
          <button onClick={copyCaption} style={btnStyle(C.bl)}>
            📝 캡션 복사
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * 보조 컴포넌트
 * ============================================================ */

function SectionTitle({ children, color = "#0F172A" }) {
  return (
    <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color }}>
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

function CTAButton({ ctaKey, onNavigate }) {
  const meta = CTA_META[ctaKey];
  if (!meta) return null;

  const isDiagnose = !!meta.view;
  const baseStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${C.ac}55`,
    background: "#F1F5F9",
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
        onClick={() => onNavigate && onNavigate(meta.view)}
        style={{ ...baseStyle, border: "none" }}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={meta.href}
      target={meta.href?.startsWith("http") ? "_blank" : undefined}
      rel={meta.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      style={baseStyle}
    >
      {content}
    </a>
  );
}

function btnStyle(color) {
  return {
    flex: 1,
    padding: "8px",
    borderRadius: 7,
    border: `1px solid ${color}55`,
    background: `${color}12`,
    color,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  };
}
