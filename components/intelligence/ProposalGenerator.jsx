"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";
import { computeROI } from "@/data/targetCompanies";
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
  bl2: "rgba(255,255,255,0.08)",
};

export default function ProposalGenerator({
  company,
  proposal,
  onProposalGenerated,
  onGoOutreach,
  companies,
  onSelectCompany,
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!company) {
    return <CompanyPicker companies={companies} onSelect={onSelectCompany} />;
  }

  const roi = computeROI(company);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, roi }),
      });
      const data = await res.json();
      onProposalGenerated(company.id, data);
    } catch {
      onProposalGenerated(company.id, {
        headline: "네트워크 오류로 제안서를 불러오지 못했습니다.",
        problem: "",
        solution: "",
        roi: {},
        implementation: "",
        socialProof: "",
        cta: "",
        fallback: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!proposal) return;
    const txt = buildPlainText(company, proposal, roi);
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("텍스트를 복사하세요:", txt);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CompanyHeader company={company} roi={roi} onChange={onSelectCompany} companies={companies} />

      {!proposal && (
        <Card
          style={{
            padding: 22,
            textAlign: "center",
            background: `linear-gradient(135deg, ${C.ac}14 0%, ${C.bl}14 100%)`,
            border: `1px solid ${C.ac}44`,
          }}
        >
          <div style={{ fontSize: 30, marginBottom: 6 }}>🤖</div>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 800,
              color: C.t,
            }}
          >
            Claude가 {company.name} 맞춤 제안서를 작성합니다
          </h3>
          <p
            style={{
              fontSize: 12,
              color: C.td,
              margin: "6px 0 14px",
              lineHeight: 1.6,
            }}
          >
            공개 데이터(근로자·의무고용·부담금)만으로도 1페이지 제안서를 자동 생성합니다.
            <br />
            ROI 계산·도입 로드맵·소셜 프루프까지 포함됩니다.
          </p>
          <button
            onClick={generate}
            disabled={loading}
            style={{
              padding: "12px 30px",
              borderRadius: 12,
              border: "none",
              background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
              color: "#000",
              fontWeight: 900,
              fontSize: 14,
              cursor: loading ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {loading ? <Spinner color="#000" /> : "✨"}{" "}
            {loading ? "Claude가 작성 중..." : "AI 제안서 생성"}
          </button>
        </Card>
      )}

      {proposal && (
        <ProposalDocument
          proposal={proposal}
          company={company}
          roi={roi}
          loading={loading}
          onRegenerate={generate}
          onCopy={copyToClipboard}
          copied={copied}
          onGoOutreach={onGoOutreach}
        />
      )}
    </div>
  );
}

/* ============================================================
 * 컴포넌트 — 제안서 문서 렌더
 * ============================================================ */

