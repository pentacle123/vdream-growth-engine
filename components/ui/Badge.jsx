export default function Badge({ children, color = "#36CFBA", background }) {
  return (
    <span
      className="inline-block font-bold text-[11px]"
      style={{
        padding: "3px 9px",
        borderRadius: 6,
        color,
        background: background || `${color}1a`,
        border: `1px solid ${color}28`,
      }}
    >
      {children}
    </span>
  );
}
