"use client";

import { useState, useRef, useMemo } from "react";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";
import PromptCopyModal from "../shared/PromptCopyModal";
import LandingNumberShock from "./LandingNumberShock";
import LandingStory from "./LandingStory";
import LandingDiagnostic from "./LandingDiagnostic";
import { KEYWORD_STRATEGY } from "@/data/keywordStrategy";
import { USP_MATRIX, TONE_OPTIONS, TARGET_OPTIONS } from "@/data/uspMatrix";

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
  {
    key: "numberShock",
    name: "숫자 충격형",
    desc: "거대 숫자로 즉시 임팩트",
    bestFor: "부담금 검색자",
    accent: "#00C9A7",
    icon: "💥",
  },
  {
    key: "story",
    name: "스토리텔링형",
    desc: "고객 여정 4단계 스토리",
    bestFor: "리드 육성·후기 강조",
    accent: "#1D85EB",
    icon: "📖",
  },
  {
    key: "diagnostic",
    name: "진단기 임베드형",
    desc: "히어로에 미니 진단기 위젯",
    bestFor: "즉시 전환 유도",
    accent: "#A78BFA",
    icon: "🧮",
  },
];

export default function LandingPreview() {
  const [template, setTemplate] = useState("numberShock");
  const [keyword, setKeyword] = useState(KEYWORD_STRATEGY[0].kw);
  const [target, setTarget] = useState("hr");
  const [usps, setUsps] = useState(["💰 부담금 절감", "🏠 재택근무"]);
  const [tone, setTone] = useState("info");
  const [copy, setCopy] = useState(null);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState("desktop");
  const [copied, setCopied] = useState(null);
  const previewRef = useRef(null);

  // 디자인 프롬프트 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [designPrompts, setDesignPrompts] = useState(null);
  const [promptLoading, setPromptLoading] = useState(false);

  const toggleUsp = (u) =>
    setUsps((prev) => (prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]));

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/landing-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, target, usps, tone, template }),
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
      const res = await fetch("/api/design-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, copy, keyword, target, tone }),
      });
      const data = await res.json();
      setDesignPrompts(data);
    } catch {
      setDesignPrompts(null);
    } finally {
      setPromptLoading(false);
    }
  };

  const copyAction = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("복사하세요:", text);
    }
  };

  const copyHTML = () => {
    if (!previewRef.current) return;
    const html = previewRef.current.innerHTML;
    copyAction(`<!doctype html><html lang="ko"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>VDream Landing</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800;900&display=swap" rel="stylesheet"/></head><body style="margin:0;font-family:'Noto Sans KR',sans-serif;">${html}</body></html>`, "html");
  };

  const copyReact = () => {
    if (!copy) return;
    const compName =
      template === "numberShock"
        ? "LandingNumberShock"
        : template === "story"
        ? "LandingStory"
        : "LandingDiagnostic";
    const propsStr = JSON.stringify(copy, null, 2);
    const code = `import ${compName} from "@/components/templates/${compName}";

export default function GeneratedLanding() {
  const props = ${propsStr};
  return <${compName} {...props} />;
}`;
    copyAction(code, "react");
  };

  const tplMeta = TEMPLATES.find((t) => t.key === template);

  // 모달 탭 구성
  const modalTabs = useMemo(() => {
    if (!designPrompts) return [];
    return [
      {
        key: "dalleHero",
        label: "🖼 DALL-E 히어로",
        content: designPrompts.dalleHeroImage,
        lang: "en",
      },
      {
        key: "dalleStyle",
        label: "🎨 DALL-E 스타일",
        content: designPrompts.dalleStyleGuide,
        lang: "en",
      },
      {
        key: "ductape",
        label: "📐 Ductape 랜딩",
        content: designPrompts.ductapeLandingPrompt,
        lang: "ko",
      },
      {
        key: "figma",
        label: "✏️ Figma 브리프",
        content: designPrompts.figmaDescription,
        lang: "ko",
      },
    ];
  }, [designPrompts]);

  return (
    <div>
      {/* 1. 템플릿 선택 */}
      <Card style={{ marginBottom: 12, padding: 14 }}>
        <h4 style={subTitle}>🎨 1. 템플릿 선택</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 8,
          }}
        >
          {TEMPLATES.map((t) => {
            const active = template === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTemplate(t.key)}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: active ? `2px solid ${t.accent}` : `1px solid ${C.border}`,
                  background: active ? `${t.accent}0c` : C.bg,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: active ? t.accent : C.t,
                    }}
                  >
                    {t.name}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: C.td, lineHeight: 1.4 }}>
                  {t.desc}
                </div>
                <div style={{ fontSize: 10, color: C.tm }}>
                  적합: {t.bestFor}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. 입력 폼 */}
      <Card style={{ marginBottom: 12, padding: 14 }}>
        <h4 style={subTitle}>⚙️ 2. 카피 입력</h4>
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

        <div style={{ marginBottom: 10 }}>
          <Label>타겟</Label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TARGET_OPTIONS.map((t) => (
              <Pill
                key={t.key}
                active={target === t.key}
                onClick={() => setTarget(t.key)}
                color={C.bl}
              >
                {t.emoji} {t.label}
              </Pill>
            ))}
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
            : `🤖 ${tplMeta?.name} 카피 AI 생성`}
        </button>
      </Card>

      {/* 3. 라이브 프리뷰 */}
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
          <h4 style={{ ...subTitle, margin: 0 }}>🖥️ 3. 라이브 프리뷰</h4>
          {fallback && (
            <span style={{ fontSize: 10, color: C.am, fontWeight: 600 }}>
              (샘플 카피 — API 오류)
            </span>
          )}
          <div style={{ flex: 1 }} />
          <DeviceToggle device={device} setDevice={setDevice} />
        </div>

        <div
          style={{
            background: C.sa,
            padding: 14,
            display: "flex",
            justifyContent: "center",
            minHeight: 500,
          }}
        >
          {!copy ? (
            <div
              style={{
                fontSize: 13,
                color: C.tm,
                alignSelf: "center",
                textAlign: "center",
                padding: 60,
              }}
            >
              템플릿 선택 + 카피 입력 → "AI 생성" 후 프리뷰가 표시됩니다.
            </div>
          ) : (
            <div
              ref={previewRef}
              style={{
                width: device === "mobile" ? 380 : "100%",
                maxWidth: device === "mobile" ? 380 : "100%",
                background: "#FFF",
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid ${C.border}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                transition: "width 0.3s",
              }}
            >
              {template === "numberShock" && <LandingNumberShock {...copy} />}
              {template === "story" && <LandingStory {...copy} />}
              {template === "diagnostic" && <LandingDiagnostic {...copy} />}
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
            <button onClick={copyHTML} style={actionBtnStyle(copied === "html", C.ac)}>
              {copied === "html" ? "✅ HTML 복사됨" : "📋 HTML 복사"}
            </button>
            <button onClick={copyReact} style={actionBtnStyle(copied === "react", C.bl)}>
              {copied === "react" ? "✅ React 복사됨" : "⚛️ React 복사"}
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

      {/* 4. 인라인 카피 편집 */}
      {copy && (
        <Card style={{ padding: 14 }}>
          <h4 style={subTitle}>✏️ 4. 카피 인라인 편집</h4>
          <p style={{ fontSize: 11, color: C.tm, margin: "0 0 10px" }}>
            아래 필드를 수정하면 즉시 프리뷰에 반영됩니다.
          </p>
          <CopyEditor template={template} copy={copy} setCopy={setCopy} />
        </Card>
      )}

      {/* 디자인 프롬프트 모달 */}
      <PromptCopyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${tplMeta?.name} 랜딩 — 디자인 툴 프롬프트`}
        loading={promptLoading}
        tabs={modalTabs}
      />
    </div>
  );
}

/* ============================================================
 * Copy Editor — 템플릿별 인라인 편집
 * ============================================================ */

function CopyEditor({ template, copy, setCopy }) {
  const update = (key, value) => setCopy({ ...copy, [key]: value });
  const updateNested = (key, subKey, value) =>
    setCopy({ ...copy, [key]: { ...copy[key], [subKey]: value } });
  const updateArray = (key, idx, value) => {
    const next = [...(copy[key] || [])];
    next[idx] = value;
    setCopy({ ...copy, [key]: next });
  };
  const updateArrayObj = (key, idx, subKey, value) => {
    const next = [...(copy[key] || [])];
    next[idx] = { ...next[idx], [subKey]: value };
    setCopy({ ...copy, [key]: next });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* 공통 필드 */}
      {copy.headline !== undefined && (
        <Field label="Headline" value={copy.headline} onChange={(v) => update("headline", v)} long />
      )}
      {copy.subhead !== undefined && (
        <Field label="Subhead" value={copy.subhead} onChange={(v) => update("subhead", v)} long />
      )}
      {copy.ctaText !== undefined && (
        <Field label="CTA Text" value={copy.ctaText} onChange={(v) => update("ctaText", v)} />
      )}

      {/* numberShock */}
      {template === "numberShock" && (
        <>
          {copy.badge !== undefined && (
            <Field label="Badge" value={copy.badge} onChange={(v) => update("badge", v)} />
          )}
          {copy.bigNumber !== undefined && (
            <Field
              label="Big Number"
              value={copy.bigNumber}
              onChange={(v) => update("bigNumber", v)}
            />
          )}
          {copy.comparison && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <Field
                label="Before"
                value={copy.comparison.before}
                onChange={(v) => updateNested("comparison", "before", v)}
              />
              <Field
                label="After"
                value={copy.comparison.after}
                onChange={(v) => updateNested("comparison", "after", v)}
              />
              <Field
                label="Saving"
                value={copy.comparison.saving}
                onChange={(v) => updateNested("comparison", "saving", v)}
              />
            </div>
          )}
          {Array.isArray(copy.painPoints) &&
            copy.painPoints.map((p, i) => (
              <Field
                key={`pp${i}`}
                label={`Pain ${i + 1}`}
                value={p}
                onChange={(v) => updateArray("painPoints", i, v)}
                long
              />
            ))}
          {Array.isArray(copy.usps) &&
            copy.usps.map((u, i) => (
              <div key={`usp${i}`} style={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr", gap: 6 }}>
                <Field
                  label={`USP ${i + 1} Icon`}
                  value={u.icon}
                  onChange={(v) => updateArrayObj("usps", i, "icon", v)}
                />
                <Field
                  label="Title"
                  value={u.title}
                  onChange={(v) => updateArrayObj("usps", i, "title", v)}
                />
                <Field
                  label="Desc"
                  value={u.desc}
                  onChange={(v) => updateArrayObj("usps", i, "desc", v)}
                />
              </div>
            ))}
        </>
      )}

      {/* story */}
      {template === "story" &&
        Array.isArray(copy.story) &&
        copy.story.map((s, i) => (
          <div key={`st${i}`} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 6 }}>
            <Field
              label={`Stage ${i + 1} Icon`}
              value={s.icon}
              onChange={(v) => updateArrayObj("story", i, "icon", v)}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Field
                label="Title"
                value={s.title}
                onChange={(v) => updateArrayObj("story", i, "title", v)}
              />
              <Field
                label="Desc"
                value={s.desc}
                onChange={(v) => updateArrayObj("story", i, "desc", v)}
                long
              />
            </div>
          </div>
        ))}
      {template === "story" && copy.testimonial && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 6 }}>
          <Field
            label="Quote"
            value={copy.testimonial.quote}
            onChange={(v) => updateNested("testimonial", "quote", v)}
            long
          />
          <Field
            label="Name"
            value={copy.testimonial.name}
            onChange={(v) => updateNested("testimonial", "name", v)}
          />
          <Field
            label="Title"
            value={copy.testimonial.title}
            onChange={(v) => updateNested("testimonial", "title", v)}
          />
        </div>
      )}

      {/* diagnostic */}
      {template === "diagnostic" && (
        <>
          {Array.isArray(copy.uspBadges) &&
            copy.uspBadges.map((b, i) => (
              <Field
                key={`ub${i}`}
                label={`USP Badge ${i + 1}`}
                value={b}
                onChange={(v) => updateArray("uspBadges", i, v)}
              />
            ))}
          {Array.isArray(copy.usps) &&
            copy.usps.map((u, i) => (
              <div key={`du${i}`} style={{ display: "grid", gridTemplateColumns: "60px 1fr 2fr", gap: 6 }}>
                <Field
                  label="Icon"
                  value={u.icon}
                  onChange={(v) => updateArrayObj("usps", i, "icon", v)}
                />
                <Field
                  label="Title"
                  value={u.title}
                  onChange={(v) => updateArrayObj("usps", i, "title", v)}
                />
                <Field
                  label="Desc"
                  value={u.desc}
                  onChange={(v) => updateArrayObj("usps", i, "desc", v)}
                />
              </div>
            ))}
        </>
      )}
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

function DeviceToggle({ device, setDevice }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[
        { key: "desktop", label: "🖥 Desktop" },
        { key: "mobile", label: "📱 Mobile" },
      ].map((d) => {
        const on = device === d.key;
        return (
          <button
            key={d.key}
            onClick={() => setDevice(d.key)}
            style={{
              padding: "5px 10px",
              borderRadius: 6,
              border: on ? `1px solid ${C.ac}` : `1px solid ${C.border}`,
              background: on ? `${C.ac}10` : C.bg,
              color: on ? C.ac : C.td,
              fontSize: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {d.label}
          </button>
        );
      })}
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

function primaryBtnStyle(loading, disabled) {
  return {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: disabled
      ? "#E2E8F0"
      : "linear-gradient(135deg, #00C9A7, #1D85EB)",
    color: disabled ? "#94A3B8" : "#FFFFFF",
    fontSize: 13,
    fontWeight: 900,
    cursor: loading ? "wait" : disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    boxShadow: disabled ? "none" : "0 4px 14px rgba(0,201,167,0.25)",
  };
}

function actionBtnStyle(active, color) {
  return {
    flex: "1 1 auto",
    minWidth: 120,
    padding: "8px",
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
