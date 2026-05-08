"use client";

import { useState, useRef, useCallback } from "react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Spinner from "./ui/Spinner";
import { useData, DATA_KEYS } from "@/contexts/DataContext";
import { autoTagKeyword, aggregateTotals } from "@/data/naverAdData";

const C = {
  bg: "#FFFFFF",
  sf: "#F8FAFC",
  sa: "#F1F5F9",
  sh: "#E2E8F0",
  ac: "#00C9A7",
  bl: "#1D85EB",
  pp: "#A78BFA",
  am: "#F59E0B",
  rd: "#EF4444",
  gn: "#10B981",
  t: "#0F172A",
  td: "#334155",
  tm: "#64748B",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
};

/* ============================================================
 * 데이터 유형 정의
 * ============================================================ */

const DATA_TYPES = [
  { key: "naver", label: "네이버 검색광고", icon: "🟢", brand: "#03C75A", target: DATA_KEYS.naverAd },
  { key: "meta", label: "메타 DA", icon: "📱", brand: "#0866FF", target: DATA_KEYS.metaDA },
  { key: "linkedin", label: "링크드인 DA", icon: "💼", brand: "#0A66C2", target: DATA_KEYS.linkedinDA },
  { key: "remember", label: "리멤버 배너", icon: "📇", brand: "#FF6F3C", target: DATA_KEYS.rememberDA },
  { key: "ga4", label: "GA4 리포트", icon: "📊", brand: "#F9AB00", target: DATA_KEYS.ga4 },
  { key: "companies", label: "타겟 기업 명단", icon: "🎯", brand: "#A78BFA", target: DATA_KEYS.targetCompanies },
];

/* ============================================================
 * 컬럼 매핑 정의
 * ============================================================ */

const COLUMN_MAPS = {
  naver: {
    "캠페인": "campaign",
    "광고그룹": "group",
    "광고그룹명": "group",
    "키워드": "kw",
    "노출수": "imp",
    "노출": "imp",
    "클릭수": "click",
    "클릭": "click",
    "클릭률(%)": "ctr",
    "CTR": "ctr",
    "평균클릭비용(원)": "cpc",
    "CPC": "cpc",
    "평균CPC": "cpc",
    "총비용(원)": "cost",
    "비용": "cost",
    "전환수": "conv",
    "전환": "conv",
    "전환율(%)": "convRate",
    "전환매출(원)": "revenue",
  },
  meta: {
    "Campaign name": "campaign",
    "캠페인 이름": "campaign",
    "Ad set name": "adSet",
    "광고 세트 이름": "adSet",
    "Ad name": "adName",
    "광고 이름": "adName",
    Impressions: "imp",
    노출: "imp",
    "Clicks (all)": "click",
    "클릭(전체)": "click",
    Clicks: "click",
    "CTR (all)": "ctr",
    CTR: "ctr",
    "CPC (all)": "cpc",
    CPC: "cpc",
    "Amount spent": "cost",
    "지출 금액": "cost",
    Results: "conv",
    "Cost per result": "cpa",
    Reach: "reach",
    Frequency: "frequency",
  },
  linkedin: {
    "Campaign Name": "campaign",
    Impressions: "imp",
    Clicks: "click",
    CTR: "ctr",
    "Average CPC": "cpc",
    "Total Spent": "cost",
    Conversions: "conv",
    Leads: "leads",
  },
  remember: {
    캠페인: "campaign",
    노출: "imp",
    클릭: "click",
    CTR: "ctr",
    비용: "cost",
    리드: "leads",
  },
  ga4: {
    "이벤트 이름": "event",
    "이벤트 수": "eventCount",
    사용자: "users",
    세션: "sessions",
    "참여 시간": "engagement",
  },
  companies: {
    사업장명: "name",
    기업명: "name",
    회사명: "name",
    업종: "industry",
    소재지: "region",
    지역: "region",
    상시근로자수: "employees",
    "상시 근로자": "employees",
    의무고용인원: "mandatoryCount",
    "의무 고용인원": "mandatoryCount",
    고용인원: "actualCount",
    "장애인 고용인원": "actualCount",
    부족인원: "deficit",
    "부족 인원": "deficit",
  },
};

