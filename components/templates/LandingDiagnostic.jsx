"use client";

import { useState } from "react";

/**
 * 랜딩 템플릿 C: "진단기 임베드형"
 * 2-컬럼 히어로 (좌: 카피, 우: 미니 진단기 폼)
 * + USP + 숫자 증거 + FAQ + 최종 CTA
 *
 * Props:
 *   headline, subhead, ctaText, ctaUrl, phone
 *   uspBadges: string[]
 *   usps: [{ icon, title, desc }]
 *   stats: { companies, hires, savings, disputes }
 *   faqs: [{ q, a }]
 */

export default function LandingDiagnostic({
  headline = "30초면 우리 회사 절감액을 알 수 있습니다",
  subhead = "기업 정보 두 줄만 입력하면 AI가 즉시 부담금과 절감 시나리오를 계산해드립니다.",
  uspBadges = ["편의시설 0원", "2주 도입", "분쟁 0건"],
  ctaText = "AI 진단 시작",
  ctaUrl = "/diagnose",
  usps = [
    { icon: "💰", title: "부담금 80% 절감", desc: "○○산업 연 16억 절감" },
    { icon: "🏠", title: "재택 기반", desc: "편의시설 투자 0원" },
    { icon: "🛡️", title: "분쟁률 0%", desc: "450+사 무사고" },
  ],
  stats = {
    companies: "450+",
    hires: "24,000명+",
    savings: "8,300억원+",
    disputes: "0건",
  },
  faqs = [
    {
      q: "도입 비용은 얼마인가요?",
      a: "고용부담금 대비 40~80% 수준의 비용으로 도입 가능. 기업 규모와 채용 인원에 따라 맞춤 견적을 제공합니다.",
    },
    {
      q: "어떤 직무에 채용할 수 있나요?",
      a: "데이터 라벨링, 문서관리, 온라인 모니터링, CS 채팅상담, 디자인 보조 등 재택근무 가능한 다양한 직무. AI가 업종 맞춤 추천.",
    },
    {
      q: "도입 기간은?",
      a: "상담부터 채용 매칭 완료까지 평균 2~4주. 편의시설 투자 불필요로 빠른 도입.",
    },
    {
      q: "관리는 어떻게 하나요?",
      a: "자체 개발 HR 시스템 '플립'으로 근태·급여·업무일지·증빙 원스톱 관리.",
    },
  ],
  phone = "1644-8619",
}) {
  return (
    <div
      className="bg-white"
      style={{ fontFamily: "'Noto Sans KR', sans-serif", color: "#0F172A" }}
    >
      {/* HERO 2-column */}
      <section className="relative overflow-hidden px-5 sm:px-10 py-16 sm:py-24">
        <div
          aria-hidden
          className="absolute -top-32 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,201,167,0.10), rgba(29,133,235,0.06) 50%, transparent 70%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* 좌: 카피 (3 columns) */}
          <div className="lg:col-span-3">
            <div
              className="inline-block mb-5 text-xs font-bold tracking-[0.3em]"
              style={{ color: "#00C9A7" }}
            >
              VDREAM × AI 진단
            </div>
            <h1
              className="font-black tracking-tight leading-tight mb-6"
              style={{ fontSize: "clamp(28px, 4.5vw, 48px)", color: "#0F172A" }}
            >
              {headline}
            </h1>
            <p
              className="leading-relaxed mb-7"
              style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "#334155" }}
            >
              {subhead}
            </p>
            <div className="flex gap-2 flex-wrap">
              {uspBadges.map((b, i) => (
                <span
                  key={i}
                  className="inline-block px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    background: "rgba(0,201,167,0.10)",
                    color: "#00C9A7",
                    border: "1px solid rgba(0,201,167,0.25)",
                  }}
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          {/* 우: 미니 진단기 (2 columns) */}
          <div className="lg:col-span-2">
            <MiniDiagnostic ctaText={ctaText} ctaUrl={ctaUrl} />
          </div>
        </div>
      </section>

      {/* 왜 브이드림 USP 3개 */}
      <section
        className="px-5 sm:px-10 py-16 sm:py-20"
        style={{ background: "#F8FAFC" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center font-black mb-12"
            style={{ fontSize: "clamp(22px, 3.5vw, 36px)", color: "#0F172A" }}
          >
            왜 <span style={{ color: "#00C9A7" }}>브이드림</span>인가?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {usps.map((u, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 text-center"
                style={{
                  background: "#FFF",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div className="text-5xl mb-4">{u.icon}</div>
                <h3
                  className="font-black mb-2"
                  style={{ fontSize: 18, color: "#0F172A" }}
                >
                  {u.title}
                </h3>
                <p style={{ color: "#334155", fontSize: 14 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 숫자 증거 */}
      <section className="px-5 sm:px-10 py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="고객사" value={stats.companies} />
            <Stat label="누적 채용" value={stats.hires} />
            <Stat label="누적 절감" value={stats.savings} />
            <Stat label="분쟁률" value={stats.disputes} accent="#EF4444" />
          </div>
        </div>
      </section>

      {/* FAQ 아코디언 */}
      <section
        className="px-5 sm:px-10 py-16 sm:py-20"
        style={{ background: "#F8FAFC" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-center font-black mb-10"
            style={{ fontSize: "clamp(22px, 3.5vw, 36px)", color: "#0F172A" }}
          >
            자주 묻는 질문
          </h2>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* 최종 CTA */}
      <section
        className="px-5 sm:px-10 py-16 sm:py-24"
        style={{ background: "linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-black mb-4 leading-tight"
            style={{ fontSize: "clamp(26px, 4.5vw, 44px)", color: "#FFFFFF" }}
          >
            지금 30초 진단을 시작하세요
          </h2>
          <p
            className="mb-8"
            style={{ fontSize: 16, color: "rgba(255,255,255,0.92)" }}
          >
            우리 회사 부담금과 절감 가능액을 즉시 확인하세요.
          </p>
          <a
            href={ctaUrl}
            className="inline-block px-10 py-5 rounded-2xl font-black"
            style={{
              background: "#FFFFFF",
              color: "#0F172A",
              fontSize: 18,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px) scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
          >
            {ctaText} →
          </a>
          <div className="mt-6" style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
            또는{" "}
            <a
              href={`tel:${phone}`}
              className="font-mono font-bold underline"
              style={{ color: "#FFFFFF" }}
            >
              {phone}
            </a>
            {" "}전화 상담
          </div>
        </div>
      </section>
    </div>
  );
}

/* ====== 미니 진단기 위젯 ====== */

function MiniDiagnostic({ ctaText, ctaUrl }) {
  const [emp, setEmp] = useState("");
  const [cur, setCur] = useState("");
  const [result, setResult] = useState(null);

  const calc = () => {
    const e = parseInt(emp, 10);
    const c = parseInt(cur, 10) || 0;
    if (!Number.isFinite(e) || e < 50) {
      setResult({ error: "상시근로자 50명 이상 입력" });
      return;
    }
    const mandatoryCount = Math.ceil(e * 0.031);
    const shortage = Math.max(0, mandatoryCount - c);
    const annualPenalty = shortage * 2_156_880 * 12;
    const hireCost = Math.ceil(shortage / 2) * 2_200_000 * 12;
    const saving = Math.max(0, annualPenalty - hireCost);
    setResult({
      penalty: Math.round(annualPenalty / 1e8) + "." + Math.floor((annualPenalty % 1e8) / 1e7) + "억원",
      saving: Math.round(saving / 1e8) + "." + Math.floor((saving % 1e8) / 1e7) + "억원",
    });
  };

  return (
    <div
      className="rounded-3xl p-7"
      style={{
        background: "#FFF",
        border: "2px solid rgba(0,201,167,0.30)",
        boxShadow:
          "0 20px 50px rgba(0,201,167,0.18), 0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="font-black text-center mb-1"
        style={{ fontSize: 17, color: "#0F172A" }}
      >
        ⚡ 30초 미니 진단
      </div>
      <p className="text-center mb-5" style={{ fontSize: 12, color: "#64748B" }}>
        2가지만 입력하면 즉시 계산
      </p>

      <div className="flex flex-col gap-3 mb-4">
        <NumberInput
          label="상시 근로자 수"
          unit="명"
          value={emp}
          onChange={setEmp}
        />
        <NumberInput
          label="현재 장애인 고용 수"
          unit="명"
          value={cur}
          onChange={setCur}
        />
      </div>

      <button
        onClick={calc}
        className="w-full py-3 rounded-xl font-black mb-3"
        style={{
          background: "linear-gradient(135deg, #00C9A7, #1D85EB)",
          color: "#FFFFFF",
          fontSize: 14,
        }}
      >
        🔍 즉시 계산
      </button>

      {result?.error && (
        <div
          className="text-center text-sm py-2 rounded-lg"
          style={{ color: "#EF4444", background: "#FEF2F2" }}
        >
          ⚠️ {result.error}
        </div>
      )}

      {result && !result.error && (
        <div
          className="rounded-xl p-4 mb-3"
          style={{
            background: "rgba(0,201,167,0.08)",
            border: "1px solid rgba(0,201,167,0.30)",
          }}
        >
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div style={{ fontSize: 9, color: "#64748B", fontWeight: 700 }}>
                예상 부담금
              </div>
              <div
                className="font-black"
                style={{
                  fontSize: 20,
                  color: "#EF4444",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {result.penalty}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: "#64748B", fontWeight: 700 }}>
                예상 절감액
              </div>
              <div
                className="font-black"
                style={{
                  fontSize: 20,
                  color: "#00C9A7",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {result.saving}
              </div>
            </div>
          </div>
        </div>
      )}

      <a
        href={ctaUrl}
        className="block text-center py-2 text-sm font-bold"
        style={{ color: "#1D85EB" }}
      >
        정밀 AI 진단 받기 →
      </a>
    </div>
  );
}

function NumberInput({ label, unit, value, onChange }) {
  return (
    <div>
      <label
        className="block mb-1.5"
        style={{ fontSize: 11, color: "#334155", fontWeight: 700 }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg outline-none"
          style={{
            padding: "10px 36px 10px 14px",
            background: "#F8FAFC",
            border: "1px solid #CBD5E1",
            color: "#0F172A",
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ fontSize: 12, color: "#64748B" }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

function FaqList({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{
              background: "#FFF",
              border: `1px solid ${isOpen ? "rgba(0,201,167,0.40)" : "#E2E8F0"}`,
              transition: "border-color 0.15s",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between text-left px-5 py-4"
              style={{
                color: isOpen ? "#00C9A7" : "#0F172A",
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              <span>{item.q}</span>
              <span
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s",
                  color: isOpen ? "#00C9A7" : "#64748B",
                }}
              >
                ▾
              </span>
            </button>
            {isOpen && (
              <div
                className="px-5 pb-4"
                style={{
                  fontSize: 14,
                  color: "#334155",
                  lineHeight: 1.7,
                  borderTop: "1px solid #E2E8F0",
                  paddingTop: 14,
                }}
              >
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Stat({ label, value, accent = "#00C9A7" }) {
  return (
    <div className="text-center">
      <div
        className="font-black"
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          color: accent,
          fontFamily: "'JetBrains Mono', monospace",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#64748B",
          marginTop: 6,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
    </div>
  );
}
