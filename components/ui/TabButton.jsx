export default function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-[5px] whitespace-nowrap cursor-pointer font-sans transition-colors"
      style={{
        padding: "7px 13px",
        borderRadius: 8,
        border: active ? "1px solid rgba(0,201,167,0.27)" : "1px solid transparent",
        background: active ? "rgba(0,201,167,0.12)" : "transparent",
        color: active ? "#00C9A7" : "#334155",
        fontSize: 12,
        fontWeight: active ? 700 : 500,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  );
}
