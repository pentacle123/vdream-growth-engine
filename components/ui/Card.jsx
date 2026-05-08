export default function Card({ children, className = "", glow = false, style = {} }) {
  return (
    <div
      className={`rounded-[14px] p-[18px] ${className}`}
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: glow
          ? "0 0 24px rgba(0,201,167,0.25), 0 1px 3px rgba(0,0,0,0.06)"
          : "0 1px 3px rgba(0,0,0,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
