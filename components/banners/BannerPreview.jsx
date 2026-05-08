"use client";

import { useState, useRef, useMemo } from "react";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";
import PromptCopyModal from "../shared/PromptCopyModal";
import { BANNER_SIZES } from "./bannerUtils";
import BannerNumber from "./BannerNumber";
import BannerCompare from "./BannerCompare";
import BannerUrgent from "./BannerUrgent";
import BannerTrust from "./BannerTrust";
import BannerQuestion from "./BannerQuestion";
import { KEYWORD_STRATEGY } from "@/data/keywordStrategy";
import { USP_MATRIX, TONE_OPTIONS } from "@/data/uspMatrix";

const C = {
  bg: "#FFFFFF",
  sf: "#F8FAFC",
  sa: "#F1F5F9",
  ac: "#00C9A7",
  bl: "#1D85EB",
  pp: "#A78BFA",
  am: "#F59E0B",
  rd: "#EF4444",
  t: "#0F172A",
  td: "#334155",
  tm: "#64748B",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
};

const TEMPLATES = [
  { key: "number", name: "숫자 임팩트", icon: "💥", color: "#00C9A7", desc: "거대 숫자로 시선 강탈" },
  { key: "compare", name: "비교형", icon: "⚖️", color: "#1D85EB", desc: "Before→After 한눈에" },
  { key: "urgent", name: "긴급형", icon: "🚨", color: "#EF4444", desc: "경고/긴급 메시지" },
  { key: "trust", name: "신뢰형", icon: "⭐", color: "#F59E0B", desc: "소셜프루프 강조" },
  { key: "question", name: "질문형", icon: "❓", color: "#A78BFA", desc: "미니멀 질문" },
];

const TEMPLATE_COMPONENTS = {
  number: BannerNumber,
  compare: BannerCompare,
  urgent: BannerUrgent,
  trust: BannerTrust,
  question: BannerQuestion,
};

