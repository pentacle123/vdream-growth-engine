export default function ProgressBar({ value = 0, color = "#36CFBA", height = 5 }) {
  const v = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height,
        borderRadius: height,
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="h-full transition-[width] duration-[600ms] ease-in-out"
        style={{
          width: `${v}%`,
          borderRadius: height,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
        }}
      />
    </div>
  );
}
