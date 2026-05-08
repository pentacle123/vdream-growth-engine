"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";
import Spinner from "./ui/Spinner";
import {
  PIPELINE_STAGES,
  CHANNEL_PERFORMANCE,
  MONTHLY_TREND,
  TREND_METRICS,
} from "@/data/dashboardData";

const C = {
  bg: "#FFFFFF",
  sf: "#F8FAFC",
  sa: "#F1F5F9",
  sh: "#E2E8F0",
  ac: "#00C9A7",
  bl: "#1D85EB",
  pp: "#A78BFA",
  am: "#F59E0B",
  rd: "#EF4444",
  gn: "#10B981",
  t: "#0F172A",
  td: "#334155",
  tm: "#64748B",
  bl2: "#CBD5E1",
};

export default function DashboardView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <DashboardHero />
      <PipelineFunnel />
      <ChannelPerformance />
      <MonthlyTrend />
      <AIMonthlyReport />
      <RevenueShareCalculator />
    </div>
  );
}

/* ============================================================
 * 헤더
 * ============================================================ */

function DashboardHero() {
  return (
    <div
      style={{
        padding: "18px 22px",
        borderRadius: 14,
        background: `linear-gradient(135deg, ${C.bl}14 0%, ${C.ac}10 100%)`,
        border: `1px solid ${C.bl}33`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: C.bl,
          letterSpacing: 3,
          marginBottom: 4,
        }}
      >
        PERFORMANCE DASHBOARD
      </div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.t }}>
        📊 성과 대시보드
      </h2>
      <p style={{ margin: "6px 0 0", fontSize: 12, color: C.td, lineHeight: 1.6 }}>
        리드 파이프라인 · 채널별 성과 · 월별 트렌드 · AI 월간 리포트 · Pentacle 수익 쉐어 추적
      </p>
    </div>
  );
}

/* ============================================================
 * Section 1: 리드 파이프라인 퍼널
 * ============================================================ */

function PipelineFunnel() {
  const max = PIPELINE_STAGES[0].count;
  return (
    <Card>
      <SectionTitle icon="🌪" color={C.pp}>
        리드 파이프라인 퍼널
      </SectionTitle>
      <p style={{ margin: "0 0 12px", fontSize: 11, color: C.tm }}>
        숏폼/DA 노출에서 계약까지의 전환 흐름. 단계별 전환율 자동 계산.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {PIPELINE_STAGES.map((s, i) => {
          const widthPct = (s.count / max) * 100;
          const prev = PIPELINE_STAGES[i - 1];
          const conv = prev ? (s.count / prev.count) * 100 : 100;
          return (
            <div key={s.stage}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 4,
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.t,
                    flexShrink: 0,
                    width: 140,
                  }}
                >
                  {i + 1}. {s.stage}
                </span>
                <span style={{ flex: 1 }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 800,
                    color: s.color,
                  }}
                >
                  {s.count.toLocaleString("ko-KR")}
                </span>
                {prev && (
                  <span
                    style={{
                      fontSize: 11,
                      color: conv >= 50 ? C.ac : conv >= 20 ? C.am : C.rd,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      width: 56,
                      textAlign: "right",
                    }}
                  >
                    {conv.toFixed(1)}%
                  </span>
                )}
              </div>
              <div
                style={{
                  width: "100%",
                  height: 18,
                  background: C.sa,
                  borderRadius: 6,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: `${widthPct}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${s.color}, ${s.color}99)`,
                    transition: "width 0.6s",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 종합 전환율 */}
      <div
        style={{
          marginTop: 12,
          padding: "10px 12px",
          borderRadius: 8,
          background: `${C.ac}0c`,
          border: `1px solid ${C.ac}33`,
          fontSize: 12,
          color: C.td,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: C.ac }}>🎯 노출 → 계약 전환율:</strong>{" "}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: C.ac,
            fontWeight: 800,
          }}
        >
          {(
            (PIPELINE_STAGES[PIPELINE_STAGES.length - 1].count /
              PIPELINE_STAGES[0].count) *
            100
          ).toFixed(3)}
          %
        </span>
        {" · "}
        <span style={{ color: C.bl }}>진단기→리드</span>{" "}
        <strong>
          {(
            (PIPELINE_STAGES[3].count / PIPELINE_STAGES[1].count) *
            100
          ).toFixed(1)}
          %
        </strong>
        {" · "}
        <span style={{ color: C.am }}>리드→상담</span>{" "}
        <strong>
          {((PIPELINE_STAGES[4].count / PIPELINE_STAGES[3].count) * 100).toFixed(1)}%
        </strong>
        {" · "}
        <span style={{ color: C.gn }}>상담→계약</span>{" "}
        <strong>
          {((PIPELINE_STAGES[6].count / PIPELINE_STAGES[4].count) * 100).toFixed(1)}%
        </strong>
      </div>
    </Card>
  );
}

