"use client";

import { BRAND, rel, VLogo, CtaButton } from "./bannerUtils";

/**
 * 배너 5: "질문형"
 * 큰 질문 헤드라인 + 짧은 CTA. 심플 미니멀.
 *
 * Props:
 *   size, question("장애인 채용,\n아직도 어렵다고\n생각하시나요?"), cta("2주면 끝")
 */
export default function BannerQuestion({
  size,
  question = "장애인 채용,\n아직도 어렵다고\n생각하시나요?",
  cta = "2주면 끝",
}) {
  const isHorizontal = size.layout === "horizontal";
  const isSquare = size.layout === "square";
  const isCompact = size.w * size.h < 50000;

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
        alignItems: isSquare ? "center" : isHorizontal ? "center" : "flex-start",
        justifyContent: "space-between",
        padding: rel(size, isCompact ? 0.05 : 0.07),
      }}
    >
      {/* 미묘한 도트 그리드 배경 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${BRAND.surface2} 1px, transparent 1px)`,
          backgroundSize: `${rel(size, 0.04)}px ${rel(size, 0.04)}px`,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "absolute", top: rel(size, 0.04), right: rel(size, 0.04) }}>
        <VLogo size={size} />
      </div>

      {/* 큰 따옴표 장식 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: rel(size, 0.04),
          left: rel(size, 0.04),
          fontSize: rel(size, 0.25),
          color: BRAND.primary,
          opacity: 0.15,
          fontWeight: 900,
          lineHeight: 0.8,
          fontFamily: "Georgia, serif",
        }}
      >
        "
      </div>

      {/* 질문 영역 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isSquare ? "center" : "flex-start",
          textAlign: isSquare ? "center" : "left",
          minWidth: 0,
          position: "relative",
          zIndex: 1,
          marginTop: isCompact ? 0 : rel(size, 0.04),
        }}
      >
        <div
          style={{
            fontSize: rel(size, isCompact ? 0.1 : isSquare ? 0.1 : 0.082),
            fontWeight: 900,
            color: BRAND.text,
            lineHeight: 1.3,
            letterSpacing: -0.5,
            whiteSpace: "pre-line",
          }}
        >
          {question}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: isHorizontal ? 0 : rel(size, 0.03),
          marginLeft: isHorizontal ? rel(size, 0.04) : 0,
          flexShrink: 0,
          alignSelf: isSquare ? "center" : isHorizontal ? "center" : "flex-end",
          position: "relative",
          zIndex: 1,
        }}
      >
        <CtaButton size={size} text={cta} scale={isSquare ? 1.2 : 1} />
      </div>
    </div>
  );
}