function ProposalDocument({
  proposal,
  company,
  roi,
  loading,
  onRegenerate,
  onCopy,
  copied,
  onGoOutreach,
}) {
  return (
    <>
      {proposal.fallback && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            background: `${C.wn}10`,
            border: `1px solid ${C.wn}33`,
            color: C.wn,
            fontSize: 11,
          }}
        >
          ⚠ 샘플 제안서 (ANTHROPIC_API_KEY 미설정 또는 오류)
        </div>
      )}

      {/* 프리미엄 제안서 카드 */}
      <Card
        style={{
          padding: 0,
          overflow: "hidden",
          background: "linear-gradient(180deg, #0f1623 0%, #0a1018 100%)",
          border: `1px solid ${C.ac}33`,
          boxShadow: `0 0 40px ${C.ac}18`,
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            padding: "24px 26px 22px",
            background: `linear-gradient(135deg, ${C.ac}18 0%, ${C.bl}18 100%)`,
            borderBottom: `1px solid ${C.ac}22`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: C.ac,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            VDREAM B2B PROPOSAL · {company.industry.toUpperCase()}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 900,
              color: C.t,
              lineHeight: 1.35,
              letterSpacing: -0.5,
            }}
          >
            {proposal.headline}
          </h2>
        </div>

        <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Problem */}
          <Section label="📉 현재 상황" color={C.rd}>
            {proposal.problem}
          </Section>

          {/* Solution */}
          <Section label="💡 브이드림 솔루션" color={C.ac}>
            {proposal.solution}
          </Section>

          {/* ROI 차트 */}
          <ROISection proposal={proposal} roi={roi} />

          {/* Implementation */}
          <Section label="⚡ 도입 프로세스" color={C.bl}>
            {proposal.implementation}
          </Section>

          <ImplementationTimeline />

          {/* Social proof */}
          <Section label="🏆 소셜 프루프" color={C.wn}>
            {proposal.socialProof}
          </Section>

          {/* CTA */}
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${C.ac}1c 0%, ${C.bl}1c 100%)`,
              border: `1px solid ${C.ac}44`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 10, color: C.ac, fontWeight: 800, letterSpacing: 2, marginBottom: 4 }}>
              NEXT STEP
            </div>
            <div style={{ fontSize: 14, color: C.t, fontWeight: 700, lineHeight: 1.5 }}>
              {proposal.cta}
            </div>
          </div>
        </div>
      </Card>

      {/* 액션 버튼 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 8,
        }}
      >
        <button
          onClick={onGoOutreach}
          style={{
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
            color: "#000",
            fontWeight: 900,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          📧 이 제안서를 이메일로 보내기
        </button>
        <button
          onClick={onCopy}
          style={{
            padding: "12px",
            borderRadius: 10,
            border: `1px solid ${copied ? C.ac : C.bl2}`,
            background: copied ? `${C.ac}14` : "#0f1623",
            color: copied ? C.ac : C.td,
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {copied ? "✅ 복사됨" : "📋 제안서 복사"}
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading}
          style={{
            padding: "12px",
            borderRadius: 10,
            border: `1px solid ${C.bl2}`,
            background: "#0f1623",
            color: C.td,
            fontWeight: 700,
            fontSize: 12,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "생성 중..." : "🔄 다시 생성"}
        </button>
      </div>
    </>
  );
}

function Section({ label, color, children }) {
  return (
    <div>
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
      <div style={{ fontSize: 13, color: C.t, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function ROISection({ proposal, roi }) {
  const data = [
    { name: "현재 부담금", value: roi.annualPenalty, color: C.rd },
    { name: "도입 후 비용", value: roi.annualHireCost, color: C.bl },
    { name: "연간 절감액", value: roi.annualSaving, color: C.ac },
  ];
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.2;

  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: C.ac,
          letterSpacing: 1.5,
          marginBottom: 10,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        💰 ROI 비교
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <RoiChip
          label="현재 부담금"
          value={formatWon(roi.annualPenalty)}
          color={C.rd}
        />
        <RoiChip
          label="도입 후 비용"
          value={formatWon(roi.annualHireCost)}
          color={C.bl}
          sub={`중증 ${roi.hireNeeded}명 × 12개월`}
        />
        <RoiChip
          label="연간 절감액"
          value={formatWon(roi.annualSaving)}
          color={C.ac}
          sub="순이익"
        />
      </div>

      <div style={{ width: "100%", height: 210 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 24, right: 10, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: C.td, fontSize: 11 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: C.td, fontSize: 10 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
              domain={[0, maxVal]}
              tickFormatter={(v) => {
                if (v >= 1e8) return `${(v / 1e8).toFixed(1)}억`;
                if (v >= 1e4) return `${Math.round(v / 1e4)}만`;
                return v;
              }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: C.sa,
                border: `1px solid ${C.bl2}`,
                borderRadius: 8,
                fontSize: 12,
                color: C.t,
              }}
              formatter={(v) => [formatWon(v), "금액"]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fill={C.t}
                fontSize={11}
                fontWeight={700}
                formatter={(v) => formatWon(v)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {proposal.roi?.additionalIncentive && (
        <div
          style={{
            marginTop: 6,
            padding: "7px 10px",
            borderRadius: 6,
            background: `${C.wn}10`,
            border: `1px solid ${C.wn}22`,
            fontSize: 11,
            color: C.wn,
          }}
        >
          🎁 {proposal.roi.additionalIncentive}
        </div>
      )}
    </div>
  );
}

function RoiChip({ label, value, color, sub }) {
  return (
    <div
      style={{
        padding: "9px 11px",
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
          fontSize: 14,
          fontWeight: 900,
          color,
          fontFamily: "'JetBrains Mono', monospace",
          marginTop: 2,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 9, color: C.tm, marginTop: 1 }}>{sub}</div>
      )}
    </div>
  );
}

function ImplementationTimeline() {
  const steps = [
    { w: "W1", label: "상담·계약" },
    { w: "W2", label: "매칭 풀 구성" },
    { w: "W3", label: "온보딩" },
    { w: "W4", label: "업무 투입" },
  ];
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {steps.map((s, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            padding: "9px",
            borderRadius: 8,
            background: C.sa,
            borderLeft: `3px solid ${C.bl}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: C.bl,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {s.w}
          </div>
          <div style={{ fontSize: 11, color: C.t, fontWeight: 600, marginTop: 2 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * 기업 선택 헤더 + 비선택 상태
 * ============================================================ */

function CompanyHeader({ company, roi, companies, onChange }) {
  return (
    <Card style={{ padding: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 240 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.tm,
              letterSpacing: 1.5,
              marginBottom: 4,
            }}
          >
            TARGET COMPANY
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.t }}>
              {company.name}
            </h3>
            <Badge color={C.ac}>{company.industry}</Badge>
            <Badge color={C.bl}>{company.region}</Badge>
          </div>
          <div style={{ fontSize: 11, color: C.tm, marginTop: 4 }}>
            상시근로자 {company.employees.toLocaleString("ko-KR")}명 · 부족{" "}
            <span style={{ color: C.wn }}>{company.deficit}명</span> · 예상 부담금{" "}
            <span style={{ color: C.rd, fontWeight: 700 }}>
              {formatWon(company.estimatedPenalty)}
            </span>
            {" · "}도입 시 절감{" "}
            <span style={{ color: C.ac, fontWeight: 700 }}>
              {formatWon(roi.annualSaving)}
            </span>
          </div>
        </div>
        <select
          value={company.id}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid ${C.bl2}`,
            background: C.sa,
            color: C.t,
            fontSize: 12,
            outline: "none",
            cursor: "pointer",
          }}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.industry})
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
}

function CompanyPicker({ companies, onSelect }) {
  return (
    <Card style={{ padding: 22, textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: C.t }}>
        기업을 선택하세요
      </h3>
      <p style={{ fontSize: 12, color: C.td, margin: "6px 0 12px" }}>
        선택한 기업에 맞춤 제안서를 자동 생성합니다.
      </p>
      <select
        onChange={(e) => onSelect(Number(e.target.value))}
        defaultValue=""
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: `1px solid ${C.bl2}`,
          background: C.sa,
          color: C.t,
          fontSize: 13,
          outline: "none",
          minWidth: 280,
          cursor: "pointer",
        }}
      >
        <option value="" disabled>
          — 기업 선택 —
        </option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.industry}, {formatWon(c.estimatedPenalty)})
          </option>
        ))}
      </select>
    </Card>
  );
}

function buildPlainText(c, p, roi) {
  return [
    p.headline,
    "",
    `[기업 정보]`,
    `- 기업명: ${c.name} (${c.industry}, ${c.region})`,
    `- 상시근로자: ${c.employees.toLocaleString("ko-KR")}명`,
    `- 부족인원: ${c.deficit}명`,
    "",
    `[현재 상황]`,
    p.problem,
    "",
    `[브이드림 솔루션]`,
    p.solution,
    "",
    `[ROI]`,
    `- 현재 부담금: ${formatWon(roi.annualPenalty)}`,
    `- 도입 후 비용: ${formatWon(roi.annualHireCost)}`,
    `- 연간 절감액: ${formatWon(roi.annualSaving)}`,
    "",
    `[도입 프로세스]`,
    p.implementation,
    "",
    `[신뢰 근거]`,
    p.socialProof,
    "",
    `[다음 단계]`,
    p.cta,
  ].join("\n");
}
