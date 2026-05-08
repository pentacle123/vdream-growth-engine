"use client";

import { useState } from "react";
import Card from "../ui/Card";
import Spinner from "../ui/Spinner";
import { FAQ_DATA } from "@/data/faqData";

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
  bl2: "#CBD5E1",
};

export default function FAQSection({ context }) {
  const [openIdx, setOpenIdx] = useState(0); // 첫 번째 기본 펼침
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = (i) => setOpenIdx(openIdx === i ? -1 : i);

  const ask = async (q) => {
    const text = (q || question || "").trim();
    if (!text) return;
    setLoading(true);
    setAiAnswer(null);
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, context }),
      });
      const data = await res.json();
      setAiAnswer({ ...data, question: text });
      if (q) setQuestion("");
    } catch {
      setAiAnswer({
        question: text,
        answer: "네트워크 오류로 답변을 불러오지 못했습니다. 1644-8619로 직접 문의해주세요.",
        fallback: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ marginTop: 12, marginBottom: 12 }}>
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: 14,
          fontWeight: 800,
          color: C.t,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ❓ 자주 묻는 질문
      </h3>
      <p style={{ fontSize: 11, color: C.tm, margin: "0 0 12px" }}>
        궁금한 점을 클릭하거나 직접 질문해보세요 — Claude가 답변드립니다.
      </p>

      {/* FAQ 아코디언 — 클린한 보더 디바이더 + + 회전 아이콘 */}
      <div>
        {FAQ_DATA.map((item, i) => {
          const open = openIdx === i;
          return (
            <div
              key={i}
              style={{
                borderBottom: i < FAQ_DATA.length - 1 ? `1px solid ${C.sa}` : "none",
              }}
            >
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  background: "transparent",
                  border: "none",
                  color: C.t,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  textAlign: "left",
                }}
              >
                <span style={{ flex: 1, lineHeight: 1.5 }}>{item.q}</span>
                <span
                  style={{
                    color: open ? C.ac : C.tm,
                    fontSize: 22,
                    fontWeight: 300,
                    transform: open ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 0.2s, color 0.2s",
                    lineHeight: 1,
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </span>
              </button>
              {open && (
                <div
                  style={{
                    padding: "0 0 14px",
                    fontSize: 13,
                    color: C.td,
                    lineHeight: 1.7,
                  }}
                >
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Q&A 입력 */}
      <div style={{ marginTop: 14 }}>
        <h4
          style={{
            margin: "0 0 8px",
            fontSize: 12,
            fontWeight: 800,
            color: C.bl,
            letterSpacing: 0.5,
          }}
        >
          💬 AI에게 직접 질문하기
        </h4>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading && question.trim()) ask();
            }}
            placeholder="예: 우리 회사처럼 IT 업종이면 어떤 직무가 적합할까요?"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 8,
              border: `1px solid ${C.bl2}`,
              background: C.sa,
              color: C.t,
              fontSize: 12,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={() => ask()}
            disabled={loading || !question.trim()}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background:
                !question.trim() ? C.sa : `linear-gradient(135deg, ${C.ac}, ${C.bl})`,
              color: !question.trim() ? C.tm : "#000",
              fontSize: 12,
              fontWeight: 800,
              cursor: loading ? "wait" : !question.trim() ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            {loading ? <Spinner color="#000" /> : "✨"} 질문
          </button>
        </div>
      </div>

      {/* AI 답변 */}
      {aiAnswer && (
        <div
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 10,
            background: `${C.bl}08`,
            border: `1px solid ${C.bl}33`,
          }}
        >
          {aiAnswer.fallback && (
            <div
              style={{
                fontSize: 10,
                color: C.am,
                marginBottom: 6,
                fontStyle: "italic",
              }}
            >
              ⚠ 샘플 답변 (API 키 미설정 또는 오류)
            </div>
          )}
          <div
            style={{
              fontSize: 11,
              color: C.bl,
              fontWeight: 800,
              marginBottom: 4,
              letterSpacing: 0.5,
            }}
          >
            🙋 {aiAnswer.question}
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.t,
              lineHeight: 1.7,
              padding: "8px 10px",
              borderRadius: 7,
              background: C.sa,
              borderLeft: `3px solid ${C.ac}`,
            }}
          >
            🤖 {aiAnswer.answer}
          </div>
          {Array.isArray(aiAnswer.suggestions) && aiAnswer.suggestions.length > 0 && (
            <div style={{ marginTop: 9 }}>
              <div
                style={{
                  fontSize: 10,
                  color: C.tm,
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  marginBottom: 5,
                }}
              >
                추가로 궁금한 점
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {aiAnswer.suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => ask(s)}
                    disabled={loading}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 999,
                      border: `1px solid ${C.ac}44`,
                      background: `${C.ac}10`,
                      color: C.ac,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: loading ? "wait" : "pointer",
                    }}
                  >
                    {s} →
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 추가 안내 */}
      <div
        style={{
          marginTop: 10,
          padding: "8px 11px",
          borderRadius: 7,
          background: `${C.am}0c`,
          border: `1px solid ${C.am}28`,
          fontSize: 11,
          color: C.am,
          lineHeight: 1.5,
        }}
      >
        💡 <strong>구체적인 견적·도입이 필요하시면</strong>{" "}
        <a
          href="https://www.vdream.co.kr/inquiry"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: C.am, fontWeight: 700, textDecoration: "underline" }}
        >
          무료 상담 신청
        </a>{" "}
        또는{" "}
        <a
          href="tel:1644-8619"
          style={{ color: C.am, fontWeight: 700, textDecoration: "underline" }}
        >
          1644-8619
        </a>
        로 연락주세요.
      </div>
    </Card>
  );
}
