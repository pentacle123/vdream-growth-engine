"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { NAVER_AD_DATA } from "@/data/naverAdData";
import { CHANNEL_PERFORMANCE, MONTHLY_TREND } from "@/data/dashboardData";
import { TARGET_COMPANIES } from "@/data/targetCompanies";

/**
 * 전역 캠페인/기업 데이터 컨텍스트.
 * - 디폴트: 하드코딩 데이터 (data/* 파일)
 * - 업로드 시: localStorage에 저장 + 상태 업데이트
 * - 모든 분석/대시보드 컴포넌트가 이 컨텍스트를 구독
 */

const DataContext = createContext(null);

const STORAGE_KEY = "vdream_campaign_data";
const HISTORY_KEY = "vdream_upload_history";

// 데이터 키 정의 (업로드 유형과 매핑)
export const DATA_KEYS = {
  naverAd: "naverAd",            // 네이버 검색광고 (그룹 + 키워드)
  metaDA: "metaDA",              // 메타 DA 캠페인
  linkedinDA: "linkedinDA",      // 링크드인 DA
  rememberDA: "rememberDA",      // 리멤버 배너
  ga4: "ga4",                    // GA4 리포트
  channelPerformance: "channelPerformance", // 채널 종합 성과
  monthlyTrend: "monthlyTrend",  // 월별 트렌드
  targetCompanies: "targetCompanies", // 타겟 기업 DB
};

const DEFAULT_DATA = {
  [DATA_KEYS.naverAd]: NAVER_AD_DATA,
  [DATA_KEYS.metaDA]: [],
  [DATA_KEYS.linkedinDA]: [],
  [DATA_KEYS.rememberDA]: [],
  [DATA_KEYS.ga4]: [],
  [DATA_KEYS.channelPerformance]: CHANNEL_PERFORMANCE,
  [DATA_KEYS.monthlyTrend]: MONTHLY_TREND,
  [DATA_KEYS.targetCompanies]: TARGET_COMPANIES,
};

export function DataProvider({ children }) {
  const [data, setData] = useState(DEFAULT_DATA);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // localStorage에서 복원 (클라이언트만)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
      }
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setUploadHistory(JSON.parse(hist));
    } catch {
      // localStorage 접근 실패는 무시 (시크릿 모드 등)
    }
    setHydrated(true);
  }, []);

  // 데이터 업데이트 — replace 또는 append
  const updateData = useCallback((key, newData, mode = "replace") => {
    setData((prev) => {
      let next;
      if (mode === "append" && Array.isArray(prev[key])) {
        next = { ...prev, [key]: [...prev[key], ...newData] };
      } else {
        next = { ...prev, [key]: newData };
      }
      try {
        // 디폴트가 아닌 변경분만 저장 (용량 최적화)
        const customOnly = {};
        Object.keys(next).forEach((k) => {
          if (next[k] !== DEFAULT_DATA[k]) customOnly[k] = next[k];
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
      } catch {}
      return next;
    });
  }, []);

  // 업로드 이력 기록
  const recordUpload = useCallback((entry) => {
    setUploadHistory((prev) => {
      const next = [
        {
          id: Date.now() + Math.random(),
          date: new Date().toISOString(),
          ...entry,
        },
        ...prev,
      ].slice(0, 20); // 최근 20건
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // 특정 키만 디폴트로 복원
  const resetKey = useCallback((key) => {
    setData((prev) => {
      const next = { ...prev, [key]: DEFAULT_DATA[key] };
      try {
        const customOnly = {};
        Object.keys(next).forEach((k) => {
          if (next[k] !== DEFAULT_DATA[k]) customOnly[k] = next[k];
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
      } catch {}
      return next;
    });
  }, []);

  // 전체 초기화
  const resetAll = useCallback(() => {
    setData(DEFAULT_DATA);
    setUploadHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  }, []);

  // 디폴트 대비 변경된 키 목록
  const customKeys = Object.keys(data).filter((k) => data[k] !== DEFAULT_DATA[k]);

  const value = {
    data,
    hydrated,
    updateData,
    uploadHistory,
    recordUpload,
    resetKey,
    resetAll,
    customKeys,
    DEFAULT_DATA,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside <DataProvider>");
  return ctx;
}
