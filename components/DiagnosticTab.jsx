"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Spinner from "./ui/Spinner";
import { diagnose, formatWon } from "@/lib/calculate";
import {
  INDUSTRY_AVG,
  OVERALL_AVG,
  INDUSTRY_CODE,
  CODE_INDUSTRY,
  compareToIndustry,
} from "@/data/industryBenchmarks";

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
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ emp: "", cur: "", severe: 30, industry: "제조업" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [shareState, setShareState] = useState("idle"); // idle | copied | error
  const autoRanRef = useRef(false);

  const [jobs, setJobs] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsFallback, setJobsFallback] = useState(false);

  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportFallback, setReportFallback] = useState(false);

  const runDiagnosisWith = (vals) => {
    const employees = parseInt(vals.emp, 10);
    if (!Number.isFinite(employees) || employees < 50) {
      setError("상시 근로자 수를 50명 이상으로 입력하세요.");
      setResult(null);
      return;
    }
    setError(null);
    const r = diagnose({
      employees,
      current: parseInt(vals.cur, 10) || 0,
      severeRatio: vals.severe,
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

  const runDiagnosis = () => runDiagnosisWith(form);

  // URL 쿼리 파라미터로 들어온 경우 자동 계산 (공유 링크 수신 시나리오)
  useEffect(() => {
    if (autoRanRef.current || !searchParams) return;
    const emp = searchParams.get("emp");
    if (!emp) return;
    const cur = searchParams.get("cur") || "";
    const svRaw = searchParams.get("sv");
    const severe = Number.isFinite(Number(svRaw)) ? Number(svRaw) : 30;
    const indCode = searchParams.get("ind");
    const industry = CODE_INDUSTRY[indCode] || INDUSTRIES[0];
    const vals = { emp, cur, severe, industry };
    setForm(vals);
    runDiagnosisWith(vals);
    autoRanRef.current = true;
  }, [searchParams]);

  const handleShare = async () => {
    if (!form.emp) return;
    const params = new URLSearchParams({
      emp: String(form.emp),
      cur: String(form.cur || 0),
      sv: String(form.severe),
      ind: INDUSTRY_CODE[form.industry] || "etc",
    });
    const url = `${window.location.origin}/?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2200);
    } catch {
      // fallback: 구형 브라우저 또는 비 HTTPS
      window.prompt("아래 URL을 복사하세요 (Ctrl+C → Enter):", url);
      setShareState("idle");
    }
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
      setJobs({ jobs: [], tip: "네트워크 오류로 직무 추천을 불러오지 못했습니다." });
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

          {/* 공유 링크 */}
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={handleShare}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 10,
                border: `1px solid ${shareState === "copied" ? C.ac : C.bl2}`,
                background: shareState === "copied" ? `${C.ac}14` : "#0f1623",
                color: shareState === "copied" ? C.ac : C.td,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {shareState === "copied" ? (
                <>✅ 링크가 클립보드에 복사됐습니다 — 슬랙/메일로 공유하세요</>
              ) : (
                <>🔗 이 진단 결과를 링크로 공유</>
              )}
            </button>
          </div>

          {/* 동종업계 비교 벤치마크 */}
          <BenchmarkCard
            yourRate={result.effectiveRate}
            industry={form.industry}
          />

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

          {/* 2차 CTA — 브이드림 무료 상담 */}
          <VDreamCTA />
        </>
      )}
    </div>
  );
}

/* ============================================================
 * 서브 컴포넌트
 * ============================================================ */

function BenchmarkCard({ yourRate, industry }) {
  const avg = INDUSTRY_AVG[industry] ?? OVERALL_AVG;
  const cmp = compareToIndustry(yourRate, industry);
  const yourColor = cmp.belowAverage ? C.rd : C.ac;

  const data = [
    { name: "귀사", value: Number(yourRate.toFixed(2)), color: yourColor },
    { name: `${industry} 평균`, value: avg, color: C.bl },
    { name: "전체 평균", value: OVERALL_AVG, color: C.tm },
  ];

  const maxVal = Math.max(...data.map((d) => d.value), 3.1) * 1.25;

  return (
    <Card style={{ marginBottom: 12 }}>
      <h3
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: C.ac,
          margin: "0 0 4px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        📊 동종업계 비교 벤치마크
      </h3>
      <div style={{ fontSize: 11, color: C.td, marginBottom: 10 }}>
        귀사 실고용률 vs {industry} 평균 vs 전체 평균 (의무고용률 3.1%)
      </div>

      <div style={{ width: "100%", height: 190 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fill: C.td, fontSize: 11 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: C.td, fontSize: 11 }}
              axisLine={{ stroke: C.bl2 }}
              tickLine={false}
              domain={[0, maxVal]}
              tickFormatter={(v) => `${v}%`}
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
              formatter={(v) => [`${v}%`, "고용률"]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                fill={C.t}
                fontSize={12}
                fontWeight={700}
                formatter={(v) => `${v}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          marginTop: 8,
          padding: "8px 11px",
          borderRadius: 8,
          background: cmp.belowAverage ? `${C.rd}0f` : `${C.ac}0f`,
          border: `1px solid ${cmp.belowAverage ? C.rd : C.ac}33`,
          fontSize: 12,
          color: cmp.belowAverage ? C.rd : C.ac,
          fontWeight: 600,
          lineHeight: 1.5,
        }}
      >
        {cmp.belowAverage ? "⚠️ " : "✅ "}
        {cmp.text}
        {cmp.belowAverage && (
          <span style={{ color: C.td, fontWeight: 400, marginLeft: 4 }}>
            — 브이드림 도입으로 업종 평균 이상 달성 가능
          </span>
        )}
      </div>
    </Card>
  );
}

