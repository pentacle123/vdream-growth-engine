"use client";

import { useState } from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Spinner from "./ui/Spinner";
import { diagnose, formatWon } from "@/lib/calculate";

const C = {
  sa: "#141d2e",
  sh: "#1a2540",
  ac: "#36CFBA",
  ad: "rgba(54,207,186,0.12)",
  bl: "#1D85EB",
  bd: "rgba(29,133,235,0.12)",
  wn: "#F59E0B",
  rd: "#EF4444",
  pp: "#A78BFA",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

const INDUSTRIES = [
  "제조업",
  "IT/소프트웨어",
  "금융/보험",
  "유통/물류",
  "건설",
  "서비스업",
  "공공기관",
  "기타",
];

export default function DiagnosticTab() {
  const [form, setForm] = useState({ emp: "", cur: "", severe: 30, industry: "제조업" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [jobs, setJobs] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsFallback, setJobsFallback] = useState(false);

  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportFallback, setReportFallback] = useState(false);

  const runDiagnosis = () => {
    const employees = parseInt(form.emp, 10);
    if (!Number.isFinite(employees) || employees < 50) {
      setError("상시 근로자 수를 50명 이상으로 입력하세요.");
      setResult(null);
      return;
    }
    setError(null);
    const r = diagnose({
      employees,
      current: parseInt(form.cur, 10) || 0,
      severeRatio: form.severe,
    });
    if (!r.eligible) {
      setError(r.reason);
      setResult(null);
      return;
    }
    setResult(r);
    setJobs(null);
    setReport(null);
  };

  const requestJobs = async () => {
    if (!result) return;
    setJobsLoading(true);
    setJobsFallback(false);
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: form.industry,
          employees: result.employees,
          shortage: result.shortage,
          hireNeeded: result.hireNeeded,
        }),
      });
      const data = await res.json();
      setJobs(data);
      if (data.fallback) setJobsFallback(true);
    } catch {
      setJobs({
        jobs: [],
        tip: "네트워크 오류로 직무 추천을 불러오지 못했습니다.",
      });
      setJobsFallback(true);
    } finally {
      setJobsLoading(false);
    }
  };

  const requestReport = async () => {
    if (!result) return;
    setReportLoading(true);
    setReportFallback(false);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: form.industry, result }),
      });
      const data = await res.json();
      setReport(data);
      if (data.fallback) setReportFallback(true);
    } catch {
      setReport({
        summary: "네트워크 오류로 리포트를 불러오지 못했습니다.",
        risk: "",
        recommendation: "",
        timeline: "",
      });
      setReportFallback(true);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: C.t, margin: 0 }}>
          🏥 고용부담금 AI 진단기
        </h2>
        <p style={{ fontSize: 12, color: C.td, margin: "5px 0 0" }}>
          기업 정보 입력 → 부담금·절감·맞춤직무·경영진 리포트 AI 생성
        </p>
      </div>

      {/* 입력 폼 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <NumField
            label="상시 근로자 수"
            unit="명"
            placeholder="예: 500"
            value={form.emp}
            onChange={(v) => setForm((p) => ({ ...p, emp: v }))}
          />
          <NumField
            label="현재 장애인 고용 수"
            unit="명"
            placeholder="예: 5"
            value={form.cur}
            onChange={(v) => setForm((p) => ({ ...p, cur: v }))}
          />
          <div>
            <label style={labelStyle}>중증 비율: {form.severe}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.severe}
              onChange={(e) => setForm((p) => ({ ...p, severe: +e.target.value }))}
              style={{ width: "100%", accentColor: C.ac }}
            />
          </div>
          <div>
            <label style={labelStyle}>업종</label>
            <select
              value={form.industry}
              onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: 8,
                border: `1px solid ${C.bl2}`,
                background: C.sa,
                color: C.t,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              {INDUSTRIES.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={runDiagnosis}
          style={{
            marginTop: 14,
            width: "100%",
            padding: "12px 0",
            borderRadius: 10,
            border: "none",
            background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
            color: "#000",
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          🔍 부담금 진단 실행
        </button>

        {error && (
          <div
            style={{
              marginTop: 10,
              padding: "8px 12px",
              borderRadius: 8,
              background: `${C.rd}10`,
              border: `1px solid ${C.rd}33`,
              color: C.rd,
              fontSize: 12,
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </Card>

      {result && (
        <>
          {/* 요약 3카드 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            <Card glow>
              <div style={miniLabel}>현재 연간 고용부담금</div>
              <div style={{ ...bigNum, color: C.rd }}>{formatWon(result.annualPenalty)}</div>
              <div style={miniDim}>미달 {result.shortage}명 × 12개월</div>
            </Card>
            <Card>
              <div style={miniLabel}>도입 시 절감</div>
              <div style={{ ...bigNum, color: C.ac }}>{formatWon(result.annualSaving)}</div>
              <div style={miniDim}>중증 {result.hireNeeded}명 채용 기준</div>
            </Card>
            <Card>
              <div style={miniLabel}>총 연간 이익</div>
              <div style={{ ...bigNum, color: C.wn }}>{formatWon(result.totalBenefit)}</div>
              <div style={miniDim}>절감 + 장려금</div>
            </Card>
          </div>

          {/* 상세 지표 */}
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              <Metric label="의무 고용 인원" value={`${result.mandatoryCount}명`} />
              <Metric label="유효 고용 인원" value={`${result.effectiveCount}명`} sub={`(${result.effectiveRate}%)`} />
              <Metric label="부족 인원" value={`${result.shortage}명`} color={C.rd} />
              <Metric label="월 부담기초액" value={formatWon(result.baseAmount)} />
            </div>
          </Card>

          {/* AI 버튼 2개 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <button
              onClick={requestJobs}
              disabled={jobsLoading}
              style={{
                padding: 11,
                borderRadius: 10,
                border: `1px solid ${C.ac}44`,
                background: C.ad,
                color: C.ac,
                fontSize: 13,
                fontWeight: 700,
                cursor: jobsLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {jobsLoading ? <Spinner /> : "🤖"} AI 맞춤 직무 추천
            </button>
            <button
              onClick={requestReport}
              disabled={reportLoading}
              style={{
                padding: 11,
                borderRadius: 10,
                border: `1px solid ${C.bl}44`,
                background: C.bd,
                color: C.bl,
                fontSize: 13,
                fontWeight: 700,
                cursor: reportLoading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {reportLoading ? <Spinner color={C.bl} /> : "📋"} 경영진 리포트 생성
            </button>
          </div>

          {/* AI 직무 추천 결과 */}
          {jobs && (
            <Card style={{ marginBottom: 12 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.ac, margin: "0 0 10px" }}>
                🤖 AI 맞춤 직무 추천 — {form.industry}
                {jobsFallback && (
                  <span style={{ marginLeft: 8, fontSize: 10, color: C.tm, fontWeight: 500 }}>
                    (샘플 데이터 — API 키 미설정 또는 오류)
                  </span>
                )}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {(jobs.jobs || []).map((j, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "9px 11px",
                      borderRadius: 8,
                      background: C.sa,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.t }}>{j.title}</div>
                      <div style={{ fontSize: 11, color: C.td, marginTop: 1 }}>{j.desc}</div>
                      <div style={{ display: "flex", gap: 5, marginTop: 3 }}>
                        <Badge color={C.pp}>{j.type}</Badge>
                        <Badge color={C.tm} background={C.sh}>
                          난이도: {j.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <Badge color={String(j.fit || "").includes("높") ? C.ac : C.wn}>{j.fit}</Badge>
                  </div>
                ))}
              </div>
              {jobs.tip && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "6px 9px",
                    borderRadius: 6,
                    background: `${C.ac}08`,
                    border: `1px solid ${C.ac}15`,
                    fontSize: 11,
                    color: C.ac,
                  }}
                >
                  💡 {jobs.tip}
                </div>
              )}
            </Card>
          )}

          {/* 경영진 리포트 */}
          {report && (
            <Card style={{ marginBottom: 12, border: `1px solid ${C.bl}22` }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: C.bl, margin: "0 0 10px" }}>
                📋 AI 경영진 리포트
                {reportFallback && (
                  <span style={{ marginLeft: 8, fontSize: 10, color: C.tm, fontWeight: 500 }}>
                    (샘플 데이터 — API 키 미설정 또는 오류)
                  </span>
                )}
              </h3>
              {[
                { label: "핵심 요약", text: report.summary, color: C.t },
                { label: "미이행 리스크", text: report.risk, color: C.rd },
                { label: "도입 권고", text: report.recommendation, color: C.ac },
                { label: "추천 일정", text: report.timeline, color: C.wn },
              ]
                .filter((s) => s.text)
                .map((s, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: s.color, marginBottom: 2 }}>
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: C.td,
                        lineHeight: 1.6,
                        padding: "7px 9px",
                        borderRadius: 6,
                        background: C.sa,
                      }}
                    >
                      {s.text}
                    </div>
                  </div>
                ))}
              <div style={{ textAlign: "center", marginTop: 4 }}>
                <button
                  style={{
                    padding: "9px 26px",
                    borderRadius: 8,
                    border: "none",
                    background: C.bl,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                  onClick={() => alert("PDF 다운로드 기능은 리드 수집 연동 시 활성화됩니다.")}
                >
                  📄 PDF 다운로드 (리드 수집)
                </button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize: 11,
  color: "#94A3B8",
  fontWeight: 600,
  display: "block",
  marginBottom: 4,
};

const miniLabel = { fontSize: 10, color: "#94A3B8", fontWeight: 600, marginBottom: 2 };
const bigNum = { fontSize: 19, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" };
const miniDim = { fontSize: 10, color: "#64748B", marginTop: 2 };

function NumField({ label, unit, placeholder, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: "9px 34px 9px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#141d2e",
            color: "#E2E8F0",
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 11,
            color: "#64748B",
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

function Metric({ label, value, sub, color = "#E2E8F0" }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace" }}>
        {value}
        {sub && <span style={{ fontSize: 10, color: "#64748B", marginLeft: 4 }}>{sub}</span>}
      </div>
    </div>
  );
}
