"use client";

/**
 * 랜딩 템플릿 B: "스토리텔링형"
 * 질문 헤로 + 4단계 스토리 타임라인 + 고객 후기 + 도입 프로세스 + 최종 CTA
 *
 * Props:
 *   headline, subhead, ctaText, ctaUrl, phone
 *   story: [{ icon, label, title, desc }] (4개)
 *   testimonial: { quote, name, title }
 *   process: [{ step, label, desc }] (4단계)
 */

export default function LandingStory({
  headline = "장애인 채용, 어디서부터 시작해야 할지 막막하셨죠?",
  subhead = "이미 450개 기업이 같은 고민을 해결했습니다. 그 경로를 그대로 따라오세요.",
  ctaText = "무료 컨설팅 신청하기",
  ctaUrl = "/diagnose",
  story = [
    {
      icon: "💸",
      label: "STAGE 1",
      title: "매년 부담금만 내고 있었습니다",
      desc: "○○산업개발은 매년 20억원의 고용부담금을 납부하고 있었습니다.",
    },
    {
      icon: "💡",
      label: "STAGE 2",
      title: "재택근무로 해결할 수 있다는 걸",
      desc: "편의시설 투자가 아닌, 재택근무 기반 채용으로 의무를 충족할 수 있다는 사실을 발견했습니다.",
    },
    {
      icon: "🚀",
      label: "STAGE 3",
      title: "2주 만에 채용이 완료됐습니다",
      desc: "브이드림 30만 인재풀에서 업종 맞춤 매칭. 편의시설 투자 0원, 2~4주 내 도입.",
    },
    {
      icon: "🏆",
      label: "STAGE 4",
      title: "연간 16억원을 절감했습니다",
      desc: "부담금의 80%를 절감. 채용된 직원은 데이터 라벨링·모니터링 업무로 사내 생산성도 끌어올렸습니다.",
    },
  ],
  testimonial = {
    quote:
      "막연했던 장애인 고용이 2주 만에 끝났습니다. 분쟁 걱정도 없고, 무엇보다 비용 부담이 사라진 게 놀라웠어요.",
    name: "○○산업개발",
    title: "HR 본부장",
  },
  process = [
    { step: "01", label: "상담", desc: "30분 무료 상담으로 우리 회사 상황 진단" },
    { step: "02", label: "직무 설계", desc: "재택근무 가능 직무 매칭 설계" },
    { step: "03", label: "채용 매칭", desc: "30만 인재풀에서 적합 인재 매칭" },
    { step: "04", label: "운영", desc: "플립 시스템으로 근태·급여·증빙 통합 관리" },
  ],
  phone = "1644-8619",
}) {
  return (
    <div
      className="bg-white"
      style={{ fontFamily: "'Noto Sans KR', sans-serif", color: "#0F172A" }}
    >
      {/* HERO */}
      <section className="relative overflow-hidden px-5 sm:px-10 py-20 sm:py-28">
        <div
          aria-hidden
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(29,133,235,0.10), transparent 70%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="inline-block mb-5 text-xs font-bold tracking-[0.3em]"
            style={{ color: "#1D85EB" }}
          >
            VDREAM × HR
          </div>
          <h1
            className="font-black tracking-tight leading-tight mb-6"
            style={{ fontSize: "clamp(30px, 5vw, 52px)", color: "#0F172A" }}
          >
            {headline}
          </h1>
          <p
            className="max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "#334155" }}
          >
            {subhead}
          </p>
          <a
            href={ctaUrl}
            className="inline-block px-10 py-5 rounded-2xl font-black"
            style={{
              background: "linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)",
              color: "#FFFFFF",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              boxShadow: "0 10px 30px rgba(0,201,167,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px) scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
          >
            {ctaText} →
          </a>
        </div>
      </section>

      {/* 스토리 타임라인 */}
      <section
        className="px-5 sm:px-10 py-16 sm:py-24"
        style={{ background: "#F8FAFC" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-center font-black mb-16"
            style={{ fontSize: "clamp(22px, 3.5vw, 36px)", color: "#0F172A" }}
          >
            450개 기업이 거쳐간 길
          </h2>

          <div className="relative">
            {/* 세로 라인 */}
            <div
              className="absolute left-7 top-0 bottom-0 w-[2px]"
              style={{ background: "#E2E8F0" }}
            />

            <div className="flex flex-col gap-10">
              {story.map((s, i) => (
                <div key={i} className="relative pl-20">
                  <div
                    className="absolute left-0 top-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: "linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)",
                      color: "#FFFFFF",
                      boxShadow: "0 6px 18px rgba(0,201,167,0.25)",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 2,
                      color: "#1D85EB",
                      marginBottom: 6,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {s.label}
                  </div>
                  <h3
                    className="font-black mb-2"
                    style={{ fontSize: 20, color: "#0F172A", lineHeight: 1.4 }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      color: "#334155",
                      fontSize: 15,
                      lineHeight: 1.7,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 고객 후기 */}
      <section className="px-5 sm:px-10 py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-3xl p-8 sm:p-12 text-center"
            style={{
              background: "#FFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="text-6xl mb-4"
              style={{ color: "#00C9A7", lineHeight: 1, opacity: 0.4 }}
            >
              "
            </div>
            <p
              className="leading-relaxed mb-6"
              style={{ fontSize: "clamp(17px, 2.2vw, 22px)", color: "#0F172A", fontWeight: 600 }}
            >
              {testimonial.quote}
            </p>
            <div
              className="inline-flex items-center gap-3 pt-6"
              style={{ borderTop: "1px solid #E2E8F0" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white"
                style={{
                  background: "linear-gradient(135deg, #00C9A7, #1D85EB)",
                }}
              >
                {testimonial.name.charAt(0)}
              </div>
              <div className="text-left">
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                  {testimonial.name}
                </div>
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  {testimonial.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 도입 프로세스 */}
      <section
        className="px-5 sm:px-10 py-16 sm:py-24"
        style={{ background: "#F8FAFC" }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center font-black mb-12"
            style={{ fontSize: "clamp(22px, 3.5vw, 36px)", color: "#0F172A" }}
          >
            어떻게 진행되나요?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {process.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 relative"
                style={{
                  background: "#FFF",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="font-black mb-3"
                  style={{
                    fontSize: 11,
                    letterSpacing: 2,
                    color: "#1D85EB",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  STEP {p.step}
                </div>
                <h3
                  className="font-black mb-2"
                  style={{ fontSize: 16, color: "#0F172A" }}
                >
                  {p.label}
                </h3>
                <p style={{ fontSize: 12, color: "#334155", lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
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
            당신의 회사 차례입니다
          </h2>
          <p
            className="mb-8"
            style={{ fontSize: 16, color: "rgba(255,255,255,0.92)" }}
          >
            450개 기업과 같은 길, 무료 상담으로 시작하세요.
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