function VDreamCTA() {
  return (
    <Card
      style={{
        marginTop: 6,
        marginBottom: 8,
        padding: 22,
        background: `linear-gradient(135deg, ${C.ac}16 0%, ${C.bl}16 100%)`,
        border: `1px solid ${C.ac}44`,
        boxShadow: `0 0 32px ${C.ac}22`,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.ac,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          VDream Free Consultation
        </div>
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 900,
            color: C.t,
            lineHeight: 1.4,
          }}
        >
          브이드림과 함께
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            고용부담금 제로
          </span>
          를 만드세요
        </h3>

        {/* 소셜 프루프 */}
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: C.td,
            fontWeight: 500,
          }}
        >
          <strong style={{ color: C.ac }}>450+ 기업</strong>이 이미 브이드림과 함께하고 있습니다
        </div>

        {/* USP 3개 */}
        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { icon: "⚖️", text: "법적/노무 분쟁률 0%" },
            { icon: "⚡", text: "2~4주 내 도입" },
            { icon: "🏠", text: "편의시설 투자 불필요" },
          ].map((u, i) => (
            <div
              key={i}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.ac}22`,
                fontSize: 11,
                fontWeight: 600,
                color: C.t,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>{u.icon}</span>
              {u.text}
            </div>
          ))}
        </div>

        {/* 주 CTA 버튼 */}
        <a
          href="https://www.vdream.co.kr/inquiry"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "13px 34px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
            color: "#000",
            fontSize: 14,
            fontWeight: 900,
            textDecoration: "none",
            boxShadow: `0 6px 20px ${C.ac}44`,
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = `0 8px 26px ${C.ac}66`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 6px 20px ${C.ac}44`;
          }}
        >
          🚀 브이드림 무료 상담 신청하기
        </a>

        {/* 전화 상담 */}
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: C.td,
          }}
        >
          또는 대표번호{" "}
          <a
            href="tel:1644-8619"
            style={{
              color: C.ac,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: "none",
            }}
          >
            1644-8619
          </a>
          로 전화 상담
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
 * 입력 필드 서브 컴포넌트
 * ============================================================ */

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