/* ============================================================
 * Section 2: 채널별 성과 비교
 * ============================================================ */

function ChannelPerformance() {
  const sortedByEfficiency = useMemo(
    () => [...CHANNEL_PERFORMANCE].sort((a, b) => a.cpa - b.cpa),
    []
  );
  const bestChannel = sortedByEfficiency[0];
  const worstChannel = sortedByEfficiency[sortedByEfficiency.length - 1];

  return (
    <Card>
      <SectionTitle icon="📡" color={C.bl}>
        채널별 성과 비교
      </SectionTitle>
      <p style={{ margin: "0 0 12px", fontSize: 11, color: C.tm }}>
        리드 / 비용 / CPA / 계약 — CPA 낮은 순으로 효율 비교
      </p>

      {/* AI 코멘트 */}
      <div
        style={{
          marginBottom: 10,
          padding: "10px 12px",
          borderRadius: 8,
          background: `${C.ac}0c`,
          border: `1px solid ${C.ac}33`,
          fontSize: 12,
          color: C.td,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: C.ac }}>🤖 AI 코멘트:</strong>{" "}
        가장 효율적인 채널은 <strong style={{ color: C.ac }}>{bestChannel.channel}</strong> (CPA{" "}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.ac }}>
          {bestChannel.cpa.toLocaleString("ko-KR")}원
        </span>
        ). 가장 비효율은{" "}
        <strong style={{ color: C.rd }}>{worstChannel.channel}</strong> (CPA{" "}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.rd }}>
          {worstChannel.cpa.toLocaleString("ko-KR")}원
        </span>
        ) — 예산 재분배 검토 권장.
      </div>

      {/* BarChart */}
      <div style={{ width: "100%", height: 240, marginBottom: 12 }}>
        <ResponsiveContainer>
          <BarChart
            data={CHANNEL_PERFORMANCE}
            margin={{ top: 18, right: 8, left: -12, bottom: 0 }}
          >
            <XAxis
              dataKey="channel"
              tick={{ fill: C.td, fontSize: 10 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fill: C.td, fontSize: 10 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString("ko-KR")}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              contentStyle={{
                background: C.sa,
                border: `1px solid ${C.bl2}`,
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 10, color: C.td }} />
            <Bar dataKey="leads" name="리드" fill={C.bl} radius={[4, 4, 0, 0]}>
              <LabelList dataKey="leads" position="top" fill={C.t} fontSize={10} fontWeight={700} />
            </Bar>
            <Bar dataKey="conv" name="계약" fill={C.ac} radius={[4, 4, 0, 0]}>
              <LabelList dataKey="conv" position="top" fill={C.t} fontSize={10} fontWeight={700} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 테이블 */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 560 }}>
          <thead>
            <tr style={{ background: C.sh }}>
              <Th>채널</Th>
              <Th align="right">리드</Th>
              <Th align="right">비용</Th>
              <Th align="right">CPA</Th>
              <Th align="right">계약</Th>
              <Th align="center">효율</Th>
            </tr>
          </thead>
          <tbody>
            {sortedByEfficiency.map((c, i) => {
              const isBest = i === 0;
              const isWorst = i === sortedByEfficiency.length - 1;
              return (
                <tr key={c.channel} style={{ borderTop: `1px solid ${C.bl2}` }}>
                  <Td>
                    <span style={{ color: C.t, fontWeight: 700 }}>{c.channel}</span>
                  </Td>
                  <Td align="right">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.bl }}>
                      {c.leads}
                    </span>
                  </Td>
                  <Td align="right">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.am }}>
                      {Math.round(c.cost / 10000).toLocaleString("ko-KR")}만원
                    </span>
                  </Td>
                  <Td align="right">
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isBest ? C.ac : isWorst ? C.rd : C.t,
                        fontWeight: 700,
                      }}
                    >
                      {c.cpa.toLocaleString("ko-KR")}원
                    </span>
                  </Td>
                  <Td align="right">
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: c.conv > 0 ? C.ac : C.tm,
                        fontWeight: 700,
                      }}
                    >
                      {c.conv}
                    </span>
                  </Td>
                  <Td align="center">
                    {isBest ? (
                      <Badge color={C.ac}>🏆 최고</Badge>
                    ) : isWorst ? (
                      <Badge color={C.rd}>⚠ 검토</Badge>
                    ) : (
                      <Badge color={C.tm}>—</Badge>
                    )}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ============================================================
 * Section 3: 월별 트렌드
 * ============================================================ */

