// 배너 사이즈 정의 + 공용 유틸 — CREATIVE-ENGINE-SPEC Part 3

export const BANNER_SIZES = [
  { name: "네이버 DA", w: 320, h: 100, layout: "horizontal" },
  { name: "네이버 DA", w: 300, h: 250, layout: "vertical" },
  { name: "메타 피드", w: 1080, h: 1080, layout: "square" },
  { name: "메타 가로", w: 1200, h: 628, layout: "horizontal" },
  { name: "링크드인", w: 1200, h: 627, layout: "horizontal" },
  { name: "유튜브", w: 1280, h: 720, layout: "horizontal" },
  { name: "인스타 스토리", w: 1080, h: 1920, layout: "vertical" },
];

/**
 * 배너의 짧은 변(min(w, h)) 기준 상대 폰트 사이즈 계산.
 * 더 큰 배너일수록 폰트도 비례적으로 커진다.
 */
export function rel(size, ratio) {
  return Math.round(Math.min(size.w, size.h) * ratio);
}

export const BRAND = {
  primary: "#00C9A7",
  secondary: "#1D85EB",
  red: "#EF4444",
  amber: "#F59E0B",
  text: "#0F172A",
  body: "#334155",
  mute: "#64748B",
  bg: "#FFFFFF",
  surface: "#F8FAFC",
  surface2: "#F1F5F9",
  gradient: "linear-gradient(135deg, #00C9A7 0%, #1D85EB 100%)",
};

/**
 * 공용 V Dream 로고 — 사이즈에 비례
 */
export function VLogo({ size, color = BRAND.text }) {
  const fs = rel(size, 0.06);
  return (
    <div
      style={{
        fontSize: fs,
        fontWeight: 900,
        letterSpacing: 1,
        color,
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}
    >
      <span style={{ color: BRAND.primary }}>V</span>Dream
    </div>
  );
}

/**
 * 공용 CTA 버튼 (그라데이션)
 */
export function CtaButton({ size, text, scale = 1 }) {
  const fs = rel(size, 0.045) * scale;
  const px = rel(size, 0.04) * scale;
  const py = rel(size, 0.022) * scale;
  return (
    <div
      style={{
        display: "inline-block",
        background: BRAND.gradient,
        color: "#FFFFFF",
        fontWeight: 900,
        padding: `${py}px ${px}px`,
        borderRadius: rel(size, 0.025),
        fontSize: fs,
        boxShadow: `0 ${rel(size, 0.012)}px ${rel(size, 0.025)}px rgba(0,201,167,0.30)`,
        whiteSpace: "nowrap",
        lineHeight: 1.1,
      }}
    >
      {text} →
    </div>
  );
}
