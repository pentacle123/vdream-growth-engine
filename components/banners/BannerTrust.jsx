"use client";

import { BRAND, rel, VLogo, CtaButton } from "./bannerUtils";

/**
 * 배너 4: "신뢰형"
 * 그라데이션 10% 오버레이 + 소셜프루프 + 3개 USP + CTA
 *
 * Props:
 *   size, badge("450+ 기업이 선택한"), headline("장애인 고용 솔루션"), proofs(["분쟁 0건", "2주 도입", "절감 80%"]), cta
 */
export default function BannerTrust({
  size,
  badge = "450+ 기업이 선택한",
  headline = "장애인 고용 솔루션",
  proofs = ["분쟁 0건", "2주 도입", "절감 80%"],
  cta = "상담 신청",
}) {
  const isHorizontal = size.layout === "horizontal";
  const isSquare = size.layout === "square";
  const isCompact = size.w * size.h < 50000;

  return (
    <div
      style={{
        width: size.w,
        height: size.h,
        background:
          "linear-gradient(135deg, rgba(0,201,167,0.08) 0%, rgba(29,133,235,0.08) 100%), #FFFFFF",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Noto Sans KR', 'Pretendard', system-ui, sans-serif",
        color: BRAND.text,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        alignItems: isHorizontal ? "center" : "flex-start",
        justifyContent: "space-between",
        padding: rel(size, isCompact ? 0.04 : 0.05),
        border: `1px solid rgba(0,201,167,0.20)`,
      }}
    >
      <div style={{ position: "absolute", top: rel(size, 0.04), right: rel(size, 0.04) }}>
        <VLogo size={size} />
      </div>

      {/* 텍스트 영역 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isSquare ? "center" : "flex-start",
          textAlign: isSquare ? "center" : "left",
          gap: rel(size, 0.015),
          minWidth: 0,
          marginTop: isCompact ? 0 : rel(size, 0.04),
        }}
      >
        {/* 뱃지 */}
        <div
          style={{
            display: "inline-block",
            padding: `${rel(size, 0.012)}px ${rel(size, 0.025)}px`,
            borderRadius: rel(size, 0.04),
            background: BRAND.gradient,
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: rel(size, isCompact ? 0.06 : 0.045),
            letterSpacing: -0.2,
            lineHeight: 1.2,
          }}
        >
          ⭐ {badge}
        </div>

        {/* 헤드라인 */}
        <div
          style={{
            fontSize: rel(size, isCompact ? 0.10 : isSquare ? 0.10 : 0.085),
            fontWeight: 900,
            color: BRAND.text,
            lineHeight: 1.25,
            letterSpacing: -0.5,
          }}
        >
          {headline}
        </div>

        {/* 소셜 프루프 3개 */}
        <div
          style={{
            display: "flex",
            gap: rel(size, 0.02),
            flexWrap: "wrap",
            justifyContent: isSquare ? "center" : "flex-start",
            marginTop: rel(size, 0.005),
          }}
        >
          {proofs.map((p, i) => (
            <span
              key={i}
              style={{
                fontSize: rel(size, isCompact ? 0.06 : 0.045),
                fontWeight: 800,
                color: BRAND.primary,
                fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: "nowrap",
                display: "inline-flex",
                alignItems: "center",
                gap: rel(size, 0.008),
              }}
            >
              ✓ {p}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: isHorizontal ? 0 : rel(size, 0.03),
          marginLeft: isHorizontal ? rel(size, 0.04) : 0,
          flexShrink: 0,
          alignSelf: isSquare ? "center" : isHorizontal ? "center" : "flex-end",
        }}
      >
        <CtaButton size={size} text={cta} scale={isSquare ? 1.2 : 1} />
      </div>
    </div>
  );
}
