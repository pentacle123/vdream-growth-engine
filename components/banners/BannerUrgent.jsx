"use client";

import { BRAND, rel, VLogo, CtaButton } from "./bannerUtils";

/**
 * 배너 3: "긴급형"
 * 빨간 경고 + 긴급 메시지 + CTA + 빨간 하단 바
 *
 * Props:
 *   size, alert("⚠️ 고용부담금 인상 임박"), headline("지금 대비하지 않으면 내년 부담금이 2배"), cta
 */
export default function BannerUrgent({
  size,
  alert = "⚠️ 고용부담금 인상 임박",
  headline = "지금 대비하지 않으면\n내년 부담금이 2배",
  cta = "무료 진단",
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
        alignItems: isHorizontal ? "center" : "flex-start",
        justifyContent: "space-between",
        padding: rel(size, isCompact ? 0.04 : 0.05),
      }}
    >
      {/* 좌측 상단 빨간 바 (긴급 표시) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: rel(size, 0.012),
          height: "100%",
          background: BRAND.red,
        }}
      />

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
          marginLeft: rel(size, 0.025),
          marginTop: isCompact ? 0 : rel(size, 0.04),
        }}
      >
        {/* 경고 뱃지 */}
        <div
          style={{
            display: "inline-block",
            padding: `${rel(size, 0.012)}px ${rel(size, 0.025)}px`,
            borderRadius: rel(size, 0.025),
            background: "rgba(239,68,68,0.10)",
            border: `1px solid ${BRAND.red}`,
            color: BRAND.red,
            fontWeight: 800,
            fontSize: rel(size, isCompact ? 0.06 : 0.045),
            letterSpacing: -0.2,
            lineHeight: 1.2,
          }}
        >
          {alert}
        </div>

        {/* 메인 헤드라인 */}
        <div
          style={{
            fontSize: rel(size, isCompact ? 0.09 : isSquare ? 0.085 : 0.075),
            fontWeight: 900,
            color: BRAND.text,
            lineHeight: 1.25,
            letterSpacing: -0.5,
            whiteSpace: "pre-line",
          }}
        >
          {headline}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: isHorizontal ? 0 : rel(size, 0.03),
          marginLeft: isHorizontal ? rel(size, 0.04) : rel(size, 0.025),
          flexShrink: 0,
          alignSelf: isSquare ? "center" : isHorizontal ? "center" : "flex-start",
        }}
      >
        <CtaButton size={size} text={cta} scale={isSquare ? 1.2 : 1} />
      </div>

      {/* 빨간 하단 바 */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: rel(size, 0.012),
          background: BRAND.red,
        }}
      />
    </div>
  );
}
