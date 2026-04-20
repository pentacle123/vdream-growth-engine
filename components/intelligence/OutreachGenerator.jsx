"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Spinner from "../ui/Spinner";
import { computeROI } from "@/data/targetCompanies";
import { formatWon } from "@/lib/calculate";

const C = {
  sa: "#141d2e",
  sh: "#1a2540",
  ac: "#36CFBA",
  bl: "#1D85EB",
  wn: "#F59E0B",
  rd: "#EF4444",
  pp: "#A78BFA",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

const CHANNELS = [
  { key: "email", label: "이메일", icon: "📧", brand: "#1D85EB" },
  { key: "linkedin", label: "링크드인", icon: "💼", brand: "#0A66C2" },
  { key: "kakao", label: "카카오톡", icon: "💬", brand: "#FEE500" },
];

const TONES = [
  { key: "formal", label: "포멀", color: "#1D85EB" },
  { key: "casual", label: "캐주얼", color: "#36CFBA" },
  { key: "urgent", label: "긴급", color: "#EF4444" },
];

export default function OutreachGenerator({
  company,
  outreach,
  onOutreachGenerated,
  companies,
  onSelectCompany,
}) {
  const [channel, setChannel] = useState("email");
  const [tone, setTone] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [copied, setCopied] = useState(null);

  if (!company) {
    return <CompanyPickerSimple companies={companies} onSelect={onSelectCompany} />;
  }

  const roi = computeROI(company);
  const current = outreach?.[channel]?.[tone];
  const compareSet = outreach?.[channel]?.__compare;

  const fetchOne = async (ch, tn) => {
    const res = await fetch("/api/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company,
        channel: ch,
        tone: tn,
        saving: roi.annualSaving,
      }),
    });
    return res.json();
  };

  const generate = async () => {
    setLoading(true);
    setCompareMode(false);
    try {
      const data = await fetchOne(channel, tone);
      onOutreachGenerated(company.id, channel, tone, data);
    } catch {
      onOutreachGenerated(company.id, channel, tone, {
        body: "네트워크 오류로 메시지를 불러오지 못했습니다.",
        fallback: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateThreeWay = async () => {
    setLoading(true);
    setCompareMode(true);
    try {
      const results = await Promise.all(
        TONES.map((t) => fetchOne(channel, t.key))
      );
      const compare = {};
      TONES.forEach((t, i) => (compare[t.key] = results[i]));
      onOutreachGenerated(company.id, channel, "__compare", compare);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const copyCurrent = async (data, key) => {
    if (!data) return;
    const txt = buildPlainText(channel, data);
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("복사하세요:", txt);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CompanyMini company={company} roi={roi} companies={companies} onSelectCompany={onSelectCompany} />

      {/* 채널 탭 */}
      <div style={{ display: "flex", gap: 6 }}>
        {CHANNELS.map((ch) => {
          const active = channel === ch.key;
          return (
            <button
              key={ch.key}
              onClick={() => {
                setChannel(ch.key);
                setCompareMode(false);
              }}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 10,
                border: active ? `2px solid ${ch.brand}` : `1px solid ${C.bl2}`,
                background: active ? `${ch.brand}14` : "#0f1623",
                color: active ? ch.brand : C.td,
                fontSize: 13,
                fontWeight: active ? 800 : 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <span style={{ fontSize: 16 }}>{ch.icon}</span>
              {ch.label}
            </button>
          );
        })}
      </div>

      {/* 톤 + 생성 */}
      <Card style={{ padding: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 11, color: C.tm, fontWeight: 700, letterSpacing: 1 }}>
            톤
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {TONES.map((tn) => {
              const active = tone === tn.key && !compareMode;
              return (
                <button
                  key={tn.key}
                  onClick={() => {
                    setTone(tn.key);
                    setCompareMode(false);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    border: active ? `1px solid ${tn.color}` : `1px solid ${C.bl2}`,
                    background: active ? `${tn.color}22` : "transparent",
                    color: active ? tn.color : C.td,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {tn.label}
                </button>
              );
            })}
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={generate}
            disabled={loading}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: "none",
              background: `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
              color: "#000",
              fontSize: 12,
              fontWeight: 800,
              cursor: loading ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {loading && !compareMode ? <Spinner color="#000" /> : "✨"}{" "}
            {loading && !compareMode ? "생성 중..." : `${TONES.find((t) => t.key === tone).label} 생성`}
          </button>
          <button
            onClick={generateThreeWay}
            disabled={loading}
            style={{
              padding: "9px 14px",
              borderRadius: 8,
              border: `1px solid ${C.pp}55`,
              background: `${C.pp}14`,
              color: C.pp,
              fontSize: 12,
              fontWeight: 800,
              cursor: loading ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {loading && compareMode ? <Spinner color={C.pp} /> : "🧪"}{" "}
            3종 비교 생성
          </button>
        </div>
      </Card>

      {/* 메시지 프리뷰 */}
      {!compareMode && current && (
        <MessagePreview
          channel={channel}
          data={current}
          company={company}
          onCopy={() => copyCurrent(current, `${channel}-${tone}`)}
          copied={copied === `${channel}-${tone}`}
          onRegenerate={generate}
          toneLabel={TONES.find((t) => t.key === tone).label}
          toneColor={TONES.find((t) => t.key === tone).color}
          loading={loading}
        />
      )}

      {compareMode && compareSet && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 11, color: C.tm, fontWeight: 700, letterSpacing: 1 }}>
            🧪 3종 톤 비교
          </div>
          {TONES.map((tn) => {
            const data = compareSet[tn.key];
            if (!data) return null;
            return (
              <MessagePreview
                key={tn.key}
                channel={channel}
                data={data}
                company={company}
                onCopy={() => copyCurrent(data, `${channel}-cmp-${tn.key}`)}
                copied={copied === `${channel}-cmp-${tn.key}`}
                toneLabel={tn.label}
                toneColor={tn.color}
                compact
              />
            );
          })}
        </div>
      )}

      {!current && !compareMode && (
        <Card
          style={{
            padding: 28,
            textAlign: "center",
            border: `1px dashed ${C.bl2}`,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 6 }}>💌</div>
          <div style={{ fontSize: 13, color: C.td }}>
            채널·톤 선택 후 "생성" 버튼을 눌러 Claude가 메시지를 작성하게 하세요.
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
 * 채널별 프리뷰
 * ============================================================ */

function MessagePreview({
  channel,
  data,
  company,
  onCopy,
  copied,
  onRegenerate,
  toneLabel,
  toneColor,
  loading,
  compact,
}) {
  return (
    <Card
      style={{
        padding: 0,
        overflow: "hidden",
        border: `1px solid ${toneColor}44`,
      }}
    >
      <div
        style={{
          padding: "8px 14px",
          background: `${toneColor}12`,
          borderBottom: `1px solid ${toneColor}22`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Badge color={toneColor}>{toneLabel}</Badge>
          {data.fallback && (
            <span style={{ fontSize: 10, color: C.tm }}>(샘플 — API 오류)</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={onCopy}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border: `1px solid ${copied ? C.ac : C.bl2}`,
              background: copied ? `${C.ac}14` : "transparent",
              color: copied ? C.ac : C.td,
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {copied ? "✅ 복사됨" : "📋 복사"}
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={loading}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                border: `1px solid ${C.bl2}`,
                background: "transparent",
                color: C.td,
                fontSize: 10,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              🔄 다시
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: compact ? 12 : 14 }}>
        {channel === "email" && <EmailPreview data={data} company={company} />}
        {channel === "linkedin" && <LinkedInPreview data={data} company={company} />}
        {channel === "kakao" && <KakaoPreview data={data} company={company} />}
      </div>
    </Card>
  );
}

function EmailPreview({ data, company }) {
  return (
    <div
      style={{
        background: "#ffffff",
        color: "#1f2937",
        borderRadius: 10,
        padding: 16,
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      {/* 이메일 헤더 */}
      <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 10, marginBottom: 12 }}>
        <Row label="From" value="세일즈팀 <sales@vdream.co.kr>" />
        <Row label="To" value={`${company.name} 채용담당자`} />
        {data.subject && (
          <Row
            label="Subject"
            value={data.subject}
            strong
          />
        )}
      </div>
      {data.greeting && <p style={pEmail}>{data.greeting}</p>}
      {data.hook && <p style={{ ...pEmail, fontWeight: 600 }}>{data.hook}</p>}
      {data.body && <p style={pEmail}>{data.body}</p>}
      {data.cta && (
        <p style={{ ...pEmail, fontWeight: 700, color: "#0369a1" }}>
          {data.cta}
        </p>
      )}
      {data.closing && (
        <p style={{ ...pEmail, whiteSpace: "pre-wrap" }}>{data.closing}</p>
      )}
      {data.ps && (
        <p style={{ ...pEmail, color: "#6b7280", fontSize: 12, fontStyle: "italic" }}>
          {data.ps}
        </p>
      )}
    </div>
  );
}

function LinkedInPreview({ data, company }) {
  return (
    <div
      style={{
        background: "#f3f2ef",
        borderRadius: 10,
        padding: 14,
        fontFamily: "'Noto Sans KR', sans-serif",
        color: "#000",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          paddingBottom: 10,
          borderBottom: "1px solid #e5e7eb",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #36CFBA, #1D85EB)",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          VD
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>VDream Sales</div>
          <div style={{ fontSize: 11, color: "#666" }}>
            B2B Growth @ VDream · {company.name} 담당자님께
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: "2px 8px",
            borderRadius: 4,
            background: "#0A66C2",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          in
        </div>
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.7 }}>
        {data.greeting && <div>{data.greeting}</div>}
        {data.hook && (
          <div style={{ marginTop: 6, fontWeight: 600 }}>{data.hook}</div>
        )}
        {data.body && <div style={{ marginTop: 6 }}>{data.body}</div>}
        {data.cta && (
          <div style={{ marginTop: 8, fontWeight: 700, color: "#0A66C2" }}>
            {data.cta}
          </div>
        )}
        {data.closing && (
          <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{data.closing}</div>
        )}
        {data.ps && (
          <div style={{ marginTop: 6, fontStyle: "italic", color: "#666", fontSize: 12 }}>
            {data.ps}
          </div>
        )}
      </div>
    </div>
  );
}

function KakaoPreview({ data, company }) {
  return (
    <div
      style={{
        background: "#b2c7d9",
        padding: 12,
        borderRadius: 10,
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#555",
          textAlign: "center",
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        #{company.name} HR · 브이드림 비즈메시지
      </div>

      {/* 상대방 메시지 (좌측) */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #36CFBA, #1D85EB)",
            color: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          VD
        </div>
        <div style={{ maxWidth: "82%" }}>
          <div style={{ fontSize: 10, color: "#444", marginBottom: 3 }}>VDream</div>
          <Bubble>
            {data.greeting && <div>{data.greeting}</div>}
            {data.hook && (
              <div style={{ marginTop: 4, fontWeight: 700 }}>{data.hook}</div>
            )}
          </Bubble>
          <Bubble>{data.body}</Bubble>
          {data.cta && (
            <Bubble highlight>
              {data.cta}
            </Bubble>
          )}
          {data.closing && <Bubble subtle>{data.closing}</Bubble>}
          {data.ps && <Bubble subtle italic>{data.ps}</Bubble>}
        </div>
      </div>
    </div>
  );
}

function Bubble({ children, highlight, subtle, italic }) {
  return (
    <div
      style={{
        background: highlight ? "#FFD600" : subtle ? "#f5f5f5" : "#ffffff",
        color: highlight ? "#222" : "#333",
        padding: "8px 10px",
        borderRadius: 10,
        fontSize: 12,
        lineHeight: 1.55,
        marginBottom: 4,
        fontWeight: highlight ? 700 : 400,
        fontStyle: italic ? "italic" : "normal",
        whiteSpace: "pre-wrap",
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
 * 보조
 * ============================================================ */

function Row({ label, value, strong }) {
  return (
    <div style={{ display: "flex", gap: 10, fontSize: 12, lineHeight: 1.8 }}>
      <div
        style={{
          width: 60,
          color: "#6b7280",
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#111",
          fontWeight: strong ? 800 : 500,
          fontSize: strong ? 13 : 12,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const pEmail = {
  fontSize: 13,
  color: "#1f2937",
  lineHeight: 1.75,
  margin: "0 0 10px",
};

function CompanyMini({ company, roi, companies, onSelectCompany }) {
  return (
    <Card style={{ padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.t }}>
            {company.name}{" "}
            <span style={{ fontSize: 11, color: C.tm, fontWeight: 500, marginLeft: 6 }}>
              ({company.industry}, {company.region})
            </span>
          </div>
          <div style={{ fontSize: 11, color: C.td, marginTop: 2 }}>
            부족{" "}
            <span style={{ color: C.wn, fontWeight: 700 }}>{company.deficit}명</span> · 부담금{" "}
            <span style={{ color: C.rd, fontWeight: 700 }}>
              {formatWon(company.estimatedPenalty)}
            </span>{" "}
            · 도입 시 절감{" "}
            <span style={{ color: C.ac, fontWeight: 700 }}>
              {formatWon(roi.annualSaving)}
            </span>
          </div>
        </div>
        <select
          value={company.id}
          onChange={(e) => onSelectCompany(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: `1px solid ${C.bl2}`,
            background: C.sa,
            color: C.t,
            fontSize: 11,
            outline: "none",
          }}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
}

function CompanyPickerSimple({ companies, onSelect }) {
  return (
    <Card style={{ padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 6 }}>📧</div>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: C.t }}>
        기업을 먼저 선택하세요
      </h3>
      <p style={{ fontSize: 12, color: C.td, margin: "6px 0 12px" }}>
        아웃바운드 메시지를 위해 타겟 기업이 필요합니다.
      </p>
      <select
        onChange={(e) => onSelect(Number(e.target.value))}
        defaultValue=""
        style={{
          padding: "9px 12px",
          borderRadius: 8,
          border: `1px solid ${C.bl2}`,
          background: C.sa,
          color: C.t,
          fontSize: 12,
          outline: "none",
          minWidth: 280,
        }}
      >
        <option value="" disabled>
          — 기업 선택 —
        </option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.industry})
          </option>
        ))}
      </select>
    </Card>
  );
}

function buildPlainText(channel, data) {
  const lines = [];
  if (channel === "email" && data.subject) lines.push(`제목: ${data.subject}`, "");
  if (data.greeting) lines.push(data.greeting, "");
  if (data.hook) lines.push(data.hook, "");
  if (data.body) lines.push(data.body, "");
  if (data.cta) lines.push(data.cta, "");
  if (data.closing) lines.push(data.closing);
  if (data.ps) lines.push("", data.ps);
  return lines.join("\n");
}
