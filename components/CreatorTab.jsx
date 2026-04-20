"use client";

import Card from "./ui/Card";
import Badge from "./ui/Badge";
import ProgressBar from "./ui/ProgressBar";
import { CREATORS } from "@/data/creators";

const C = {
  sa: "#141d2e",
  sh: "#1a2540",
  ac: "#36CFBA",
  bl: "#1D85EB",
  wn: "#F59E0B",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
};

function fitColor(fit) {
  if (fit >= 90) return C.ac;
  if (fit >= 80) return C.bl;
  return C.wn;
}

export default function CreatorTab() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 19, fontWeight: 800, color: C.t, margin: 0 }}>
          🤝 크리에이터 매칭
        </h2>
        <p style={{ fontSize: 12, color: C.td, margin: "5px 0 0" }}>
          타겟별 최적 크리에이터와 콜라보 방식 (적합도 순)
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CREATORS.map((cr, i) => {
          const color = fitColor(cr.fit);
          return (
            <Card key={i}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: C.sa,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 19,
                      flexShrink: 0,
                    }}
                  >
                    {cr.emoji}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.t }}>
                      {cr.category}
                    </h3>
                    <div style={{ fontSize: 11, color: C.tm, marginTop: 1 }}>
                      {cr.format} | {cr.platforms.join(", ")}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: C.tm }}>적합도</div>
                  <div
                    style={{
                      fontSize: 19,
                      fontWeight: 900,
                      color,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {cr.fit}%
                  </div>
                </div>
              </div>

              <ProgressBar value={cr.fit} color={color} />

              <p
                style={{
                  margin: "7px 0 5px",
                  fontSize: 12,
                  color: C.td,
                  lineHeight: 1.5,
                }}
              >
                {cr.why}
              </p>

              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {cr.examples.map((ex, j) => (
                  <Badge key={j} color={C.tm} background={C.sh}>
                    {ex}
                  </Badge>
                ))}
              </div>

              <div
                style={{
                  marginTop: 7,
                  padding: "5px 8px",
                  borderRadius: 6,
                  background: `${C.ac}08`,
                  border: `1px solid ${C.ac}12`,
                  fontSize: 11,
                  color: C.ac,
                }}
              >
                💡 콜라보 CTA → 영상 설명/핀댓글에 "진단기" 링크 삽입으로 리드 전환
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
