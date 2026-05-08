"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import FAQSection from "./diagnostic/FAQSection";
import { diagnose, formatWon } from "@/lib/calculate";
import {
  INDUSTRY_AVG,
  OVERALL_AVG,
  INDUSTRY_CODE,
  CODE_INDUSTRY,
  compareToIndustry,
} from "@/data/industryBenchmarks";

const NATIONAL_AVG = OVERALL_AVG; // 2.4%
const MANDATORY = 3.1; // 의무고용률 %

const fmt = (n) => new Intl.NumberFormat("ko-KR").format(n);

const INDUSTRIES = Object.keys(INDUSTRY_AVG);

/* ============================================================
 * AnimNum — 부드러운 카운트업 애니메이션
 * ============================================================ */
function AnimNum({ value, prefix = "", suffix = "", color = "#00C9A7", size = 28, formatter }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = Number(value) || 0;
    const dur = 1200;
    const startTime = Date.now();
    let raf;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * end);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    if (end > 0) raf = requestAnimationFrame(animate);
    else setDisplay(0);
    return () => raf && cancelAnimationFrame(raf);
  }, [value]);

  const text = formatter ? formatter(display) : `${prefix}${fmt(Math.floor(display))}${suffix}`;
  return (
    <span
      style={{
        fontSize: size,
        fontWeight: 900,
        color,
        fontFamily: "'Outfit', 'Pretendard', 'Noto Sans KR', sans-serif",
        letterSpacing: "-1.2px",
        lineHeight: 1,
      }}
    >
      {text}
    </span>
  );
}

/* ============================================================
 * CompareBar — 의무고용률 마커 포함 가로 바 차트
 * ============================================================ */