function MonthlyTrend() {
  const [active, setActive] = useState(["leads", "consultations", "contracts"]);

  const toggle = (key) => {
    setActive((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Card>
      <SectionTitle icon="📈" color={C.am}>
        월별 트렌드
      </SectionTitle>
      <p style={{ margin: "0 0 10px", fontSize: 11, color: C.tm }}>
        최근 6개월 추이 — 1월 피크 시즌 강조. 지표 토글 가능.
      </p>

      {/* 메트릭 토글 */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
        {TREND_METRICS.map((m) => {
          const on = active.includes(m.key);
          return (
            <button
              key={m.key}
              onClick={() => toggle(m.key)}
              style={{
                padding: "5px 10px",
                borderRadius: 999,
                border: on ? `1px solid ${m.color}` : `1px solid ${C.bl2}`,
                background: on ? `${m.color}22` : "transparent",
                color: on ? m.color : C.td,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {on ? "●" : "○"} {m.label}
            </button>
          );
        })}
      </div>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={MONTHLY_TREND} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.bl2} />
            <XAxis
              dataKey="month"
              tick={{ fill: C.td, fontSize: 10 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: C.td, fontSize: 10 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              contentStyle={{
                background: C.sa,
                border: `1px solid ${C.bl2}`,
                borderRadius: 8,
                fontSize: 11,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 10, color: C.td }} />
            {TREND_METRICS.filter((m) => active.includes(m.key)).map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                dot={{ r: 3, fill: m.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: 10,
          padding: "8px 11px",
          borderRadius: 8,
          background: `${C.am}0c`,
          border: `1px solid ${C.am}33`,
          fontSize: 11,
          color: C.am,
          lineHeight: 1.6,
        }}
      >
        🔥 <strong>2026.01 피크</strong> — 부담금 신고 시즌으로 노출 65k, 리드 320, 계약 12건. 비수기 대비 4배.
      </div>
    </Card>
  );
}

/* ============================================================
 * Section 4: AI 월간 리포트
 * ============================================================ */

function AIMonthlyReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    const current = MONTHLY_TREND[MONTHLY_TREND.length - 1];
    const previous = MONTHLY_TREND[MONTHLY_TREND.length - 2];
    try {
      const res = await fetch("/api/monthly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, previous }),
      });
      const data = await res.json();
      setReport(data);
    } catch {
      setReport({ summary: "네트워크 오류", fallback: true, highlights: [], issues: [], recommendations: [] });
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    if (!report) return;
    const txt = [
      `[${MONTHLY_TREND[MONTHLY_TREND.length - 1].month} 월간 성과 리포트]`,
      "",
      "■ 핵심 요약",
      report.summary,
      "",
      "■ 하이라이트",
      ...(report.highlights || []).map((h) => `• ${h}`),
      "",
      "■ 개선 필요",
      ...(report.issues || []).map((i) => `• ${i}`),
      "",
      "■ 다음달 액션",
      ...(report.recommendations || []).map((r) => `• ${r}`),
      "",
      "■ 예산 효율",
      report.budget || "",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("복사하세요:", txt);
    }
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <Card>
      <SectionTitle icon="🤖" color={C.ac}>
        AI 월간 리포트
      </SectionTitle>
      <p style={{ margin: "0 0 10px", fontSize: 11, color: C.tm }}>
        Claude가 이번 달 + 전월 데이터를 비교해 월간 성과 리포트를 작성합니다.
      </p>

      <button
        onClick={generate}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "none",
          background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
          color: "#000",
          fontSize: 13,
          fontWeight: 900,
          cursor: loading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? <Spinner color="#000" /> : "🤖"}{" "}
        {loading ? "Claude가 리포트 작성 중..." : `🤖 ${MONTHLY_TREND[MONTHLY_TREND.length - 1].month} 리포트 생성`}
      </button>

      {report && (
        <div style={{ marginTop: 12 }}>
          {report.fallback && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: `${C.am}10`,
                border: `1px solid ${C.am}33`,
                color: C.am,
                fontSize: 11,
                marginBottom: 10,
              }}
            >
              ⚠ 샘플 리포트 (API 키 미설정 또는 오류)
            </div>
          )}

          <div
            style={{
              padding: 18,
              borderRadius: 12,
              background: `linear-gradient(180deg, ${C.sf}, ${C.bg})`,
              border: `1px solid ${C.ac}33`,
              boxShadow: `0 0 24px ${C.ac}14`,
            }}
          >
            <ReportSection label="📌 핵심 요약" color={C.t}>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: C.t, margin: 0 }}>
                {report.summary}
              </p>
            </ReportSection>

            <ReportSection label="✨ 하이라이트" color={C.ac}>
              <ul style={listStyle(C.ac)}>
                {(report.highlights || []).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </ReportSection>

            <ReportSection label="⚠️ 개선 필요" color={C.rd}>
              <ul style={listStyle(C.rd)}>
                {(report.issues || []).map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </ReportSection>

            <ReportSection label="🎯 다음달 액션 아이템" color={C.bl}>
              <ul style={listStyle(C.bl)}>
                {(report.recommendations || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </ReportSection>

            {report.budget && (
              <ReportSection label="💰 예산 효율" color={C.am}>
                <p style={{ fontSize: 12, lineHeight: 1.7, color: C.td, margin: 0 }}>
                  {report.budget}
                </p>
              </ReportSection>
            )}
          </div>

          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button onClick={copyAll} style={btnStyle(copied, C.ac)}>
              {copied ? "✅ 복사됨" : "📋 전체 복사"}
            </button>
            <button onClick={exportPDF} style={btnStyle(false, C.bl)}>
              📄 PDF 인쇄
            </button>
            <button
              onClick={generate}
              disabled={loading}
              style={btnStyle(false, C.tm)}
            >
              🔄 다시 생성
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ============================================================
 * Section 5: 수익 쉐어 추적 (Pentacle)
 * ============================================================ */

function RevenueShareCalculator() {
  const [monthlyRev, setMonthlyRev] = useState(2_000_000);
  const [shareRate, setShareRate] = useState(20);

  const monthly = MONTHLY_TREND.map((m) => ({
    month: m.month,
    contracts: m.contracts,
    annualRev: m.contracts * monthlyRev * 12 * (shareRate / 100),
  }));
  const totalContracts = monthly.reduce((a, b) => a + b.contracts, 0);
  const totalRev = monthly.reduce((a, b) => a + b.annualRev, 0);

  return (
    <Card>
      <SectionTitle icon="🤝" color={C.gn}>
        수익 쉐어 추적 (Pentacle)
      </SectionTitle>
      <p style={{ margin: "0 0 12px", fontSize: 11, color: C.tm }}>
        브이드림 신규 계약 × 월 SaaS 매출 × 12개월 × 쉐어 비율 = Pentacle 예상 ARR
      </p>

      {/* 입력 컨트롤 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div>
          <Label>월 SaaS 매출 / 계약 (원)</Label>
          <input
            type="number"
            value={monthlyRev}
            onChange={(e) => setMonthlyRev(Math.max(0, Number(e.target.value) || 0))}
            min={0}
            step={100000}
            style={inputStyle}
          />
          <div style={{ fontSize: 10, color: C.tm, marginTop: 3 }}>
            기본 200만원
          </div>
        </div>
        <div>
          <Label>Pentacle 쉐어 비율 (%)</Label>
          <input
            type="range"
            min={0}
            max={50}
            value={shareRate}
            onChange={(e) => setShareRate(Number(e.target.value))}
            style={{ width: "100%", accentColor: C.gn }}
          />
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: C.gn,
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: 3,
            }}
          >
            {shareRate}%
          </div>
        </div>
      </div>

      {/* 요약 카드 3개 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <Mini label="누적 계약" value={`${totalContracts}건`} color={C.bl} />
        <Mini
          label="이번 달 ARR"
          value={`${Math.round(monthly[monthly.length - 1].annualRev / 10000).toLocaleString("ko-KR")}만원`}
          color={C.ac}
        />
        <Mini
          label="누적 ARR"
          value={`${Math.round(totalRev / 1e8) > 0 ? (totalRev / 1e8).toFixed(2) + "억원" : Math.round(totalRev / 10000).toLocaleString("ko-KR") + "만원"}`}
          color={C.gn}
        />
      </div>

      {/* 월별 차트 */}
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={monthly} margin={{ top: 18, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.bl2} />
            <XAxis
              dataKey="month"
              tick={{ fill: C.td, fontSize: 10 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: C.td, fontSize: 10 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
              tickFormatter={(v) => {
                if (v >= 1e8) return `${(v / 1e8).toFixed(1)}억`;
                if (v >= 1e4) return `${Math.round(v / 1e4)}만`;
                return v;
              }}
            />
            <Tooltip
              cursor={{ fill: "#F8FAFC" }}
              contentStyle={{
                background: C.sa,
                border: `1px solid ${C.bl2}`,
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(v) => [
                `${Math.round(v / 10000).toLocaleString("ko-KR")}만원`,
                "ARR",
              ]}
            />
            <Bar dataKey="annualRev" name="월별 ARR" fill={C.gn} radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="contracts"
                position="top"
                fill={C.t}
                fontSize={10}
                fontWeight={700}
                formatter={(v) => `${v}건`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: 10,
          padding: "8px 11px",
          borderRadius: 8,
          background: `${C.gn}0c`,
          border: `1px solid ${C.gn}33`,
          fontSize: 11,
          color: C.gn,
          lineHeight: 1.6,
        }}
      >
        💡 ARR(연간 반복 매출) 기준 추정. 계약이 유지될수록 누적 효과 발생. 쉐어 협의 시뮬레이터로 활용.
      </div>
    </Card>
  );
}

/* ============================================================
 * 보조
 * ============================================================ */

function SectionTitle({ icon, color, children }) {
  return (
    <h3
      style={{
        margin: "0 0 4px",
        fontSize: 14,
        fontWeight: 800,
        color,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {children}
    </h3>
  );
}

function ReportSection({ label, color, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color,
          letterSpacing: 1.5,
          marginBottom: 6,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function listStyle(color) {
  return {
    margin: 0,
    padding: "0 0 0 18px",
    fontSize: 12,
    color: C.td,
    lineHeight: 1.7,
    "--marker": color,
  };
}

function btnStyle(active, color) {
  return {
    flex: 1,
    padding: "9px",
    borderRadius: 8,
    border: `1px solid ${active ? color : C.bl2}`,
    background: active ? `${color}14` : "transparent",
    color: active ? color : C.td,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  };
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
  return <td style={{ padding: "9px 11px", textAlign: align }}>{children}</td>;
}

function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 10,
        color: C.td,
        fontWeight: 700,
        marginBottom: 5,
        letterSpacing: 0.5,
      }}
    >
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 7,
  border: `1px solid ${C.bl2}`,
  background: C.sa,
  color: C.t,
  fontSize: 12,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'JetBrains Mono', monospace",
};

function Mini({ label, value, color }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 8,
        background: `${color}0e`,
        border: `1px solid ${color}33`,
      }}
    >
      <div style={{ fontSize: 9, color: C.tm, fontWeight: 700, letterSpacing: 1 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          color,
          fontFamily: "'JetBrains Mono', monospace",
          marginTop: 3,
        }}
      >
        {value}
      </div>
    </div>
  );
}
