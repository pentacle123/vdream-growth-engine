export default function Spinner({ color = "#36CFBA", size = 16 }) {
  return (
    <span
      className="inline-block"
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}33`,
        borderTop: `2px solid ${color}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
