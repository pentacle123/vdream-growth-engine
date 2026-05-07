export default function Card({ children, className = "", glow = false, style = {} }) {
  return (
    <div
      className={`bg-surface border border-white/5 rounded-[14px] p-[18px] ${className}`}
      style={{
        boxShadow: glow ? "0 0 24px rgba(0,201,167,0.3)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
