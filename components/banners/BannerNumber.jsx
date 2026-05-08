"use client";

import { BRAND, rel, VLogo, CtaButton } from "./bannerUtils";

/**
 * 배너 1: "숫자 임팩트"
 * 거대한 숫자 + 헤드라인 + CTA + 그라데이션 하단 바
 *
 * Props:
 *   size: { w, h, layout: "horizontal"|"vertical"|"square" }
 *   bigNumber: "3억 2천만원"
 *   headline: "매년 버리고 계십니까?"
 *   cta: "무료 진단받기"
 */
export default function BannerNumber({ size, bigNumber, headline, cta = "무료 진단받기" }) {
  const isHorizontal = size.layout === "horizontal";
  const isSquare = size.layout === "square";
  const isCompact = size.w * size.h < 50000; // 320×100 등 작은 배너

  return (
    <div
      style={{
        width: size.w,
        height: size.h,
        background: BRAND.bg,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Noto Sans KR', 'Pretendard', system-ui, sans-serif",
        color: BRAND.text,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        alignItems: isHorizontal ? "center" : "flex-start",
        justifyContent: isSquare ? "center" : "space-between",
        padding: rel(size, isCompact ? 0.04 : 0.05),
      }}
    >
      {/* 우측 상단 글로우 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -rel(size, 0.3),
          right: -rel(size, 0.3),
          width: rel(size, 0.8),
          height: rel(size, 0.8),
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,201,167,0.20), rgba(29,133,235,0.12) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* 좌상단 V 로고 */}
      <div style={{ position: "absolute", top: rel(size, 0.04), left: rel(size, 0.04) }}>
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
          gap: rel(size, 0.012),
          marginTop: isCompact ? 0 : rel(size, 0.05),
          minWidth: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: rel(size, isCompact ? 0.14 : isSquare ? 0.13 : 0.16),
            fontWeight: 900,
            background: BRAND.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          {bigNumber}
        </div>
        <div
          style={{
            fontSize: rel(size, isCompact ? 0.07 : 0.058),
            fontWeight: 800,
            color: BRAND.text,
            lineHeight: 1.25,
            letterSpacing: -0.3,
          }}
        >
          {headline}
        </div>
      </div>

      {/* CTA 영역 */}
      <div
        style={{
          marginTop: isHorizontal ? 0 : rel(size, 0.03),
          marginLeft: isHorizontal ? rel(size, 0.04) : 0,
          flexShrink: 0,
          alignSelf: isSquare ? "center" : isHorizontal ? "center" : "flex-start",
          position: "relative",
          zIndex: 1,
        }}
      >
        <CtaButton size={size} text={cta} scale={isSquare ? 1.2 : 1} />
      </div>

      {/* 하단 그라데이션 바 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: rel(size, 0.012),
          background: BRAND.gradient,
        }}
      />
    </div>
  );
}