/* ============================================================
 * 파일 파서 (xlsx)
 * ============================================================ */

async function parseFile(file) {
  const XLSX = await import("xlsx");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arr = new Uint8Array(e.target.result);
        const wb = XLSX.read(arr, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        resolve({ rows, columns, sheetName: wb.SheetNames[0] });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function detectType(columns) {
  const colStr = columns.join(" ").toLowerCase();
  if (colStr.includes("광고그룹") || colStr.includes("키워드") || colStr.includes("파워링크"))
    return "naver";
  if (colStr.includes("ad set") || colStr.includes("광고 세트") || colStr.includes("amount spent"))
    return "meta";
  if (colStr.includes("leads") && (colStr.includes("campaign name") || colStr.includes("inmail")))
    return "linkedin";
  if (colStr.includes("이벤트") && colStr.includes("세션")) return "ga4";
  if (colStr.includes("사업장명") || colStr.includes("의무고용")) return "companies";
  return null;
}

function normalizeRow(row, type) {
  const map = COLUMN_MAPS[type] || {};
  const out = {};
  Object.entries(row).forEach(([k, v]) => {
    const mapped = map[k.trim()];
    if (!mapped) return;
    if (typeof v === "string") {
      const cleaned = v.replace(/,/g, "").replace(/%/g, "").replace(/원/g, "").trim();
      const num = parseFloat(cleaned);
      out[mapped] = Number.isFinite(num) && cleaned !== "" ? num : v;
    } else {
      out[mapped] = v;
    }
  });
  return out;
}

function normalizeNaverData(rows) {
  // 네이버 데이터는 키워드 단위로 들어옴 → 그룹별로 묶어야 함
  const byGroup = {};
  rows.forEach((r) => {
    const n = normalizeRow(r, "naver");
    if (!n.kw) return;
    const groupKey = n.group || "기본_그룹";
    if (!byGroup[groupKey]) byGroup[groupKey] = { group: groupKey, tag: "기타", keywords: [] };
    const tag = autoTagKeyword(n.kw);
    byGroup[groupKey].tag = tag === "기타" ? byGroup[groupKey].tag : tag;
    byGroup[groupKey].keywords.push({
      kw: n.kw,
      imp: Number(n.imp) || 0,
      click: Number(n.click) || 0,
      ctr: Number(n.ctr) || 0,
      cpc: Number(n.cpc) || 0,
      cost: Number(n.cost) || 0,
      conv: Number(n.conv) || 0,
      tag,
    });
  });
  return Object.values(byGroup);
}

function normalizeCompanies(rows) {
  return rows
    .map((r, idx) => {
      const n = normalizeRow(r, "companies");
      if (!n.name) return null;
      const employees = Number(n.employees) || 0;
      const mandatoryCount = Number(n.mandatoryCount) || Math.ceil(employees * 0.031);
      const actualCount = Number(n.actualCount) || 0;
      const deficit = Number(n.deficit) || Math.max(0, mandatoryCount - actualCount);
      const effectiveCount = actualCount; // 스펙상 별도 표기 없으면 actual로
      const actualRate = employees > 0 ? actualCount / employees : 0;
      let baseAmount;
      if (actualRate === 0) baseAmount = 2_156_880;
      else if (actualRate < 0.0155) baseAmount = 1_618_440;
      else if (actualRate < 0.023) baseAmount = 1_348_080;
      else baseAmount = 1_214_400;
      const estimatedPenalty = deficit * baseAmount * 12;
      return {
        id: idx + 1,
        name: n.name,
        industry: n.industry || "기타",
        region: n.region || "서울",
        employees,
        mandatoryCount,
        actualCount,
        effectiveCount,
        deficit,
        estimatedPenalty,
      };
    })
    .filter(Boolean);
}

function normalizeGeneric(rows, type) {
  return rows.map((r) => normalizeRow(r, type)).filter((r) => Object.keys(r).length > 0);
}

/* ============================================================
 * 메인 컴포넌트
 * ============================================================ */

export default function DataUpload() {
  const { data, updateData, recordUpload, uploadHistory, resetAll, customKeys } = useData();
  const [selectedType, setSelectedType] = useState("naver");
  const [parsing, setParsing] = useState(false);
  const [preview, setPreview] = useState(null); // { type, rawRows, normalized, columns, filename, summary }
  const [mode, setMode] = useState("replace");
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file, forcedType) => {
      if (!file) return;
      setError(null);
      setParsing(true);
      setPreview(null);
      setAnalysis(null);
      try {
        const { rows, columns } = await parseFile(file);
        const detectedType = forcedType || detectType(columns) || selectedType;
        let normalized;
        if (detectedType === "naver") {
          normalized = normalizeNaverData(rows);
        } else if (detectedType === "companies") {
          normalized = normalizeCompanies(rows);
        } else {
          normalized = normalizeGeneric(rows, detectedType);
        }

        // 요약 계산
        let summary = { rowCount: normalized.length };
        if (detectedType === "naver") {
          const t = aggregateTotals(normalized);
          summary = { ...summary, ...t, groupCount: normalized.length };
        } else if (detectedType === "companies") {
          summary.totalEmployees = normalized.reduce((a, c) => a + (c.employees || 0), 0);
          summary.totalDeficit = normalized.reduce((a, c) => a + (c.deficit || 0), 0);
          summary.totalPenalty = normalized.reduce((a, c) => a + (c.estimatedPenalty || 0), 0);
        } else {
          summary.imp = normalized.reduce((a, r) => a + (Number(r.imp) || 0), 0);
          summary.click = normalized.reduce((a, r) => a + (Number(r.click) || 0), 0);
          summary.cost = normalized.reduce((a, r) => a + (Number(r.cost) || 0), 0);
          summary.conv = normalized.reduce((a, r) => a + (Number(r.conv) || 0), 0);
        }

        setPreview({
          type: detectedType,
          rawRows: rows.slice(0, 5),
          normalized,
          columns,
          filename: file.name,
          summary,
        });
      } catch (err) {
        setError(err.message || "파일을 읽을 수 없습니다.");
      } finally {
        setParsing(false);
      }
    },
    [selectedType]
  );

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const confirmUpload = () => {
    if (!preview) return;
    const dataType = DATA_TYPES.find((t) => t.key === preview.type);
    if (!dataType) return;
    updateData(dataType.target, preview.normalized, mode);
    recordUpload({
      type: preview.type,
      typeLabel: dataType.label,
      filename: preview.filename,
      rowCount: preview.summary.rowCount,
      mode,
    });
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runAIAnalysis = async () => {
    if (!preview) return;
    const dataType = DATA_TYPES.find((t) => t.key === preview.type);
    setAnalysisLoading(true);
    try {
      let prevSummary = {};
      if (preview.type === "naver") {
        prevSummary = aggregateTotals(data[DATA_KEYS.naverAd]);
      }
      const res = await fetch("/api/data-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataType: dataType?.label || preview.type,
          previous: { summary: prevSummary },
          current: { summary: preview.summary },
          periodLabel: preview.filename,
        }),
      });
      const result = await res.json();
      setAnalysis(result);
    } catch {
      setAnalysis({ fallback: true, periodComparison: "분석 실패." });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const tplMeta = DATA_TYPES.find((t) => t.key === selectedType);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* 헤더 */}
      <div
        style={{
          padding: "20px 22px",
          borderRadius: 14,
          background: `linear-gradient(135deg, ${C.am}10 0%, ${C.bl}08 100%)`,
          border: `1px solid ${C.am}33`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: C.am,
            letterSpacing: 3,
            marginBottom: 4,
          }}
        >
          DATA UPLOAD CENTER
        </div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.t }}>
          📤 데이터 업로드
        </h2>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: C.td, lineHeight: 1.6 }}>
          엑셀·CSV 파일을 드래그하면 자동 파싱 → 컬럼 매핑 → 대시보드 즉시 반영. 브라우저 로컬에 저장(localStorage).
        </p>
      </div>

      {/* 1. 데이터 유형 선택 */}
      <Card style={{ padding: 14 }}>
        <h4 style={subTitle}>1. 데이터 유형 선택</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 6,
          }}
        >
          {DATA_TYPES.map((t) => {
            const active = selectedType === t.key;
            const isCustom = customKeys.includes(t.target);
            return (
              <button
                key={t.key}
                onClick={() => setSelectedType(t.key)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 10,
                  border: active ? `2px solid ${t.brand}` : `1px solid ${C.border}`,
                  background: active ? `${t.brand}0e` : C.bg,
                  cursor: "pointer",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 3 }}>{t.icon}</div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: active ? t.brand : C.t,
                  }}
                >
                  {t.label}
                </div>
                {isCustom && (
                  <span
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      fontSize: 8,
                      color: C.gn,
                      fontWeight: 800,
                      background: `${C.gn}14`,
                      padding: "2px 5px",
                      borderRadius: 4,
                    }}
                  >
                    ● 업로드됨
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. 파일 드롭 영역 */}
      <Card style={{ padding: 14 }}>
        <h4 style={subTitle}>2. 파일 업로드</h4>
        <div
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? tplMeta?.brand || C.ac : C.borderStrong}`,
            borderRadius: 14,
            padding: "40px 20px",
            textAlign: "center",
            cursor: "pointer",
            background: isDragging ? `${tplMeta?.brand}08` : C.sf,
            transition: "all 0.15s",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.t, marginBottom: 4 }}>
            {parsing
              ? "파일 파싱 중..."
              : isDragging
              ? "여기에 놓으세요"
              : "파일을 드래그하거나 클릭"}
          </div>
          <div style={{ fontSize: 11, color: C.tm }}>
            .xlsx · .xls · .csv 지원 — 자동 컬럼 매핑
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onFileInputChange}
            style={{ display: "none" }}
          />
        </div>
        {error && (
          <div
            style={{
              marginTop: 10,
              padding: "8px 12px",
              borderRadius: 8,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#991B1B",
              fontSize: 12,
            }}
          >
            ⚠️ {error}
          </div>
        )}
      </Card>

      {/* 3. 프리뷰 + 확정 */}
      {preview && (
        <Card style={{ padding: 16, borderColor: `${C.gn}55` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>✅</span>
            <h4 style={{ ...subTitle, margin: 0, color: C.gn }}>3. 파일 파싱 완료</h4>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <Mini label="감지된 유형" value={DATA_TYPES.find((t) => t.key === preview.type)?.label || preview.type} />
            <Mini label="파일명" value={preview.filename} mono />
            <Mini label="데이터 행" value={`${preview.summary.rowCount}개`} />
            <Mini label="감지된 컬럼" value={`${preview.columns.length}개`} />
          </div>

          {/* 요약 */}
          <div
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              background: C.sa,
              marginBottom: 12,
              fontSize: 11,
              color: C.td,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: C.gn }}>📊 요약: </strong>
            {preview.type === "naver" && (
              <>
                노출 <Num>{(preview.summary.imp || 0).toLocaleString("ko-KR")}</Num>
                {" · "}
                클릭 <Num>{(preview.summary.click || 0).toLocaleString("ko-KR")}</Num>
                {" · "}
                CTR <Num>{(preview.summary.ctr || 0).toFixed(2)}%</Num>
                {" · "}
                비용 <Num>{Math.round((preview.summary.cost || 0) / 10000).toLocaleString("ko-KR")}만원</Num>
                {" · "}
                전환 <Num style={{ color: preview.summary.conv === 0 ? C.rd : C.gn }}>{preview.summary.conv}</Num>
              </>
            )}
            {preview.type === "companies" && (
              <>
                기업 수 <Num>{preview.summary.rowCount}</Num>
                {" · "}
                총 근로자 <Num>{(preview.summary.totalEmployees || 0).toLocaleString("ko-KR")}명</Num>
                {" · "}
                총 부족인원 <Num>{(preview.summary.totalDeficit || 0).toLocaleString("ko-KR")}명</Num>
                {" · "}
                총 부담금 <Num style={{ color: C.rd }}>
                  {Math.round((preview.summary.totalPenalty || 0) / 1e8).toLocaleString("ko-KR")}억원
                </Num>
              </>
            )}
            {preview.type !== "naver" && preview.type !== "companies" && (
              <>
                노출 <Num>{(preview.summary.imp || 0).toLocaleString("ko-KR")}</Num>
                {" · "}
                클릭 <Num>{(preview.summary.click || 0).toLocaleString("ko-KR")}</Num>
                {" · "}
                전환 <Num>{preview.summary.conv || 0}</Num>
              </>
            )}
          </div>

          {/* 프리뷰 테이블 (raw 5행) */}
          <div style={{ overflowX: "auto", marginBottom: 12 }}>
            <table
              style={{
                width: "100%",
                fontSize: 10,
                borderCollapse: "collapse",
                minWidth: 480,
              }}
            >
              <thead>
                <tr style={{ background: C.sa }}>
                  {preview.columns.slice(0, 8).map((c) => (
                    <th
                      key={c}
                      style={{
                        padding: "6px 8px",
                        textAlign: "left",
                        color: C.tm,
                        fontWeight: 700,
                        borderBottom: `1px solid ${C.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rawRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    {preview.columns.slice(0, 8).map((c) => (
                      <td
                        key={c}
                        style={{
                          padding: "6px 8px",
                          color: C.td,
                          whiteSpace: "nowrap",
                          maxWidth: 180,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {String(row[c] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.columns.length > 8 && (
              <div style={{ fontSize: 10, color: C.tm, marginTop: 4 }}>
                + {preview.columns.length - 8}개 컬럼 더 (자동 매핑됨)
              </div>
            )}
          </div>

          {/* 모드 선택 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <button
              onClick={() => setMode("replace")}
              style={{
                flex: 1,
                padding: "9px 11px",
                borderRadius: 8,
                border: mode === "replace" ? `2px solid ${C.ac}` : `1px solid ${C.border}`,
                background: mode === "replace" ? `${C.ac}10` : C.bg,
                color: mode === "replace" ? C.ac : C.td,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>🔄 기존 데이터 교체</div>
              <div style={{ fontSize: 10, color: C.tm, marginTop: 2 }}>
                해당 유형 데이터 완전 교체
              </div>
            </button>
            <button
              onClick={() => setMode("append")}
              style={{
                flex: 1,
                padding: "9px 11px",
                borderRadius: 8,
                border: mode === "append" ? `2px solid ${C.bl}` : `1px solid ${C.border}`,
                background: mode === "append" ? `${C.bl}10` : C.bg,
                color: mode === "append" ? C.bl : C.td,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div>➕ 기존에 추가</div>
              <div style={{ fontSize: 10, color: C.tm, marginTop: 2 }}>
                월별 비교용 누적
              </div>
            </button>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setPreview(null)}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: C.bg,
                color: C.td,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              onClick={confirmUpload}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: `linear-gradient(135deg, ${C.gn}, ${C.ac})`,
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ✅ 이 데이터로 업데이트 ({mode === "replace" ? "교체" : "추가"})
            </button>
            {preview.type === "naver" && (
              <button
                onClick={runAIAnalysis}
                disabled={analysisLoading}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: `1px solid ${C.pp}55`,
                  background: `${C.pp}10`,
                  color: C.pp,
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: analysisLoading ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {analysisLoading ? <Spinner color={C.pp} /> : "🤖"} AI 비교 분석
              </button>
            )}
          </div>
        </Card>
      )}

      {/* AI 분석 결과 */}
      {analysis && (
        <Card style={{ padding: 16, borderColor: `${C.pp}55` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>🤖</span>
            <h4 style={{ ...subTitle, margin: 0, color: C.pp }}>
              AI 비교 분석
              {analysis.fallback && (
                <span style={{ fontSize: 10, color: C.am, marginLeft: 8 }}>
                  (샘플 — API 키 미설정 또는 오류)
                </span>
              )}
            </h4>
          </div>
          <AnalysisSection label="📊 기간 대비" color={C.t}>
            <p style={{ fontSize: 13, color: C.t, lineHeight: 1.7, margin: 0 }}>
              {analysis.periodComparison}
            </p>
          </AnalysisSection>
          <AnalysisList label="✨ 개선점" items={analysis.improvements} color={C.gn} />
          <AnalysisList label="⚠️ 악화점" items={analysis.declines} color={C.rd} />
          <AnalysisList label="💡 핵심 인사이트" items={analysis.keyInsights} color={C.bl} />
          <AnalysisList label="🎯 즉시 액션" items={analysis.actionItems} color={C.am} />
          {analysis.budgetRecommendation && (
            <AnalysisSection label="💰 예산 제안" color={C.ac}>
              <p style={{ fontSize: 12, color: C.td, lineHeight: 1.7, margin: 0 }}>
                {analysis.budgetRecommendation}
              </p>
            </AnalysisSection>
          )}
        </Card>
      )}

      {/* 4. 업로드 이력 */}
      <Card style={{ padding: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <h4 style={{ ...subTitle, margin: 0 }}>📋 업로드 이력</h4>
          {uploadHistory.length > 0 && (
            <button
              onClick={() => {
                if (confirm("모든 업로드 데이터와 이력을 초기화합니다. 진행할까요?")) {
                  resetAll();
                }
              }}
              style={{
                padding: "5px 10px",
                borderRadius: 6,
                border: `1px solid ${C.rd}33`,
                background: "transparent",
                color: C.rd,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🗑 전체 초기화 (디폴트 복원)
            </button>
          )}
        </div>
        {uploadHistory.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: C.tm, fontSize: 12 }}>
            아직 업로드 이력이 없습니다. 위에서 파일을 업로드해보세요.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {uploadHistory.map((h) => (
              <div
                key={h.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 11px",
                  borderRadius: 7,
                  background: C.sf,
                  border: `1px solid ${C.border}`,
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Badge color={C.bl}>{h.typeLabel || h.type}</Badge>
                  <span style={{ color: C.t, fontWeight: 600 }}>{h.filename}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: C.tm,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {new Date(h.date).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Badge color={h.mode === "replace" ? C.ac : C.am}>
                    {h.mode === "replace" ? "교체" : "추가"}
                  </Badge>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: C.t,
                      fontWeight: 700,
                    }}
                  >
                    {h.rowCount}행
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 안내 */}
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: `${C.bl}08`,
          border: `1px solid ${C.bl}33`,
          fontSize: 11,
          color: C.td,
          lineHeight: 1.7,
        }}
      >
        💡 <strong style={{ color: C.bl }}>업로드 데이터는 브라우저 localStorage에 저장됩니다.</strong>{" "}
        같은 기기/브라우저에서 새로고침해도 유지되지만, 다른 기기에는 동기화되지 않습니다.
        장기 저장이 필요하면 Supabase 연동 (Phase 2) 이후 사용 가능합니다.
      </div>
    </div>
  );
}

/* ============================================================
 * 보조 컴포넌트
 * ============================================================ */

function Mini({ label, value, mono }) {
  return (
    <div
      style={{
        padding: "8px 11px",
        borderRadius: 7,
        background: C.sf,
        border: `1px solid ${C.border}`,
      }}
    >
      <div style={{ fontSize: 9, color: C.tm, fontWeight: 700, letterSpacing: 0.5 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 12,
          color: C.t,
          fontWeight: 700,
          marginTop: 2,
          fontFamily: mono ? "'JetBrains Mono', monospace" : "inherit",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Num({ children, style = {} }) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        color: C.t,
        fontWeight: 700,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function AnalysisSection({ label, color, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color,
          letterSpacing: 1.2,
          marginBottom: 4,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function AnalysisList({ label, items, color }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <AnalysisSection label={label} color={color}>
      <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 12, color: C.td, lineHeight: 1.7 }}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </AnalysisSection>
  );
}

const subTitle = {
  margin: "0 0 10px",
  fontSize: 13,
  fontWeight: 800,
  color: C.bl,
  letterSpacing: 0.5,
};