export default function BannerPreview() {
  const [template, setTemplate] = useState("number");
  const [sizeIdx, setSizeIdx] = useState(3); // 메타 가로 1200×628
  const [keyword, setKeyword] = useState(KEYWORD_STRATEGY[0].kw);
  const [usps, setUsps] = useState(["💰 부담금 절감"]);
  const [tone, setTone] = useState("info");
  const [copy, setCopy] = useState(null);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  // 디자인 프롬프트 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [designPrompts, setDesignPrompts] = useState(null);
  const [promptLoading, setPromptLoading] = useState(false);

  const size = BANNER_SIZES[sizeIdx];
  const TplComp = TEMPLATE_COMPONENTS[template];

  const toggleUsp = (u) =>
    setUsps((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/banner-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, usps, tone, template, size }),
      });
      const data = await res.json();
      setCopy(data);
      setFallback(!!data.fallback);
    } catch {
      setCopy({ fallback: true });
      setFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const generateDesignPrompts = async () => {
    setModalOpen(true);
    setPromptLoading(true);
    try {
      const res = await fetch("/api/banner-design-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          size,
          headline: copy?.headline || copy?.bigNumber || copy?.question,
          subCopy: copy?.subhead,
          cta: copy?.cta,
          tone,
        }),
      });
      const data = await res.json();
      setDesignPrompts(data);
    } catch {
      setDesignPrompts(null);
    } finally {
      setPromptLoading(false);
    }
  };

  const downloadPNG = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      const fname = `vdream-banner-${template}-${size.w}x${size.h}.png`;
      link.download = fname;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      alert("이미지 다운로드 실패: " + (err.message || "unknown"));
    } finally {
      setDownloading(false);
    }
  };

  const copyHTML = async () => {
    if (!previewRef.current) return;
    const html = previewRef.current.innerHTML;
    try {
      await navigator.clipboard.writeText(html);
      alert("✅ HTML 복사됨");
    } catch {
      window.prompt("복사하세요:", html);
    }
  };

  // 미리보기 스케일 (큰 배너는 축소)
  const maxPreviewW = 720;
  const scale = size.w > maxPreviewW ? maxPreviewW / size.w : 1;

  // 모달 탭
  const modalTabs = useMemo(() => {
    if (!designPrompts) return [];
    return [
      { key: "dalle", label: "🖼 DALL-E", content: designPrompts.dallePrompt, lang: "en" },
      { key: "ductape", label: "📐 Ductape", content: designPrompts.ductapePrompt, lang: "ko" },
      { key: "canva", label: "🎨 Canva 가이드", content: designPrompts.canvaGuide, lang: "ko" },
    ];
  }, [designPrompts]);

  const tplMeta = TEMPLATES.find((t) => t.key === template);

  return (
    <div>
      {/* 1. 템플릿 선택 */}
      <Card style={{ marginBottom: 12, padding: 14 }}>
        <h4 style={subTitle}>🎨 1. 배너 템플릿 (5종)</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 6,
          }}
        >
          {TEMPLATES.map((t) => {
            const active = template === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTemplate(t.key)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 10,
                  border: active ? `2px solid ${t.color}` : `1px solid ${C.border}`,
                  background: active ? `${t.color}0c` : C.bg,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 3 }}>{t.icon}</div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: active ? t.color : C.t,
                    marginBottom: 2,
                  }}
                >
                  {t.name}
                </div>
                <div style={{ fontSize: 9, color: C.tm, lineHeight: 1.3 }}>{t.desc}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. 사이즈 선택 */}
      <Card style={{ marginBottom: 12, padding: 14 }}>
        <h4 style={subTitle}>📐 2. 사이즈 (7종)</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 6,
          }}
        >
          {BANNER_SIZES.map((s, i) => {
            const active = sizeIdx === i;
            return (
              <button
                key={i}
                onClick={() => setSizeIdx(i)}
                style={{
                  padding: "9px 8px",
                  borderRadius: 8,
                  border: active ? `2px solid ${C.ac}` : `1px solid ${C.border}`,
                  background: active ? `${C.ac}0c` : C.bg,
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 9, color: C.tm, fontWeight: 700 }}>
                  {s.name}
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 800,
                    color: active ? C.ac : C.t,
                    marginTop: 2,
                  }}
                >
                  {s.w}×{s.h}
                </div>
                <div style={{ fontSize: 9, color: C.tm, marginTop: 2 }}>
                  {s.layout}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. 카피 입력 */}
      <Card style={{ marginBottom: 12, padding: 14 }}>
        <h4 style={subTitle}>⚙️ 3. 카피 입력</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div>
            <Label>키워드</Label>
            <select
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={inputStyle}
            >
              {KEYWORD_STRATEGY.map((k) => (
                <option key={k.kw} value={k.kw}>
                  {k.kw}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>톤</Label>
            <div style={{ display: "flex", gap: 5 }}>
              {TONE_OPTIONS.map((t) => (
                <Pill
                  key={t.key}
                  active={tone === t.key}
                  onClick={() => setTone(t.key)}
                  color={C.am}
                >
                  {t.label}
                </Pill>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <Label>USP 강조 (복수)</Label>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {USP_MATRIX.usps.map((u) => (
              <Pill
                key={u}
                active={usps.includes(u)}
                onClick={() => toggleUsp(u)}
                color={C.ac}
              >
                {u}
              </Pill>
            ))}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || usps.length === 0}
          style={primaryBtnStyle(loading, usps.length === 0)}
        >
          {loading ? <Spinner color="#FFFFFF" /> : "✨"}{" "}
          {loading
            ? "Claude가 카피 생성 중..."
            : `🤖 ${tplMeta?.name} ${size.w}×${size.h} 카피 생성`}
        </button>
      </Card>

      {/* 4. 프리뷰 */}
      <Card style={{ marginBottom: 12, padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "10px 14px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <h4 style={{ ...subTitle, margin: 0 }}>🖼 4. 배너 프리뷰</h4>
          {fallback && (
            <span style={{ fontSize: 10, color: C.am, fontWeight: 600 }}>
              (샘플 카피 — API 오류)
            </span>
          )}
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 10,
              color: C.tm,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {scale < 1 ? `${(scale * 100).toFixed(0)}% 축소` : "100%"}
          </span>
        </div>

        <div
          style={{
            background:
              "repeating-conic-gradient(#E2E8F0 0% 25%, #F8FAFC 0% 50%) 50% / 16px 16px",
            padding: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: size.h * scale + 40,
          }}
        >
          {!copy ? (
            <div
              style={{
                fontSize: 13,
                color: C.tm,
                textAlign: "center",
                padding: 40,
                background: "rgba(255,255,255,0.85)",
                borderRadius: 10,
              }}
            >
              템플릿+사이즈+카피 입력 → "AI 생성" 후 배너가 표시됩니다.
            </div>
          ) : (
            <div
              style={{
                width: size.w * scale,
                height: size.h * scale,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                ref={previewRef}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              >
                {TplComp && <TplComp size={size} {...copy} />}
              </div>
            </div>
          )}
        </div>

        {copy && (
          <div
            style={{
              padding: "10px 14px",
              borderTop: `1px solid ${C.border}`,
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={downloadPNG}
              disabled={downloading}
              style={primaryBtnStyle(downloading, false, true)}
            >
              {downloading ? <Spinner color="#FFFFFF" /> : "📥"}{" "}
              {downloading ? "PNG 생성 중..." : "PNG 다운로드"}
            </button>
            <button onClick={copyHTML} style={actionBtnStyle(false, C.bl)}>
              📋 HTML 복사
            </button>
            <button onClick={generateDesignPrompts} style={actionBtnStyle(false, C.pp)}>
              🎨 외부 디자인 툴 프롬프트
            </button>
            <button onClick={generate} disabled={loading} style={actionBtnStyle(false, C.tm)}>
              🔄 다시 생성
            </button>
          </div>
        )}
      </Card>

      {/* 5. 인라인 카피 편집 */}
      {copy && (
        <Card style={{ padding: 14 }}>
          <h4 style={subTitle}>✏️ 5. 카피 인라인 편집</h4>
          <p style={{ fontSize: 11, color: C.tm, margin: "0 0 10px" }}>
            아래 필드를 수정하면 즉시 프리뷰에 반영됩니다.
          </p>
          <BannerCopyEditor template={template} copy={copy} setCopy={setCopy} />
        </Card>
      )}

      <PromptCopyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${tplMeta?.name} 배너 ${size.w}×${size.h} — 디자인 툴 프롬프트`}
        loading={promptLoading}
        tabs={modalTabs}
      />
    </div>
  );
}

/* ============================================================
 * Banner Copy Editor
 * ============================================================ */

function BannerCopyEditor({ template, copy, setCopy }) {
  const update = (key, value) => setCopy({ ...copy, [key]: value });
  const updateArr = (key, idx, value) => {
    const next = [...(copy[key] || [])];
    next[idx] = value;
    setCopy({ ...copy, [key]: next });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {template === "number" && (
        <>
          <Field label="Big Number" value={copy.bigNumber} onChange={(v) => update("bigNumber", v)} />
          <Field label="Headline" value={copy.headline} onChange={(v) => update("headline", v)} />
        </>
      )}
      {template === "compare" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 6 }}>
          <Field label="Before" value={copy.before} onChange={(v) => update("before", v)} />
          <Field label="After" value={copy.after} onChange={(v) => update("after", v)} />
          <Field label="Saving" value={copy.saving} onChange={(v) => update("saving", v)} />
        </div>
      )}
      {template === "urgent" && (
        <>
          <Field label="Alert Badge" value={copy.alert} onChange={(v) => update("alert", v)} />
          <Field
            label="Headline (개행 \\n 가능)"
            value={copy.headline}
            onChange={(v) => update("headline", v)}
            long
          />
        </>
      )}
      {template === "trust" && (
        <>
          <Field label="Badge" value={copy.badge} onChange={(v) => update("badge", v)} />
          <Field label="Headline" value={copy.headline} onChange={(v) => update("headline", v)} />
          {Array.isArray(copy.proofs) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {copy.proofs.map((p, i) => (
                <Field
                  key={i}
                  label={`Proof ${i + 1}`}
                  value={p}
                  onChange={(v) => updateArr("proofs", i, v)}
                />
              ))}
            </div>
          )}
        </>
      )}
      {template === "question" && (
        <Field
          label="Question (개행 \\n 가능)"
          value={copy.question}
          onChange={(v) => update("question", v)}
          long
        />
      )}
      <Field label="CTA" value={copy.cta} onChange={(v) => update("cta", v)} />
    </div>
  );
}

/* ============================================================
 * 보조
 * ============================================================ */

function Field({ label, value, onChange, long }) {
  return (
    <div>
      <Label>{label}</Label>
      {long ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          style={{ ...inputStyle, resize: "vertical", minHeight: 50 }}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

function Label({ children }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 10,
        color: C.td,
        fontWeight: 700,
        marginBottom: 4,
        letterSpacing: 0.5,
      }}
    >
      {children}
    </label>
  );
}

const subTitle = {
  margin: "0 0 10px",
  fontSize: 12,
  fontWeight: 800,
  color: C.bl,
  letterSpacing: 0.5,
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 7,
  border: `1px solid ${C.borderStrong}`,
  background: C.sf,
  color: C.t,
  fontSize: 12,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Noto Sans KR', sans-serif",
};

function Pill({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 11px",
        borderRadius: 999,
        border: active ? `1px solid ${color}` : `1px solid ${C.border}`,
        background: active ? `${color}14` : C.bg,
        color: active ? color : C.td,
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function primaryBtnStyle(loading, disabled, secondary) {
  return {
    flex: secondary ? "2 1 auto" : "1 1 100%",
    minWidth: secondary ? 160 : "100%",
    padding: 11,
    borderRadius: 9,
    border: "none",
    background: disabled
      ? "#E2E8F0"
      : "linear-gradient(135deg, #00C9A7, #1D85EB)",
    color: disabled ? "#94A3B8" : "#FFFFFF",
    fontSize: 12,
    fontWeight: 900,
    cursor: loading ? "wait" : disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    boxShadow: disabled ? "none" : "0 4px 14px rgba(0,201,167,0.25)",
  };
}

function actionBtnStyle(active, color) {
  return {
    flex: "1 1 auto",
    minWidth: 130,
    padding: "9px",
    borderRadius: 7,
    border: `1px solid ${active ? color : C.border}`,
    background: active ? `${color}14` : C.bg,
    color: active ? color : C.td,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}
