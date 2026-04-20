export default function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-[5px] whitespace-nowrap cursor-pointer font-sans transition-colors"
      style={{
        padding: "7px 13px",
        borderRadius: 8,
        border: active ? "1px solid rgba(54,207,186,0.27)" : "1px solid transparent",
        background: active ? "rgba(54,207,186,0.12)" : "transparent",
        color: active ? "#36CFBA" : "#94A3B8",
        fontSize: 12,
        fontWeight: active ? 700 : 500,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  );
}
