"use client";

import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { AD_CHANNELS, projectChannel } from "@/data/adChannels";

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

export default function CrossChannel() {
  const [budget, setBudget] = useState(10_000_000); // 월 1천만원
  const [allocations, setAllocations] = useState(
    AD_CHANNELS.reduce((acc, c) => ({ ...acc, [c.key]: c.budget }), {})
  );

  const totalPct = useMemo(
    () => Object.values(allocations).reduce((a, b) => a + b, 0),
    [allocations]
  );
  const isBalanced = totalPct === 100;

  const setPct = (key, value) => {
    setAllocations((prev) => ({ ...prev, [key]: Math.max(0, Math.min(100, Number(value) || 0)) }));
  };

  const resetDefault = () => {
    setAllocations(
      AD_CHANNELS.reduce((acc, c) => ({ ...acc, [c.key]: c.budget }), {})
    );
  };

  const projections = useMemo(() => {
    return AD_CHANNELS.map((ch) => {
      const pct = allocations[ch.key] || 0;
      const proj = projectChannel(ch, budget, pct);
      return { ch, pct, ...proj };
    });
  }, [allocations, budget]);

  const totals = useMemo(() => {
    return projections.reduce(
      (acc, p) => ({
        impressions: acc.impressions + p.impressions,
        clicks: acc.clicks + p.clicks,
        leads: acc.leads + p.leads,
      }),
      { impressions: 0, clicks: 0, leads: 0 }
    );
  }, [projections]);

  const pieData = projections
    .filter((p) => p.pct > 0)
    .map((p) => ({ name: p.ch.name, value: p.pct, color: p.ch.color }));

  return (
    <div>
      {/* 채널별 전략 카드 */}
      <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: C.t }}>
        🌐 채널별 전략 (Phase 1 정적 데이터)
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 10,
          marginBottom: 18,
        }}
      >
        {AD_CHANNELS.map((ch) => (
          <ChannelCard key={ch.key} ch={ch} />
        ))}
      </div>

      {/* 예산 시뮬레이터 */}
      <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color: C.ac }}>
        💰 예산 시뮬레이터
      </h3>
      <Card style={{ padding: 16, marginBottom: 12 }}>
        {/* 슬라이더 */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Label>월 총 광고 예산</Label>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18,
                fontWeight: 900,
                color: C.ac,
              }}
            >
              {(budget / 10000).toLocaleString("ko-KR")}만원
            </span>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={50_000_000}
            step={500_000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{ width: "100%", accentColor: C.ac }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.tm, marginTop: 3 }}>
            <span>100만원</span>
            <span>5,000만원</span>
          </div>
        </div>

        {/* 채널별 슬라이더 + 프로젝션 */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, alignItems: "start" }}>
          {/* 좌: 채널 슬라이더 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 11, color: C.td, fontWeight: 700 }}>
                채널별 배분 (총 {totalPct}%)
              </span>
              <div style={{ display: "flex", gap: 5 }}>
                {!isBalanced && (
                  <Badge color={C.am}>⚠ 100%로 맞춰주세요</Badge>
                )}
                <button
                  onClick={resetDefault}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: `1px solid ${C.bl2}`,
                    background: "transparent",
                    color: C.td,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  기본값 리셋
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {projections.map((p) => (
                <div key={p.ch.key}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 12, color: C.t, fontWeight: 600 }}>
                      <span style={{ marginRight: 5 }}>{p.ch.icon}</span>
                      {p.ch.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: p.ch.color,
                        fontWeight: 800,
                      }}
                    >
                      {p.pct}% · {(p.channelBudget / 10000).toLocaleString("ko-KR")}만원
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={p.pct}
                    onChange={(e) => setPct(p.ch.key, e.target.value)}
                    style={{ width: "100%", accentColor: p.ch.color }}
                  />
                  <div style={{ display: "flex", gap: 6, fontSize: 9, color: C.tm, marginTop: 3 }}>
                    <span>📊 노출 ~{p.impressions.toLocaleString("ko-KR")}</span>
                    <span>·</span>
                    <span>🖱 클릭 ~{p.clicks.toLocaleString("ko-KR")}</span>
                    <span>·</span>
                    <span style={{ color: p.leads > 0 ? C.ac : C.tm, fontWeight: 700 }}>
                      🎯 리드 ~{p.leads}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우: 파이 차트 */}
          <div>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={42}
                    outerRadius={75}
                    paddingAngle={3}
                    stroke="none"
                    label={({ name, value }) => `${value}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: C.sa,
                      border: `1px solid ${C.bl2}`,
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                    formatter={(v, n) => [`${v}%`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: `${C.ac}0c`,
                border: `1px solid ${C.ac}33`,
                marginTop: 8,
              }}
            >
              <div style={{ fontSize: 10, color: C.tm, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                예상 합계
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Row label="📊 총 노출" value={`${totals.impressions.toLocaleString("ko-KR")}회`} color={C.bl} />
                <Row label="🖱 총 클릭" value={`${totals.clicks.toLocaleString("ko-KR")}회`} color={C.am} />
                <Row label="🎯 총 리드" value={`${totals.leads}건`} color={C.ac} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          background: `${C.pp}0a`,
          border: `1px solid ${C.pp}33`,
          fontSize: 11,
          color: C.td,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: C.pp }}>📌 추정 모델:</strong> 채널별 평균 CPC·CTR·리드전환율(B2B 한국 시장 평균)을 적용한 단순 시뮬레이션입니다. 실제 캠페인 데이터 누적 시 보정됩니다.
      </div>
    </div>
  );
}

function ChannelCard({ ch }) {
  return (
    <Card style={{ padding: 14, borderColor: `${ch.color}33` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${ch.color}1a`,
            border: `1px solid ${ch.color}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {ch.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: C.t }}>
              {ch.name}
            </h4>
            <Badge color={ch.color}>{ch.budget}%</Badge>
            <Badge color={ch.statusColor}>{ch.status}</Badge>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.td, lineHeight: 1.5 }}>
            {ch.role}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <Mini label="타겟" value={ch.target} />
        <Mini label="랜딩" value={ch.landing} />
        <Mini label="KPI" value={ch.kpi} />
        <Mini label="이슈" value={ch.issue} color={C.am} />
      </div>
    </Card>
  );
}

function Mini({ label, value, color = C.td }) {
  return (
    <div
      style={{
        padding: "6px 8px",
        borderRadius: 6,
        background: C.sa,
        fontSize: 10,
      }}
    >
      <div style={{ color: C.tm, fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div style={{ color, fontWeight: 600, lineHeight: 1.4 }}>{value}</div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11, color: C.td }}>{label}</span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          fontWeight: 800,
          color,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Label({ children }) {
  return (
    <span style={{ fontSize: 11, color: C.td, fontWeight: 700, letterSpacing: 0.5 }}>
      {children}
    </span>
  );
}
