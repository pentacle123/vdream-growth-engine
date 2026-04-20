"use client";

import { useMemo, useState } from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import {
  INDUSTRIES,
  REGIONS,
  PIPELINE_STATUSES,
  findStatus,
  calculateScore,
  TIER_META,
} from "@/data/targetCompanies";
import { formatWon } from "@/lib/calculate";

const C = {
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

export default function CompanyDB({ companies, onSelect, onStatusChange }) {
  const [q, setQ] = useState("");
  const [industry, setIndustry] = useState("all");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return companies
      .filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()))
      .filter((c) => industry === "all" || c.industry === industry)
      .filter((c) => region === "all" || c.region === region)
      .filter((c) => status === "all" || (c.status || "untouched") === status)
      .sort((a, b) => b.estimatedPenalty - a.estimatedPenalty);
  }, [companies, q, industry, region, status]);

  const totalPenalty = useMemo(
    () => companies.reduce((a, c) => a + c.estimatedPenalty, 0),
    [companies]
  );
  const avgScore = useMemo(() => {
    const sum = companies.reduce((a, c) => a + calculateScore(c).total, 0);
    return Math.round(sum / companies.length);
  }, [companies]);
  const pipelineCount = useMemo(() => {
    const counts = {};
    PIPELINE_STATUSES.forEach((s) => (counts[s.key] = 0));
    companies.forEach((c) => {
      const k = c.status || "untouched";
      counts[k] = (counts[k] || 0) + 1;
    });
    return counts;
  }, [companies]);

  return (
    <div>
      {/* 대시보드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <StatCard
          label="타겟 기업"
          value={`${companies.length}개`}
          color={C.t}
        />
        <StatCard
          label="총 예상 부담금"
          value={formatWon(totalPenalty)}
          color={C.rd}
          sub="전환 가능 시장"
        />
        <StatCard
          label="평균 스코어"
          value={`${avgScore}`}
          color={avgScore >= 80 ? C.wn : C.bl}
          sub="100점 만점"
        />
        <StatCard
          label="계약 / 상담"
          value={`${pipelineCount.contracted || 0} / ${pipelineCount.consulting || 0}`}
          color={C.ac}
          sub="진행 / 완료"
        />
      </div>

      {/* 파이프라인 바 */}
      <Card style={{ marginBottom: 12, padding: 14 }}>
        <div
          style={{
            fontSize: 11,
            color: C.tm,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: 1,
          }}
        >
          SALES PIPELINE
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {PIPELINE_STATUSES.map((s) => {
            const count = pipelineCount[s.key] || 0;
            const active = count > 0;
            return (
              <div
                key={s.key}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  background: active ? `${s.color}1a` : C.sa,
                  border: `1px solid ${active ? s.color + "44" : C.bl2}`,
                  fontSize: 11,
                  color: active ? s.color : C.tm,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>{s.icon}</span>
                {s.label}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 800,
                  }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 필터 행 */}
      <Card style={{ marginBottom: 12, padding: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 8,
          }}
        >
          <input
            placeholder="🔎 기업명 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={inputStyle}
          />
          <Select value={industry} onChange={setIndustry} options={[
            { value: "all", label: "전체 업종" },
            ...INDUSTRIES.map((v) => ({ value: v, label: v })),
          ]} />
          <Select value={region} onChange={setRegion} options={[
            { value: "all", label: "전체 지역" },
            ...REGIONS.map((v) => ({ value: v, label: v })),
          ]} />
          <Select value={status} onChange={setStatus} options={[
            { value: "all", label: "전체 상태" },
            ...PIPELINE_STATUSES.map((s) => ({ value: s.key, label: s.label })),
          ]} />
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: C.tm }}>
          {filtered.length}개 기업 표시 중 (부담금 높은 순)
        </div>
      </Card>

      {/* 테이블 */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 900,
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ background: C.sh }}>
                <Th>기업명</Th>
                <Th>업종</Th>
                <Th>지역</Th>
                <Th align="right">근로자</Th>
                <Th align="right">부족인원</Th>
                <Th align="right">예상 부담금</Th>
                <Th>스코어</Th>
                <Th>상태</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const sc = calculateScore(c);
                const tier = TIER_META[sc.tier];
                const st = findStatus(c.status || "untouched");
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelect(c.id)}
                    style={{
                      borderTop: `1px solid ${C.b}`,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = C.sa)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <Td>
                      <span style={{ fontWeight: 700, color: C.t }}>{c.name}</span>
                    </Td>
                    <Td>
                      <span style={{ color: C.td }}>{c.industry}</span>
                    </Td>
                    <Td>
                      <span style={{ color: C.td }}>{c.region}</span>
                    </Td>
                    <Td align="right">
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.t }}>
                        {c.employees.toLocaleString("ko-KR")}명
                      </span>
                    </Td>
                    <Td align="right">
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: C.wn }}>
                        {c.deficit}명
                      </span>
                    </Td>
                    <Td align="right">
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: C.rd,
                          fontWeight: 700,
                        }}
                      >
                        {formatWon(c.estimatedPenalty)}
                      </span>
                    </Td>
                    <Td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span style={{ fontSize: 13 }}>{tier.emoji}</span>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: 800,
                            color: tier.color,
                          }}
                        >
                          {sc.total}
                        </span>
                      </div>
                    </Td>
                    <Td>
                      <select
                        value={c.status || "untouched"}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onStatusChange(c.id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          border: `1px solid ${st.color}33`,
                          background: `${st.color}11`,
                          color: st.color,
                          fontSize: 11,
                          fontWeight: 700,
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        {PIPELINE_STATUSES.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value, color, sub }) {
  return (
    <Card style={{ padding: 12 }}>
      <div style={{ fontSize: 10, color: C.tm, fontWeight: 600, marginBottom: 2 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          color,
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 9, color: C.tm, marginTop: 2 }}>{sub}</div>
      )}
    </Card>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      style={{
        padding: "10px 12px",
        textAlign: align,
        fontSize: 11,
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
  return (
    <td
      style={{
        padding: "10px 12px",
        textAlign: align,
      }}
    >
      {children}
    </td>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        ...inputStyle,
        cursor: "pointer",
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

const inputStyle = {
  padding: "9px 12px",
  borderRadius: 8,
  border: `1px solid ${C.bl2}`,
  background: C.sa,
  color: C.t,
  fontSize: 12,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
