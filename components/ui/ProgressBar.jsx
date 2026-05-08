export default function ProgressBar({ value = 0, color = "#00C9A7", height = 5 }) {
  const v = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        height,
        borderRadius: height,
        background: "#F1F5F9",
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
