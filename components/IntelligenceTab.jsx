"use client";

import { useState, useCallback } from "react";
import Badge from "./ui/Badge";
import { TARGET_COMPANIES } from "@/data/targetCompanies";
import CompanyDB from "./intelligence/CompanyDB";
import ScoringView from "./intelligence/ScoringView";
import ProposalGenerator from "./intelligence/ProposalGenerator";
import OutreachGenerator from "./intelligence/OutreachGenerator";

const C = {
  sf: "#0f1623",
  sa: "#141d2e",
  ac: "#36CFBA",
  bl: "#1D85EB",
  pp: "#A78BFA",
  wn: "#F59E0B",
  t: "#E2E8F0",
  td: "#94A3B8",
  tm: "#64748B",
  bl2: "rgba(255,255,255,0.08)",
};

const SUBVIEWS = [
  { key: "db",       label: "타겟 기업 DB",    icon: "📋", desc: "불이행 명단 기반 20개사" },
  { key: "scoring",  label: "AI 스코어링",     icon: "🏆", desc: "영업 우선순위 산출" },
  { key: "proposal", label: "AI 제안서 생성",  icon: "🤖", desc: "Claude 맞춤 제안서" },
  { key: "outreach", label: "AI 아웃바운드",   icon: "📧", desc: "이메일·링크드인·카톡" },
];

export default function IntelligenceTab() {
  const [companies, setCompanies] = useState(() =>
    TARGET_COMPANIES.map((c) => ({ ...c, status: "untouched" }))
  );
  const [sub, setSub] = useState("db");
  const [selectedId, setSelectedId] = useState(null);
  const [proposals, setProposals] = useState({}); // { [companyId]: proposalData }
  const [outreaches, setOutreaches] = useState({}); // { [companyId]: { email:{formal, casual, urgent, __compare}, linkedin:{}, kakao:{} } }

  const selectedCompany = selectedId
    ? companies.find((c) => c.id === selectedId) || null
    : null;
  const selectedProposal = selectedId ? proposals[selectedId] : null;
  const selectedOutreach = selectedId ? outreaches[selectedId] : null;

  const handleSelect = useCallback(
    (id) => {
      setSelectedId(id);
      setSub("proposal");
    },
    []
  );

  const handleStatusChange = useCallback((id, newStatus) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  }, []);

  const handleProposalGenerated = useCallback((companyId, proposal) => {
    setProposals((p) => ({ ...p, [companyId]: proposal }));
    // 상태 자동 업데이트 없음 — 사용자가 직접 드롭다운 변경
  }, []);

  const handleOutreachGenerated = useCallback(
    (companyId, channel, tone, data) => {
      setOutreaches((prev) => {
        const cur = prev[companyId] || {};
        const chPrev = cur[channel] || {};
        return {
          ...prev,
          [companyId]: {
            ...cur,
            [channel]: { ...chPrev, [tone]: data },
          },
        };
      });
    },
    []
  );

  const handleSelectCompanyInline = useCallback((id) => {
    setSelectedId(id);
  }, []);

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: C.t, margin: 0 }}>
            🎯 타겟 기업 인텔리전스
          </h2>
          <Badge color={C.ac}>AI Sales Automation</Badge>
        </div>
        <p style={{ fontSize: 12, color: C.td, margin: "4px 0 0", lineHeight: 1.6 }}>
          공개 데이터(고용노동부 불이행 명단) → AI 스코어링 → 맞춤 제안서 → 아웃바운드 메시지까지 자동 파이프라인
        </p>
      </div>

      {/* 서브 네비 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 6,
          marginBottom: 14,
        }}
      >
        {SUBVIEWS.map((v) => {
          const active = sub === v.key;
          return (
            <button
              key={v.key}
              onClick={() => setSub(v.key)}
              style={{
                padding: "11px 8px",
                borderRadius: 10,
                border: active ? `1px solid ${C.ac}55` : `1px solid ${C.bl2}`,
                background: active ? `${C.ac}14` : C.sf,
                color: active ? C.ac : C.td,
                fontSize: 12,
                fontWeight: active ? 800 : 600,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              <span style={{ fontSize: 18 }}>{v.icon}</span>
              <span>{v.label}</span>
              <span style={{ fontSize: 10, color: C.tm, fontWeight: 500 }}>
                {v.desc}
              </span>
            </button>
          );
        })}
      </div>

      {sub === "db" && (
        <CompanyDB
          companies={companies}
          onSelect={handleSelect}
          onStatusChange={handleStatusChange}
        />
      )}

      {sub === "scoring" && (
        <ScoringView companies={companies} onSelect={handleSelect} />
      )}

      {sub === "proposal" && (
        <ProposalGenerator
          company={selectedCompany}
          proposal={selectedProposal}
          onProposalGenerated={handleProposalGenerated}
          onGoOutreach={() => setSub("outreach")}
          companies={companies}
          onSelectCompany={handleSelectCompanyInline}
        />
      )}

      {sub === "outreach" && (
        <OutreachGenerator
          company={selectedCompany}
          outreach={selectedOutreach}
          onOutreachGenerated={handleOutreachGenerated}
          companies={companies}
          onSelectCompany={handleSelectCompanyInline}
        />
      )}
    </div>
  );
}
