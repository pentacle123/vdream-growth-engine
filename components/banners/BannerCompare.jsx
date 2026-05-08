"use client";

import { BRAND, rel, VLogo, CtaButton } from "./bannerUtils";

/**
 * 배너 2: "비교형"
 * 부담금 → 채용비용 화살표 + 절감액 강조
 *
 * Props:
 *   size, before("3.2억"), after("0.8억"), saving("연 2.4억 절감")
 *   cta
 */
export default function BannerCompare({
  size,
  before = "3.2억",
  after = "0.8억",
  saving = "연 2.4억 절감",
  cta = "지금 확인하기",
}) {
  const isHorizontal = size.layout === "horizontal";
  const isSquare = size.layout === "square";
  const isCompact = size.w * size.h < 50000;

  return (
    <div
      style={{
        width: size.w,
        height: size.h,
        background: BRAND.surface,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Noto Sans KR', 'Pretendard', system-ui, sans-serif",
        color: BRAND.text,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: rel(size, isCompact ? 0.04 : 0.06),
      }}
    >
      <div style={{ position: "absolute", top: rel(size, 0.04), right: rel(size, 0.04) }}>
        <VLogo size={size} />
      </div>

      {/* 비교 영역 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isSquare ? "center" : "flex-start",
          gap: rel(size, 0.018),
          minWidth: 0,
          marginTop: isCompact ? 0 : rel(size, 0.04),
        }}
      >
        {/* Before → After */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: rel(size, 0.025),
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontSize: rel(size, isCompact ? 0.11 : 0.13),
              fontWeight: 900,
              color: BRAND.red,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: -0.5,
              lineHeight: 1,
              textDecoration: "line-through",
              textDecorationThickness: rel(size, 0.008),
              opacity: 0.85,
            }}
          >
            {before}
          </div>
          <div
            style={{
              fontSize: rel(size, isCompact ? 0.09 : 0.11),
              color: BRAND.mute,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            →
          </div>
          <div
            style={{
              fontSize: rel(size, isCompact ? 0.13 : 0.15),
              fontWeight: 900,
              background: BRAND.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: -0.5,
              lineHeight: 1,
            }}
          >
            {after}
          </div>
        </div>

        {/* 비교 시각화 바 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "70%",
            maxWidth: rel(size, 1.3),
            height: rel(size, 0.022),
            borderRadius: rel(size, 0.015),
            background: BRAND.surface2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "30%",
              height: "100%",
              background: BRAND.red,
              opacity: 0.7,
            }}
          />
          <div
            style={{
              width: "70%",
              height: "100%",
              background: BRAND.gradient,
            }}
          />
        </div>

        {/* 절감액 강조 */}
        <div
          style={{
            display: "inline-block",
            padding: `${rel(size, 0.018)}px ${rel(size, 0.035)}px`,
            borderRadius: rel(size, 0.025),
            background: "rgba(0,201,167,0.10)",
            border: `1px solid ${BRAND.primary}`,
            fontSize: rel(size, isCompact ? 0.08 : 0.06),
            fontWeight: 900,
            color: BRAND.primary,
            letterSpacing: -0.3,
            lineHeight: 1.2,
          }}
        >
          ✨ {saving}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: isHorizontal ? 0 : rel(size, 0.03),
          marginLeft: isHorizontal ? rel(size, 0.04) : 0,
          flexShrink: 0,
          alignSelf: isSquare ? "center" : "flex-end",
        }}
      >
        <CtaButton size={size} text={cta} scale={isSquare ? 1.15 : 1} />
      </div>
    </div>
  );
}
