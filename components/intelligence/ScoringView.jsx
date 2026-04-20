"use client";

import { useMemo } from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import ProgressBar from "../ui/ProgressBar";
import { calculateScore, TIER_META } from "@/data/targetCompanies";
import { formatWon } from "@/lib/calculate";

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

const BREAKDOWN_LABELS = {
  penalty: { label: "예상 부담금", weight: 40, color: C.rd },
  size: { label: "기업 규모", weight: 20, color: C.bl },
  industry: { label: "업종 적합도", weight: 20, color: C.ac },
  region: { label: "지역 접근성", weight: 10, color: C.pp },
  severity: { label: "미고용 심각도", weight: 10, color: C.wn },
};

export default function ScoringView({ companies, onSelect }) {
  const ranked = useMemo(() => {
    return companies
      .map((c) => ({ c, s: calculateScore(c) }))
      .sort((a, b) => b.s.total - a.s.total);
  }, [companies]);

  const stats = useMemo(() => {
    const total = ranked.length;
    const avg = Math.round(
      ranked.reduce((a, r) => a + r.s.total, 0) / total
    );
    const hot = ranked.filter((r) => r.s.tier === "hot").length;
    const warm = ranked.filter((r) => r.s.tier === "warm").length;
    const cold = ranked.filter((r) => r.s.tier === "cold").length;
    const totalPenalty = ranked.reduce(
      (a, r) => a + r.c.estimatedPenalty,
      0
    );
    return { total, avg, hot, warm, cold, totalPenalty };
  }, [ranked]);

  return (
    <div>
      {/* 요약 통계 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Card style={{ padding: 12 }}>
          <div style={miniLabel}>전체 기업</div>
          <div style={{ ...bigNum, color: C.t }}>{stats.total}</div>
        </Card>
        <Card style={{ padding: 12 }}>
          <div style={miniLabel}>총 예상 부담금</div>
          <div style={{ ...bigNum, color: C.rd }}>{formatWon(stats.totalPenalty)}</div>
        </Card>
        <Card style={{ padding: 12, borderColor: `${C.rd}33` }}>
          <div style={{ ...miniLabel, color: C.rd }}>🔴 즉시 공략 (90+)</div>
          <div style={{ ...bigNum, color: C.rd }}>{stats.hot}</div>
        </Card>
        <Card style={{ padding: 12, borderColor: `${C.wn}33` }}>
          <div style={{ ...miniLabel, color: C.wn }}>🟡 우선 공략 (70~89)</div>
          <div style={{ ...bigNum, color: C.wn }}>{stats.warm}</div>
        </Card>
        <Card style={{ padding: 12, borderColor: `${TIER_META.cold.color}33` }}>
          <div style={{ ...miniLabel, color: TIER_META.cold.color }}>🟢 일반 관리 (70 미만)</div>
          <div style={{ ...bigNum, color: TIER_META.cold.color }}>{stats.cold}</div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ranked.map(({ c, s }, idx) => (
          <ScoreCard
            key={c.id}
            company={c}
            score={s}
            rank={idx + 1}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ScoreCard({ company, score, rank, onClick }) {
  const tier = TIER_META[score.tier];
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
          borderColor: `${tier.color}33`,
          background: `linear-gradient(90deg, ${tier.color}08, transparent 40%)`,
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${tier.color}22`,
              border: `1px solid ${tier.color}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: tier.color,
              fontFamily: "'JetBrains Mono', monospace",
              flexShrink: 0,
            }}
          >
            #{rank}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 2,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.t }}>
                {company.name}
              </h3>
              <Badge color={tier.color}>
                {tier.emoji} {tier.label}
              </Badge>
            </div>
            <div style={{ fontSize: 11, color: C.tm }}>
              {company.industry} · {company.region} · 상시근로자{" "}
              {company.employees.toLocaleString("ko-KR")}명 · 부족{" "}
              <span style={{ color: C.wn }}>{company.deficit}명</span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 10, color: C.tm }}>우선순위</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: tier.color,
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1,
              }}
            >
              {score.total}
            </div>
          </div>
        </div>

        {/* 메인 바 */}
        <ProgressBar value={score.total} color={tier.color} height={6} />

        {/* 예상 부담금 */}
        <div
          style={{
            marginTop: 10,
            padding: "6px 9px",
            borderRadius: 8,
            background: `${C.rd}0c`,
            border: `1px solid ${C.rd}22`,
            fontSize: 11,
            color: C.td,
          }}
        >
          예상 연간 부담금{" "}
          <span
            style={{
              color: C.rd,
              fontWeight: 800,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {formatWon(company.estimatedPenalty)}
          </span>
        </div>

        {/* 스코어 breakdown */}
        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 6,
          }}
        >
          {Object.entries(BREAKDOWN_LABELS).map(([key, meta]) => {
            const v = score.breakdown[key];
            return (
              <div
                key={key}
                style={{
                  padding: "7px 9px",
                  borderRadius: 7,
                  background: C.sa,
                  border: `1px solid rgba(255,255,255,0.04)`,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: C.tm,
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                >
                  {meta.label} · {meta.weight}%
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: meta.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    marginBottom: 4,
                  }}
                >
                  {v}
                </div>
                <ProgressBar value={v} color={meta.color} height={3} />
              </div>
            );
          })}
        </div>
      </Card>
    </button>
  );
}

const miniLabel = { fontSize: 10, color: "#64748B", fontWeight: 600, marginBottom: 2 };
const bigNum = {
  fontSize: 20,
  fontWeight: 900,
  fontFamily: "'JetBrains Mono', monospace",
  lineHeight: 1.2,
};
