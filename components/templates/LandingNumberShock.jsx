"use client";

/**
 * 랜딩 템플릿 A: "숫자 충격형"
 * 거대한 숫자 + 충격 헤드라인 + 비교 카드 + 페인포인트 + USP + 소셜프루프 + CTA
 *
 * Props:
 *   badge, bigNumber, headline, subhead, ctaText, ctaUrl
 *   comparison: { before, after, saving }
 *   painPoints: string[]
 *   usps: [{ icon, title, desc }]
 *   socialProof: { companies, hires, savings, disputes }
 *   phone: string
 */

export default function LandingNumberShock({
  badge = "450+ 기업이 선택한",
  bigNumber = "3억 2천만원",
  headline = "매년 이만큼 버리고 계십니까?",
  subhead = "고용부담금의 80%를 절감한 기업들의 비밀.",
  ctaText = "30초 만에 우리 회사 절감액 확인하기",
  ctaUrl = "/diagnose",
  comparison = { before: "3.2억원", after: "0.8억원", saving: "2.4억원" },
  painPoints = [
    "복잡한 신고 절차에 매년 시달리고 계신가요?",
    "편의시설 비용이 부담되시나요?",
    "채용 후 관리할 인프라가 없으신가요?",
  ],
  usps = [
    { icon: "🏠", title: "재택근무 기반", desc: "편의시설 투자 0원" },
    { icon: "📋", title: "플립 시스템", desc: "채용~관리 원스톱" },
    { icon: "🛡️", title: "분쟁률 0%", desc: "450+사 무사고" },
  ],
  socialProof = {
    companies: "450+",
    hires: "24,000명+",
    savings: "8,300억원+",
    disputes: "0건",
  },
  phone = "1644-8619",
}) {
  return (
    <div
      className="bg-white"
      style={{ fontFamily: "'Noto Sans KR', sans-serif", color: "#0F172A" }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden px-5 sm:px-10 py-16 sm:py-24">
        {/* 배경 장식: 우측 상단 그라데이션 원형 */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,201,167,0.18), rgba(29,133,235,0.10) 50%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute top-40 -left-20 w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.10), transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <span
            className="inline-block px-4 py-2 rounded-full text-xs font-bold mb-6"
            style={{
              background: "rgba(0,201,167,0.10)",
              color: "#00C9A7",
              border: "1px solid rgba(0,201,167,0.25)",
            }}
          >
            {badge}
          </span>

          <div
            className="font-black tracking-tight leading-none mb-4"
            style={{
              fontSize: "clamp(56px, 11vw, 132px)",
              background: "linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {bigNumber}
          </div>

          <h1
            className="font-black tracking-tight leading-tight mb-6"
            style={{ fontSize: "clamp(28px, 4.5vw, 48px)", color: "#0F172A" }}
          >
            {headline}
          </h1>

          <p
            className="max-w-2xl mx-auto leading-relaxed mb-10"
            style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "#334155" }}
          >
            {subhead}
          </p>

          <a
            href={ctaUrl}
            className="inline-block px-10 py-5 rounded-2xl font-black shadow-lg hover:shadow-2xl transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)",
              color: "#FFFFFF",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              boxShadow: "0 10px 30px rgba(0,201,167,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
            }}
          >
            {ctaText} →
          </a>
        </div>
      </section>

      {/* 비교 섹션 */}
      <section className="px-5 sm:px-10 py-16 sm:py-20" style={{ background: "#F8FAFC" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ComparisonCard
              label="현재 부담금"
              value={comparison.before}
              color="#EF4444"
              icon="💸"
            />
            <ComparisonCard
              label="브이드림 도입 후"
              value={comparison.after}
              color="#64748B"
              icon="🏠"
            />
            <ComparisonCard
              label="연간 절감액"
              value={comparison.saving}
              color="#00C9A7"
              icon="✨"
              highlight
            />
          </div>
        </div>
      </section>

      {/* 페인포인트 */}
      <section className="px-5 sm:px-10 py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center font-black mb-12"
            style={{ fontSize: "clamp(22px, 3.5vw, 36px)", color: "#0F172A" }}
          >
            이런 고민, 익숙하시죠?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {painPoints.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 sm:p-8 text-center"
                style={{
                  background: "#FFF",
                  border: "1px solid #FECACA",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div className="text-3xl mb-3">⚠️</div>
                <p style={{ color: "#334155", fontSize: 15, lineHeight: 1.6 }}>
                  {p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USP */}
      <section
        className="px-5 sm:px-10 py-16 sm:py-20"
        style={{ background: "#F8FAFC" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center font-black mb-12"
            style={{ fontSize: "clamp(22px, 3.5vw, 36px)", color: "#0F172A" }}
          >
            브이드림이 <span style={{ color: "#00C9A7" }}>해결합니다</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {usps.map((u, i) => (
              <div
                key={i}
                className="rounded-2xl p-8"
                style={{
                  background: "#FFF",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-5"
                  style={{ background: "rgba(0,201,167,0.10)" }}
                >
                  {u.icon}
                </div>
                <h3
                  className="font-black mb-2"
                  style={{ fontSize: 18, color: "#0F172A" }}
                >
                  {u.title}
                </h3>
                <p style={{ color: "#334155", fontSize: 14, lineHeight: 1.6 }}>
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 소셜 프루프 바 */}
      <section className="px-5 sm:px-10 py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-8 sm:p-12"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,201,167,0.06), rgba(29,133,235,0.06))",
              border: "1px solid rgba(0,201,167,0.20)",
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
              <ProofStat label="고객사" value={socialProof.companies} />
              <ProofStat label="누적 채용" value={socialProof.hires} />
              <ProofStat label="누적 절감" value={socialProof.savings} />
              <ProofStat label="분쟁률" value={socialProof.disputes} accent="#EF4444" />
            </div>
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section
        className="px-5 sm:px-10 py-16 sm:py-24"
        style={{
          background: "linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-black mb-4 leading-tight"
            style={{ fontSize: "clamp(26px, 4.5vw, 44px)", color: "#FFFFFF" }}
          >
            지금 무료로 진단받으세요
          </h2>
          <p
            className="mb-8 leading-relaxed"
            style={{ fontSize: 16, color: "rgba(255,255,255,0.92)" }}
          >
            30초면 충분합니다. 우리 회사 부담금과 절감액을 즉시 확인하세요.
          </p>
          <a
            href={ctaUrl}
            className="inline-block px-10 py-5 rounded-2xl font-black shadow-lg transition-all"
            style={{
              background: "#FFFFFF",
              color: "#0F172A",
              fontSize: 18,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px) scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
          >
            {ctaText} →
          </a>
          <div
            className="mt-6"
            style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}
          >
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

function ComparisonCard({ label, value, color, icon, highlight }) {
  return (
    <div
      className="rounded-2xl p-7 text-center"
      style={{
        background: highlight ? "#FFF" : "#FFF",
        border: `1px solid ${highlight ? color : "#E2E8F0"}`,
        boxShadow: highlight
          ? `0 8px 30px ${color}30`
          : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: "#64748B",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {label.toUpperCase()}
      </div>
      <div
        className="font-black"
        style={{
          fontSize: "clamp(28px, 4vw, 42px)",
          color,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: -1,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ProofStat({ label, value, accent = "#00C9A7" }) {
  return (
    <div>
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