function CompareBar({ label, value, max, color, highlight, isMandatory }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: highlight ? 700 : 500,
            color: highlight ? "#0F172A" : "#64748B",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color,
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {value.toFixed(1)}%
        </span>
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 5,
          background: "#F1F5F9",
          overflow: "visible",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 5,
            background: highlight ? `linear-gradient(90deg, ${color}, ${color}cc)` : color,
            transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
            boxShadow: highlight ? `0 0 12px ${color}44` : "none",
          }}
        />
        {isMandatory && (
          <div
            style={{
              position: "absolute",
              left: `${pct}%`,
              top: -4,
              width: 2,
              height: 18,
              background: "#EF4444",
              borderRadius: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -18,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 10,
                fontWeight: 700,
                color: "#EF4444",
                whiteSpace: "nowrap",
              }}
            >
              기준
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Main Component
 * ============================================================ */

export default function DiagnosticTab() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ emp: "", cur: "", severe: 30, ind: "제조업" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [shareState, setShareState] = useState("idle");
  const autoRanRef = useRef(false);

  const [aiJobs, setAiJobs] = useState(null);
  const [aiJobsLoading, setAiJobsLoading] = useState(false);
  const [aiJobsFallback, setAiJobsFallback] = useState(false);

  const [aiReport, setAiReport] = useState(null);
  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiReportFallback, setAiReportFallback] = useState(false);

  /* ── 공유 링크 진입 시 자동 진단 실행 ────────────────────── */
  useEffect(() => {
    if (autoRanRef.current || !searchParams) return;
    const emp = searchParams.get("emp");
    if (!emp) return;
    const cur = searchParams.get("cur") || "";
    const svRaw = searchParams.get("sv");
    const severe = Number.isFinite(Number(svRaw)) ? Number(svRaw) : 30;
    const indCode = searchParams.get("ind");
    const ind = CODE_INDUSTRY[indCode] || INDUSTRIES[0];
    const vals = { emp, cur, severe, ind };
    setForm(vals);
    runDiagnosis(vals);
    autoRanRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const runDiagnosis = (vals = form) => {
    const employees = parseInt(vals.emp, 10);
    if (!Number.isFinite(employees) || employees < 50) {
      setError("상시 근로자 수를 50명 이상 입력하세요.");
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
    setAiJobs(null);
    setAiReport(null);
  };

  /* ── 결과 공유 링크 ────────────────────── */
  const handleShare = async () => {
    if (!form.emp) return;
    const params = new URLSearchParams({
      emp: String(form.emp),
      cur: String(form.cur || 0),
      sv: String(form.severe),
      ind: INDUSTRY_CODE[form.ind] || "etc",
    });
    const url = `${window.location.origin}/?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2200);
    } catch {
      window.prompt("아래 URL을 복사하세요:", url);
    }
  };

  /* ── AI 직무 추천 / 경영진 리포트 ─────────────────────── */
  const callAI = async (type) => {
    if (!result) return;
    const isJob = type === "job";
    if (isJob) {
      setAiJobsLoading(true);
      setAiJobsFallback(false);
    } else {
      setAiReportLoading(true);
      setAiReportFallback(false);
    }
    try {
      const endpoint = isJob ? "/api/diagnose" : "/api/report";
      const body = isJob
        ? {
            industry: form.ind,
            employees: result.employees,
            shortage: result.shortage,
            hireNeeded: result.hireNeeded,
          }
        : { industry: form.ind, result };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (isJob) {
        setAiJobs(data);
        setAiJobsFallback(!!data.fallback);
      } else {
        setAiReport(data);
        setAiReportFallback(!!data.fallback);
      }
    } catch {
      if (isJob) {
        setAiJobs({ jobs: [], tip: "네트워크 오류로 직무 추천을 불러오지 못했습니다." });
        setAiJobsFallback(true);
      } else {
        setAiReport({
          summary: "네트워크 오류로 리포트를 불러오지 못했습니다.",
          risk: "",
          recommendation: "",
          timeline: "",
        });
        setAiReportFallback(true);
      }
    } finally {
      if (isJob) setAiJobsLoading(false);
      else setAiReportLoading(false);
    }
  };

  const industryBM = INDUSTRY_AVG[form.ind] ?? OVERALL_AVG;
  const yourRate = result ? Number(result.effectiveRate) : 0;
  const cmp = result ? compareToIndustry(yourRate, form.ind) : null;

  return (
    <div style={{ fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        .vd-fadeUp { animation: fadeUp 0.6s ease forwards; }
        .vd-st1 { animation-delay: 0.1s; opacity: 0; }
        .vd-st2 { animation-delay: 0.2s; opacity: 0; }
        .vd-st3 { animation-delay: 0.3s; opacity: 0; }
        .vd-st4 { animation-delay: 0.4s; opacity: 0; }
        .vd-pulse { animation: pulse 2s infinite; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          padding: "60px 24px 80px",
          position: "relative",
          overflow: "hidden",
          borderRadius: 20,
          marginBottom: -40,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,201,167,0.13), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(29,133,235,0.10), transparent 70%)",
          }}
        />
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            position: "relative",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 20,
              background: "rgba(0,201,167,0.12)",
              border: "1px solid rgba(0,201,167,0.25)",
              marginBottom: 20,
            }}
          >
            <span
              className="vd-pulse"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00C9A7",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#00C9A7",
                letterSpacing: 0.5,
              }}
            >
              AI POWERED DIAGNOSTIC
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 38px)",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.3,
              marginBottom: 12,
              fontFamily: "'Outfit', sans-serif",
              margin: 0,
            }}
          >
            우리 회사 고용부담금,
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #00C9A7, #1D85EB)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              얼마나 절감할 수 있을까?
            </span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#94A3B8",
              lineHeight: 1.6,
              maxWidth: 500,
              margin: "16px auto 0",
            }}
          >
            4가지 정보만 입력하면 AI가 부담금 진단, 맞춤 직무 추천,
            <br />
            경영진 보고 리포트까지 생성합니다
          </p>
        </div>
      </section>

      {/* ── FORM CARD (overlapping hero) ─────────────────── */}
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 16px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            padding: "32px 28px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <NumField
              icon="👥"
              label="상시 근로자 수"
              placeholder="예: 500"
              value={form.emp}
              onChange={(v) => setForm((p) => ({ ...p, emp: v }))}
            />
            <NumField
              icon="♿"
              label="현재 장애인 고용 수"
              placeholder="예: 5"
              value={form.cur}
              onChange={(v) => setForm((p) => ({ ...p, cur: v }))}
            />
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>📊</span>
                중증 비율:{" "}
                <span style={{ color: "#00C9A7", fontFamily: "'Outfit'" }}>
                  {form.severe}%
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={form.severe}
                onChange={(e) =>
                  setForm((p) => ({ ...p, severe: +e.target.value }))
                }
                style={{
                  width: "100%",
                  accentColor: "#00C9A7",
                  height: 8,
                  marginTop: 8,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>🏭</span>업종
              </label>
              <select
                value={form.ind}
                onChange={(e) => setForm((p) => ({ ...p, ind: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 12,
                  fontSize: 15,
                  border: "2px solid #E2E8F0",
                  background: "#F8FAFC",
                  color: "#0F172A",
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {INDUSTRIES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => runDiagnosis()}
            style={{
              marginTop: 24,
              width: "100%",
              padding: "16px 0",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)",
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: 0.5,
              boxShadow: "0 8px 24px rgba(0,201,167,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,201,167,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,201,167,0.3)";
            }}
          >
            🔍 AI 진단 시작하기
          </button>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 10,
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#991B1B",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* ── EMPTY STATE ──────────────────────────────────── */}
      {!result && (
        <div
          style={{
            maxWidth: 680,
            margin: "40px auto",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {[
              { icon: "📊", title: "즉시 산출", desc: "부담금·절감액·장려금" },
              { icon: "🤖", title: "AI 직무 추천", desc: "업종별 맞춤 직무" },
              {
                icon: "📋",
                title: "리포트 생성",
                desc: "경영진 보고용 AI 리포트",
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  padding: "24px 16px",
                  border: "1px solid #E2E8F0",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0F172A",
                    marginBottom: 4,
                  }}
                >
                  {f.title}
                </div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESULTS ──────────────────────────────────────── */}
      {result && (
        <div
          style={{
            maxWidth: 680,
            margin: "32px auto 0",
            padding: "0 16px",
          }}
        >
          {/* Summary Cards (Animated) */}
          <div
            className="vd-fadeUp vd-st1"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              {
                label: "현재 연간 고용부담금",
                value: result.annualPenalty,
                color: "#EF4444",
                sub: `미달 ${result.shortage}명`,
              },
              {
                label: "브이드림 도입 시 절감",
                value: result.annualSaving,
                color: "#00C9A7",
                sub: `중증 ${result.hireNeeded}명 채용`,
              },
              {
                label: "총 연간 이익",
                value: result.totalBenefit,
                color: "#1D85EB",
                sub: "절감 + 장려금",
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  padding: "20px 16px",
                  textAlign: "center",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: c.color,
                  }}
                />
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#64748B",
                    marginBottom: 8,
                    letterSpacing: 0.5,
                  }}
                >
                  {c.label}
                </div>
                <AnimNum
                  value={c.value}
                  color={c.color}
                  size={26}
                  formatter={(v) => formatWon(v)}
                />
                <div
                  style={{
                    fontSize: 11,
                    color: "#94A3B8",
                    marginTop: 6,
                  }}
                >
                  {c.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Share Link */}
          <div className="vd-fadeUp vd-st1" style={{ marginBottom: 20 }}>
            <button
              onClick={handleShare}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 12,
                border: `1px solid ${
                  shareState === "copied" ? "#00C9A7" : "#E2E8F0"
                }`,
                background:
                  shareState === "copied"
                    ? "rgba(0,201,167,0.08)"
                    : "#FFFFFF",
                color: shareState === "copied" ? "#00C9A7" : "#64748B",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {shareState === "copied"
                ? "✅ 링크가 클립보드에 복사됐습니다 — 슬랙/메일로 공유하세요"
                : "🔗 이 진단 결과를 링크로 공유"}
            </button>
          </div>

          {/* Benchmark Chart */}
          <div
            className="vd-fadeUp vd-st2"
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              padding: 24,
              marginBottom: 20,
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <h3
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#0F172A",
                marginBottom: 4,
              }}
            >
              📊 업종별 고용률 벤치마크
            </h3>
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              귀사는 {form.ind} 평균 대비{" "}
              <span
                style={{
                  color: yourRate < industryBM ? "#EF4444" : "#10B981",
                  fontWeight: 700,
                }}
              >
                {Math.abs(yourRate - industryBM).toFixed(1)}%p{" "}
                {yourRate < industryBM ? "낮습니다" : "높습니다"}
              </span>
            </p>
            <CompareBar
              label="의무고용률"
              value={MANDATORY}
              max={5}
              color="#EF4444"
              isMandatory
            />
            <CompareBar
              label={`${form.ind} 평균`}
              value={industryBM}
              max={5}
              color="#94A3B8"
            />
            <CompareBar
              label="전체 평균"
              value={NATIONAL_AVG}
              max={5}
              color="#CBD5E1"
            />
            <CompareBar
              label="귀사 실고용률"
              value={yourRate}
              max={5}
              color={yourRate >= industryBM ? "#10B981" : "#EF4444"}
              highlight
            />
            <div
              style={{
                marginTop: 14,
                padding: "10px 14px",
                borderRadius: 10,
                background: "#FFF7ED",
                border: "1px solid #FED7AA",
                fontSize: 12,
                color: "#92400E",
                lineHeight: 1.5,
              }}
            >
              ⚠️ 2029년 의무고용률{" "}
              <strong>3.5%로 인상 확정</strong> — 지금 대비하지 않으면 부족인원과
              부담금이 더 늘어납니다
            </div>
          </div>

          {/* AI Action Buttons */}
          <div
            className="vd-fadeUp vd-st3"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <button
              onClick={() => callAI("job")}
              disabled={aiJobsLoading}
              style={aiBtnStyle("#00C9A7")}
              onMouseOver={(e) => {
                if (!aiJobsLoading) {
                  e.currentTarget.style.background = "#00C9A7";
                  e.currentTarget.style.color = "#FFF";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#FFF";
                e.currentTarget.style.color = "#00C9A7";
              }}
            >
              {aiJobsLoading ? "⏳ 분석 중..." : "🤖 AI 맞춤 직무 추천"}
            </button>
            <button
              onClick={() => callAI("report")}
              disabled={aiReportLoading}
              style={aiBtnStyle("#1D85EB")}
              onMouseOver={(e) => {
                if (!aiReportLoading) {
                  e.currentTarget.style.background = "#1D85EB";
                  e.currentTarget.style.color = "#FFF";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#FFF";
                e.currentTarget.style.color = "#1D85EB";
              }}
            >
              {aiReportLoading ? "⏳ 생성 중..." : "📋 경영진 리포트 생성"}
            </button>
          </div>

          {/* AI Jobs Result */}
          {aiJobs && (
            <div
              className="vd-fadeUp"
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                marginBottom: 20,
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#0F172A",
                    margin: 0,
                  }}
                >
                  🤖 {form.ind} 맞춤 직무 추천
                </h3>
                {aiJobsFallback && (
                  <span style={{ fontSize: 10, color: "#94A3B8" }}>
                    (샘플 — API 미설정)
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(aiJobs.jobs || []).map((j, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 16px",
                      borderRadius: 12,
                      background: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#0F172A",
                        }}
                      >
                        {j.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#64748B",
                          marginTop: 2,
                        }}
                      >
                        {j.desc}
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background: "#EDE9FE",
                            color: "#7C3AED",
                            fontWeight: 600,
                          }}
                        >
                          {j.type}
                        </span>
                        {j.difficulty && (
                          <span
                            style={{
                              fontSize: 11,
                              padding: "2px 8px",
                              borderRadius: 6,
                              background: "#F1F5F9",
                              color: "#64748B",
                              fontWeight: 600,
                            }}
                          >
                            난이도: {j.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontWeight: 700,
                        background: String(j.fit || "").includes("높")
                          ? "#ECFDF5"
                          : "#FFF7ED",
                        color: String(j.fit || "").includes("높")
                          ? "#059669"
                          : "#D97706",
                        flexShrink: 0,
                        marginLeft: 8,
                      }}
                    >
                      {j.fit}
                    </span>
                  </div>
                ))}
              </div>
              {aiJobs.tip && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    fontSize: 12,
                    color: "#166534",
                  }}
                >
                  💡 {aiJobs.tip}
                </div>
              )}
            </div>
          )}

          {/* AI Report Result */}
          {aiReport && (
            <div
              className="vd-fadeUp"
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                marginBottom: 20,
                border: "2px solid rgba(29,133,235,0.15)",
                boxShadow: "0 4px 20px rgba(29,133,235,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background:
                      "linear-gradient(135deg, #1D85EB, #00C9A7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  📋
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    AI 경영진 보고 리포트
                    {aiReportFallback && (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#94A3B8",
                          marginLeft: 6,
                          fontWeight: 500,
                        }}
                      >
                        (샘플)
                      </span>
                    )}
                  </h3>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#64748B",
                      margin: 0,
                    }}
                  >
                    이 리포트를 경영진에게 공유하세요
                  </p>
                </div>
              </div>
              {[
                {
                  label: "핵심 요약",
                  text: aiReport.summary,
                  color: "#0F172A",
                  bg: "#F8FAFC",
                },
                {
                  label: "⚠️ 미이행 리스크",
                  text: aiReport.risk,
                  color: "#991B1B",
                  bg: "#FEF2F2",
                },
                {
                  label: "✅ 도입 권고",
                  text: aiReport.recommendation,
                  color: "#166534",
                  bg: "#F0FDF4",
                },
                {
                  label: "📅 추천 일정",
                  text: aiReport.timeline,
                  color: "#92400E",
                  bg: "#FFF7ED",
                },
              ]
                .filter((s) => s.text)
                .map((s, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: 10,
                      padding: "12px 14px",
                      borderRadius: 10,
                      background: s.bg,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: s.color,
                        marginBottom: 4,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#334155",
                        lineHeight: 1.65,
                      }}
                    >
                      {s.text}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* FAQ Section (with AI Q&A) */}
          <div className="vd-fadeUp vd-st4" style={{ marginBottom: 20 }}>
            <FAQSection
              context={{
                industry: form.ind,
                employees: result.employees,
                shortage: result.shortage,
                annualPenalty: result.annualPenalty,
              }}
            />
          </div>

          {/* Premium Dark CTA */}
          <div
            className="vd-fadeUp"
            style={{
              background:
                "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              borderRadius: 20,
              padding: "32px 28px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              marginBottom: 40,
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(0,201,167,0.18), transparent 70%)",
              }}
            />
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(29,133,235,0.12), transparent 70%)",
              }}
            />
            <h3
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#FFFFFF",
                marginBottom: 12,
                fontFamily: "'Outfit', sans-serif",
                margin: "0 0 12px",
                position: "relative",
              }}
            >
              브이드림과 함께 시작하세요
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginBottom: 16,
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              {["🛡️ 분쟁률 0%", "⚡ 2~4주 도입", "🏠 편의시설 불필요"].map(
                (t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      color: "#00C9A7",
                      padding: "5px 14px",
                      borderRadius: 20,
                      background: "rgba(0,201,167,0.12)",
                      fontWeight: 600,
                      border: "1px solid rgba(0,201,167,0.25)",
                    }}
                  >
                    {t}
                  </span>
                )
              )}
            </div>
            <p
              style={{
                fontSize: 13,
                color: "#94A3B8",
                marginBottom: 20,
                position: "relative",
              }}
            >
              <strong style={{ color: "#00C9A7" }}>450+ 기업</strong>이 이미
              브이드림과 함께하고 있습니다
            </p>
            <a
              href="https://www.vdream.co.kr/inquiry"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "14px 36px",
                borderRadius: 12,
                textDecoration: "none",
                background:
                  "linear-gradient(135deg, #00C9A7, #1D85EB)",
                color: "#FFF",
                fontSize: 15,
                fontWeight: 800,
                boxShadow: "0 8px 24px rgba(0,201,167,0.3)",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,201,167,0.42)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,201,167,0.3)";
              }}
            >
              무료 상담 신청하기 →
            </a>
            <p
              style={{
                fontSize: 12,
                color: "#64748B",
                marginTop: 14,
                position: "relative",
              }}
            >
              또는 대표번호{" "}
              <a
                href="tel:1644-8619"
                style={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "'Outfit', monospace",
                }}
              >
                1644-8619
              </a>
              로 전화 상담
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * 보조 컴포넌트
 * ============================================================ */

function NumField({ icon, label, placeholder, value, onChange }) {
  return (
    <div>
      <label
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#334155",
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 12,
          fontSize: 16,
          border: "2px solid #E2E8F0",
          background: "#F8FAFC",
          color: "#0F172A",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#00C9A7";
          e.target.style.boxShadow = "0 0 0 4px rgba(0,201,167,0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E2E8F0";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function aiBtnStyle(color) {
  return {
    padding: 16,
    borderRadius: 14,
    cursor: "pointer",
    textAlign: "center",
    background: "#FFFFFF",
    border: `2px solid ${color}`,
    color,
    fontSize: 14,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.2s",
  };
}
