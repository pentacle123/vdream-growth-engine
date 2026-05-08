"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
} from "recharts";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";
import {
  TAG_COLOR,
  aggregateGroups,
  aggregateTotals,
  aggregateByTag,
  flattenKeywords,
} from "@/data/naverAdData";
import { useData, DATA_KEYS } from "@/contexts/DataContext";

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

export default function CampaignDiagnosis() {
  const { data } = useData();
  const naverAd = data[DATA_KEYS.naverAd];
  const totals = useMemo(() => aggregateTotals(naverAd), [naverAd]);
  const groups = useMemo(() => aggregateGroups(naverAd), [naverAd]);
  const byTag = useMemo(() => aggregateByTag(naverAd), [naverAd]);
  const rows = useMemo(() => flattenKeywords(naverAd), [naverAd]);

  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("imp");
  const [sortDir, setSortDir] = useState("desc");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") {
        return sortDir === "asc"
          ? av.localeCompare(bv)
          : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaign-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totals,
          groups,
          byTag,
          sampleKeywords: rows
            .slice()
            .sort((a, b) => b.cost - a.cost || b.imp - a.imp)
            .slice(0, 12),
        }),
      });
      const data = await res.json();
      setDiagnosis(data);
    } catch {
      setDiagnosis({
        problems: [{ title: "네트워크 오류", desc: "진단을 불러오지 못했습니다." }],
        solutions: [],
        quickWins: [],
        fallback: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 경고 배너 */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          background: `linear-gradient(135deg, ${C.rd}1a, ${C.am}10)`,
          border: `1px solid ${C.rd}55`,
          color: C.rd,
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>⚠️</span>
        <span style={{ flex: 1 }}>
          전체 캠페인 전환율 0% — 광고비 집행 중이나 전환 0건
        </span>
        <span style={{ fontSize: 11, color: C.am, fontWeight: 600 }}>
          즉시 진단 필요
        </span>
      </div>

      {/* KPI 카드 4개 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <KpiCard label="총 노출수" value={totals.imp.toLocaleString("ko-KR")} sub="회" color={C.t} />
        <KpiCard label="총 클릭수" value={totals.click.toLocaleString("ko-KR")} sub="회" color={C.bl} />
        <KpiCard label="평균 CTR" value={`${totals.ctr.toFixed(2)}%`} sub={`CPC 평균 ${Math.round(totals.avgCpc).toLocaleString("ko-KR")}원`} color={C.am} />
        <KpiCard label="총 비용 / 전환" value={`${Math.round(totals.cost / 1000).toLocaleString("ko-KR")}천원`} sub={`전환 ${totals.conv}건`} color={totals.conv === 0 ? C.rd : C.ac} alert={totals.conv === 0} />
      </div>

      {/* 그룹별 성과 차트 + 태그 도넛 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Card style={{ padding: 14 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: C.bl, letterSpacing: 1 }}>
            📊 광고그룹별 성과
          </h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={groups} margin={{ top: 12, right: 8, left: -12, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: C.td, fontSize: 9 }} axisLine={{ stroke: C.bl2 }} tickLine={false} interval={0} angle={-12} textAnchor="end" height={48} />
                <YAxis tick={{ fill: C.td, fontSize: 9 }} axisLine={{ stroke: C.bl2 }} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v} />
                <Tooltip cursor={{ fill: "#F8FAFC" }} contentStyle={{ background: C.sa, border: `1px solid ${C.bl2}`, borderRadius: 8, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10, color: C.td }} />
                <Bar dataKey="imp" name="노출" fill={C.bl} radius={[4, 4, 0, 0]} />
                <Bar dataKey="click" name="클릭" fill={C.ac} radius={[4, 4, 0, 0]} />
                <Bar dataKey="cost" name="비용(원)" fill={C.am} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card style={{ padding: 14 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 800, color: C.pp, letterSpacing: 1 }}>
            🥧 키워드 분류 분포
          </h3>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byTag} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3} stroke="none" label={({ name, value }) => `${name} ${value}`} labelLine={false} fontSize={10}>
                  {byTag.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: C.sa, border: `1px solid ${C.bl2}`, borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 키워드 테이블 */}
      <Card style={{ padding: 0, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.bl2}`, display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: C.ac, letterSpacing: 1 }}>
            📋 전체 키워드 ({rows.length}개)
          </h3>
          <span style={{ fontSize: 10, color: C.tm }}>
            전환 0건 행은 빨간색 강조
          </span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760, fontSize: 11 }}>
            <thead>
              <tr style={{ background: C.sh }}>
                <Th onClick={() => toggleSort("group")} sortKey={sortKey} dir={sortDir} k="group">그룹</Th>
                <Th onClick={() => toggleSort("kw")} sortKey={sortKey} dir={sortDir} k="kw">키워드</Th>
                <Th onClick={() => toggleSort("imp")} sortKey={sortKey} dir={sortDir} k="imp" align="right">노출</Th>
                <Th onClick={() => toggleSort("click")} sortKey={sortKey} dir={sortDir} k="click" align="right">클릭</Th>
                <Th onClick={() => toggleSort("ctr")} sortKey={sortKey} dir={sortDir} k="ctr" align="right">CTR</Th>
                <Th onClick={() => toggleSort("cpc")} sortKey={sortKey} dir={sortDir} k="cpc" align="right">CPC</Th>
                <Th onClick={() => toggleSort("cost")} sortKey={sortKey} dir={sortDir} k="cost" align="right">비용</Th>
                <Th onClick={() => toggleSort("conv")} sortKey={sortKey} dir={sortDir} k="conv" align="right">전환</Th>
                <Th onClick={() => toggleSort("tag")} sortKey={sortKey} dir={sortDir} k="tag">태그</Th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((r, i) => {
                const zero = r.conv === 0;
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${C.bl2}` }}>
                    <Td><span style={{ color: C.tm, fontSize: 10 }}>{r.group}</span></Td>
                    <Td><span style={{ color: zero && r.imp > 0 ? C.rd : C.t, fontWeight: 600 }}>{r.kw}</span></Td>
                    <Td align="right"><span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.t }}>{r.imp.toLocaleString("ko-KR")}</span></Td>
                    <Td align="right"><span style={{ fontFamily: "'JetBrains Mono', monospace", color: r.click === 0 ? C.tm : C.bl }}>{r.click}</span></Td>
                    <Td align="right"><span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.td }}>{r.ctr}%</span></Td>
                    <Td align="right"><span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.td }}>{r.cpc > 0 ? r.cpc.toLocaleString("ko-KR") : "—"}</span></Td>
                    <Td align="right"><span style={{ fontFamily: "'JetBrains Mono', monospace", color: r.cost > 0 ? C.am : C.tm }}>{r.cost.toLocaleString("ko-KR")}</span></Td>
                    <Td align="right"><span style={{ fontFamily: "'JetBrains Mono', monospace", color: r.conv === 0 ? C.rd : C.ac, fontWeight: 700 }}>{r.conv}</span></Td>
                    <Td><Badge color={TAG_COLOR[r.tag] || C.tm}>{r.tag}</Badge></Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI 진단 버튼 */}
      <button
        onClick={runDiagnosis}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 12,
          border: "none",
          background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
          color: "#000",
          fontSize: 14,
          fontWeight: 900,
          cursor: loading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {loading ? <Spinner color="#000" /> : "🤖"}{" "}
        {loading ? "Claude가 캠페인 분석 중..." : "AI 캠페인 진단 실행"}
      </button>

      {/* 진단 결과 */}
      {diagnosis && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {diagnosis.fallback && (
            <div style={{ padding: "8px 12px", borderRadius: 8, background: `${C.am}10`, border: `1px solid ${C.am}33`, color: C.am, fontSize: 11 }}>
              ⚠ 샘플 진단 (API 키 미설정 또는 오류)
            </div>
          )}

          <DiagnosticSection
            title="📉 발견된 문제점"
            color={C.rd}
            items={diagnosis.problems || []}
          />
          <DiagnosticSection
            title="💡 개선안"
            color={C.ac}
            items={diagnosis.solutions || []}
          />
          <DiagnosticSection
            title="⚡ 즉시 조치 (1~3주)"
            color={C.am}
            items={diagnosis.quickWins || []}
          />
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, sub, color, alert }) {
  return (
    <Card style={{ padding: 12, borderColor: alert ? `${color}55` : `${color}33` }}>
      <div style={{ fontSize: 10, color: C.tm, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 900, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>
        {value}
        {sub && <span style={{ fontSize: 10, color: C.tm, marginLeft: 4, fontWeight: 500 }}>{sub}</span>}
      </div>
    </Card>
  );
}

function Th({ children, onClick, sortKey, dir, k, align = "left" }) {
  const active = sortKey === k;
  return (
    <th
      onClick={onClick}
      style={{
        padding: "9px 11px",
        textAlign: align,
        fontSize: 10,
        color: active ? C.ac : C.tm,
        fontWeight: 700,
        letterSpacing: 0.5,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {children}
      {active && <span style={{ marginLeft: 4, fontSize: 9 }}>{dir === "asc" ? "▲" : "▼"}</span>}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return <td style={{ padding: "8px 11px", textAlign: align }}>{children}</td>;
}

function DiagnosticSection({ title, color, items }) {
  if (!items.length) return null;
  return (
    <Card style={{ borderColor: `${color}33` }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 800, color }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: C.sa,
              borderLeft: `3px solid ${color}`,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: C.t, marginBottom: 4 }}>
              {it.title}
            </div>
            <div style={{ fontSize: 11, color: C.td, lineHeight: 1.6 }}>{it.desc}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
