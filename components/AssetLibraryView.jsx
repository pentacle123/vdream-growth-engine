"use client";

import Card from "./ui/Card";
import Badge from "./ui/Badge";

const C = {
  bg: "#050a12",
  sf: "#0c1220",
  sa: "#141d2e",
  ac: "#00C9A7",
  bl: "#1D85EB",
  pp: "#A78BFA",
  am: "#F59E0B",
  rd: "#EF4444",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

const CATEGORIES = [
  {
    icon: "📄",
    title: "제안서 라이브러리",
    accent: C.ac,
    desc: "타겟 기업 인텔리전스에서 생성한 1페이지 제안서를 모아보고 재발송 시 즉시 활용.",
    items: [
      { label: "Q백화점 맞춤 제안서", meta: "2.2B 부담금 · 09-30 생성", status: "draft" },
      { label: "T항공 맞춤 제안서", meta: "2.6B 부담금 · 09-28 생성", status: "draft" },
      { label: "O에너지 맞춤 제안서", meta: "1.9B 부담금 · 09-25 생성", status: "draft" },
    ],
    count: "3건 (샘플)",
  },
  {
    icon: "📝",
    title: "숏폼 스크립트 라이브러리",
    accent: C.bl,
    desc: "기회 발견에서 AI가 생성한 hook·problem·solution·CTA 스크립트를 채널·기회별로 정리.",
    items: [
      { label: "B-1 1월 신고 공포 — 솔루션형 45초", meta: "릴스 · 30대 여성", status: "draft" },
      { label: "A-1 부담금보다 싸다 — 충격형 30초", meta: "쇼츠 · HR 담당자", status: "draft" },
      { label: "B-3 명단 공표 리스크 — 위기형 30초", meta: "링크드인 · CEO", status: "draft" },
    ],
    count: "3건 (샘플)",
  },
  {
    icon: "📧",
    title: "아웃바운드 메시지 템플릿",
    accent: C.pp,
    desc: "이메일·링크드인·카톡 채널별 톤(formal/casual/urgent) 변형을 저장하고 재사용.",
    items: [
      { label: "이메일 — Formal", meta: "Q백화점", status: "ready" },
      { label: "링크드인 DM — Casual", meta: "T항공", status: "ready" },
      { label: "카카오톡 — Urgent", meta: "O에너지", status: "ready" },
    ],
    count: "3건 (샘플)",
  },
  {
    icon: "🎨",
    title: "배너·랜딩 크리에이티브",
    accent: C.am,
    desc: "DA 퍼포먼스 랩에서 생성된 LP 카피·배너 세트를 사이즈별·캠페인별로 보관.",
    items: [],
    count: "DA 퍼포먼스 랩 출시 후 활성화",
    locked: true,
  },
  {
    icon: "📊",
    title: "진단 리포트 아카이브",
    accent: C.rd,
    desc: "AI 진단기에서 생성한 경영진 보고용 리포트와 ROI 시뮬레이션 결과 저장.",
    items: [
      { label: "샘플 — 제조 500명 케이스", meta: "부담금 3.88억 · 절감 0", status: "ready" },
      { label: "샘플 — IT 850명 케이스", meta: "부담금 5.2억 · 절감 2억", status: "ready" },
    ],
    count: "2건 (샘플)",
  },
];

export default function AssetLibraryView() {
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.t }}>
          📚 자산 라이브러리
        </h2>
        <p style={{ fontSize: 12, color: C.td, margin: "6px 0 0", lineHeight: 1.6 }}>
          AI가 생성한 모든 자산(제안서·스크립트·메시지·크리에이티브·리포트)을 한 곳에서 관리.
          <span style={{ color: C.am, marginLeft: 4 }}>※ 현재 메모리 보관, Supabase 연동 예정</span>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={i} cat={cat} />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ cat }) {
  return (
    <Card
      style={{
        padding: 16,
        borderColor: `${cat.accent}33`,
        opacity: cat.locked ? 0.7 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: `${cat.accent}14`,
            border: `1px solid ${cat.accent}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {cat.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 3,
              flexWrap: "wrap",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 800,
                color: C.t,
              }}
            >
              {cat.title}
            </h3>
            <Badge color={cat.locked ? C.tm : cat.accent}>
              {cat.locked ? "🔒 Locked" : cat.count}
            </Badge>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: C.td,
              lineHeight: 1.6,
            }}
          >
            {cat.desc}
          </p>
        </div>
      </div>

      {cat.items.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {cat.items.map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 11px",
                borderRadius: 8,
                background: C.sa,
                border: `1px solid rgba(255,255,255,0.03)`,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.t,
                    lineHeight: 1.3,
                  }}
                >
                  {it.label}
                </div>
                <div style={{ fontSize: 10, color: C.tm, marginTop: 2 }}>
                  {it.meta}
                </div>
              </div>
              <Badge color={it.status === "ready" ? C.ac : C.am}>
                {it.status === "ready" ? "● Ready" : "○ Draft"}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {cat.locked && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: C.sa,
            fontSize: 11,
            color: C.tm,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          DA 퍼포먼스 랩의 랜딩·배너 자동 생성 모듈 출시 후 자동으로 채워집니다.
        </div>
      )}
    </Card>
  );
}
