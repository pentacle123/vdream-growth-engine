# VDream Growth Engine — Claude Code Desktop 빌드 가이드

## 프로젝트 개요

브이드림(VDream) 장애인 채용 HR SaaS 기업의 B2B 마케팅을 위한 AI 플랫폼.
Pentacle(광고 에이전시)이 수익 쉐어 모델로 운영.
핵심 목적: 숏폼 콘텐츠 → AI 진단기 → 리드 수집 → 브이드림 계약 전환

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + 커스텀 다크 테마
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Charts:** Recharts
- **Deploy:** Vercel (pentacle123 org)
- **GitHub:** pentacle123/vdream-growth-engine

## 디자인 시스템

```
Colors:
- bg: #060b14
- surface: #0f1623
- surfaceAlt: #141d2e
- accent (VDream teal): #36CFBA
- blue: #1D85EB
- warn: #F59E0B
- red: #EF4444
- purple: #A78BFA
- text: #E2E8F0
- textDim: #94A3B8

Fonts:
- Display: Noto Sans KR (300~900)
- Mono: JetBrains Mono (numbers, data)

Style: Premium Dark, 브이드림 브랜드 컬러(#36CFBA + #1D85EB 그라데이션) 활용
```

## 플랫폼 구조 — 5개 탭

### TAB 1: 🏥 고용부담금 AI 진단기

**목적:** 리드 생성의 핵심 엔진. 모든 숏폼 CTA의 착지점.

**입력 필드:**
- 상시 근로자 수 (number)
- 현재 장애인 고용 수 (number)
- 중증 장애인 비율 (range slider, 0~100%)
- 업종 (select: 제조업/IT·소프트웨어/금융·보험/유통·물류/건설/서비스업/공공기관/기타)

**계산 로직:**
```
의무고용률: 민간 3.1%, 공공 3.8%
의무고용인원 = ceil(상시근로자 × 의무고용률)
유효고용인원 = (중증장애인 × 2) + 경증장애인  // 중증 더블카운트
부족인원 = max(0, 의무고용인원 - 유효고용인원)

부담기초액 (실고용률에 따라 차등):
- 장애인 미고용(0%): 2,156,880원/월
- 의무고용률 50% 미만: 1,618,440원/월
- 의무고용률 75% 미만: 1,348,080원/월
- 의무고용률 75% 이상: 1,214,400원/월

연간 고용부담금 = 부족인원 × 부담기초액 × 12개월

브이드림 도입 시뮬레이션:
- 필요 추가채용(중증 기준) = ceil(부족인원 / 2)  // 중증 1명 = 2명 인정
- 연간 채용비용 = 추가채용인원 × 2,200,000원(급여+관리비) × 12
- 절감액 = max(0, 연간부담금 - 연간채용비용)
- 장려금 = 초과고용인원 × 600,000원 × 12 (의무 초과 시)
- 총 연간 이익 = 절감액 + 장려금
```

**AI 기능 (Claude API 연동):**

1. **AI 맞춤 직무 추천** — 버튼 클릭 시 Claude API 호출
   - 업종·규모·부족인원을 바탕으로 적합한 장애인 재택근무 직무 5개 추천
   - 각 직무: 직무명, 적합 장애유형, 난이도, 설명, 적합도
   - JSON 응답 파싱 → UI 렌더링

2. **경영진 리포트 생성** — 버튼 클릭 시 Claude API 호출
   - 진단 결과를 바탕으로 경영진 보고용 요약 생성
   - 섹션: 핵심요약, 미이행 리스크, 도입 권고, 추천 일정
   - "PDF 다운로드" 버튼 (리드 수집 포인트 — 이메일 입력 필요)

**Claude API 호출 형태:**
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  })
});
```
API 키는 환경변수로 관리: ANTHROPIC_API_KEY

---

### TAB 2: 🎬 숏폼 콘텐츠 전략

**목적:** 타겟별 숏폼 콘텐츠 기획·관리

**3개 타겟 페르소나 (탭으로 전환):**

#### 페르소나 1: HR 담당자 👔
- 연령: 30~45세
- 페인: 부담금 신고, 채용방법 모름
- 플랫폼: 유튜브 쇼츠 / 인스타 릴스 / 링크드인
- 핵심 훅: 비용절감 + 실무편의
- 검색 인사이트: "장애인고용부담금 신고" 1월 3,890회 폭등, 여성 55%, 30대 38%
- 추천 콘텐츠:
  1. 충격형 (95점): "당신 회사가 매년 버리는 돈" — 30초 숫자 충격
  2. 시즌형 (92점): "1월 신고 전 체크리스트" — 10~12월 긴급 콘텐츠
  3. 사례형 (88점): "이 회사는 연 2억 아꼈습니다" — Before/After
  4. 교육형 (80점): "3분 고용부담금 완전정복" — 카드뉴스 스타일

#### 페르소나 2: CFO/경영진 📊
- 연령: 40~55세
- 페인: 비용최적화, ESG 압박
- 플랫폼: 쇼츠 / 링크드인 / 네이버클립
- 핵심 훅: ROI + ESG
- 추천 콘텐츠:
  1. 뉴스형 (93점): "고용부담금 인상 임박" — 제도변화 속보
  2. 데이터형 (90점): "부담금 vs 채용비용 비교표" — ROI 인포그래픽
  3. 트렌드형 (85점): "ESG 평가 속 장애인 고용 비중"

#### 페르소나 3: CEO/대표 🏢
- 연령: 35~55세
- 페인: 기업이미지, 명단공표 리스크
- 플랫폼: 유튜브 / 링크드인 / 네이버
- 핵심 훅: 리스크관리 + 사회적가치
- 추천 콘텐츠:
  1. 위기형 (96점): "당신 회사, 명단 공표 대상?" — 가장 임팩트 큰 후킹
  2. 인터뷰형 (87점): "도입 CEO의 실제 경험" — 클립 인터뷰
  3. 비전형 (78점): "장애인 고용이 기업가치를 높이는 이유"

**모든 콘텐츠의 CTA:** → "지금 우리 회사 고용부담금 무료 진단받기" → TAB 1 진단기로 연결

---

### TAB 3: 🤝 크리에이터 매칭

**5개 크리에이터 카테고리 (적합도 순):**

1. **HR/노무 전문 크리에이터** ⚖️ — 적합도 95%
   - 이유: HR 담당자가 이미 팔로우하는 채널. 가장 직접적 타겟 도달
   - 예시: 노무사 유튜버, HR인사이트 채널, 직장인 노동법 채널
   - 포맷: 정보+사례분석 / 쇼츠, 링크드인

2. **경영/비즈니스 크리에이터** 💼 — 적합도 88%
   - 이유: CEO·CFO 타겟 직접 도달. ESG·비용최적화 연결
   - 예시: 경영트렌드 채널, 스타트업 CEO 브이로그, ESG 채널
   - 포맷: 트렌드+인사이트 / 유튜브, 링크드인

3. **장애인 당사자 크리에이터** 🤝 — 적합도 82%
   - 이유: 사회적 가치를 진정성 있게 전달. 브랜디드 다큐에 최적
   - 예시: 장애인 일상 브이로그, 인권 채널, 재택근무 근로자
   - 포맷: 스토리텔링+다큐 / 유튜브, 릴스

4. **금융/세무 전문 크리에이터** 🧮 — 적합도 80%
   - 이유: 부담금을 '절세' 프레임으로 → CFO·경리팀 어필
   - 예시: 세금절약 채널, 세무사 유튜버
   - 포맷: 절세팁+계산시뮬 / 쇼츠, 네이버클립

5. **직장인 공감 숏폼 크리에이터** 🎬 — 적합도 75%
   - 이유: 직장인 공감대로 인식개선+바이럴 극대화
   - 예시: 사내뷰공업 스타일, 숏박스 스타일
   - 포맷: 스케치코미디 / 쇼츠, 릴스, 틱톡

---

### TAB 4: 📅 연간 캠페인 캘린더

**시즌별 인텐시티 + 액션:**
```
1월  🔥 100% — 부담금 신고 피크. 긴급 진단 CTA + 실시간 계산기 광고
2월  📈  75% — 신규 고용 상담. 도입 사례 숏폼 집중 배포
3월  🌱  50% — 연간 계획 수립기. ESG 트렌드 교육 콘텐츠
4~6월 📚  40% — 정보성 숏폼, 크리에이터 콜라보 시작
7~9월 🎯  60% — ROI 비교 콘텐츠, CFO 타겟 강화
10월  ⚡  80% — 위기형 콘텐츠 + 명단 공표 경고
11월  🚨  90% — 대량 숏폼 광고 + 진단기 CTA 집중
12월  💥  95% — 긴급성 숏폼 + 리타겟팅 풀가동
```

**핵심:** 10~1월 골든타임에 숏폼 광고 예산 60% 집중.

**전환 퍼널 시각화:**
숏폼 노출 📱 → 후킹 👀 → 진단기 클릭 🔍 → 리드 수집 📧 → 상담/계약 🤝

---

### TAB 5: 📡 검색 데이터 분석 (ListeningMind 실데이터)

**하드코딩 데이터 (ListeningMind MCP에서 2026.04.20 추출):**

#### 핵심 키워드 검색량:
```javascript
const SEARCH_DATA = [
  {
    keyword: "장애인 고용부담금",
    volumeAvg: 7986,
    volumeTotal: 57050,
    trend: "+138%",
    cpc: "$5.08",
    demographics: { male: "71%", age30s: "37%", age40s: "37%" },
    intent: "Informational",
    peakMonth: "1월 (9,710회), 3월 (11,070회)",
    insight: "최대 볼륨 키워드. 30~40대 남성 HR관리자 프로필. 1월 신고 시즌에 폭등.",
    shortformOpp: "'당신 회사 고용부담금 얼마?' 충격형 → 진단기 CTA",
  },
  {
    keyword: "장애인고용부담금 신고",
    volumeAvg: 1500,
    volumeTotal: 6214,
    trend: "-35%",
    demographics: { female: "55%", age30s: "38%", age40s: "36%" },
    intent: "Informational",
    peakMonth: "1월 (3,890회) — 평소 대비 15배",
    insight: "가장 긴급한 니즈. 30대 여성 인사·경리 실무자 프로필. 1월에만 폭등.",
    shortformOpp: "'e신고 전 30초만 보세요' 시즌형 → 진단기",
  },
  {
    keyword: "장애인 채용",
    volumeAvg: 5110,
    volumeTotal: 57200,
    demographics: { male: "61%", age30s: "42%" },
    intent: "Informational",
    insight: "양면 시장(구직자+기업). 기업 관점 콘텐츠가 비어 있는 블루오션.",
    shortformOpp: "'장애인 채용, 기업 입장에서 3분 정리' 교육형",
  },
  {
    keyword: "장애인 의무 고용",
    volumeAvg: 660,
    volumeTotal: 9260,
    demographics: { male: "55%", age30s: "30%", age40s: "24%" },
    insight: "제도 이해 탐색 단계. 의무 자체를 확인하려는 초기 검색.",
    shortformOpp: "'50인 이상이면 반드시 알아야 할 것' 정보형",
  },
  {
    keyword: "장애인 재택근무",
    volumeAvg: 526,
    volumeTotal: 6630,
    demographics: { female: "65%", age30s: "34%" },
    insight: "브이드림이 이미 검색 생태계 장악. 검색량 자체가 작아서 '해결책'이 아닌 '문제'에서 유입시켜야 함.",
    shortformOpp: "직접 키워드 타겟보다 부담금→재택근무 프레임 전환용",
  },
  {
    keyword: "장애인 고용부담금 계산",
    volumeAvg: 424,
    volumeTotal: 3882,
    demographics: { male: "67%", age30s: "42%" },
    cpc: "$3.86",
    peakMonth: "1월 (1,380회)",
    insight: "진단기 직접 유입 키워드. 자기 회사 부담금을 계산하려는 사람.",
    shortformOpp: "진단기 랜딩페이지 SEO + 숏폼 광고 타겟",
  },
  {
    keyword: "장애인 고용 부담금 기준",
    volumeAvg: 223,
    volumeTotal: 1287,
    trend: "+277%",
    demographics: { male: "59%", age30s: "39%", age40s: "28%" },
    insight: "급성장 키워드. 제도 기준 자체를 확인하려는 초기 단계.",
    shortformOpp: "교육형 숏폼으로 인지도 빌드업",
  },
  {
    keyword: "2026년 장애인 고용부담금",
    volumeAvg: 194,
    volumeTotal: 1463,
    demographics: { male: "92%", age40s: "38%", age30s: "38%" },
    peakMonth: "12월 (480회)",
    insight: "거의 전원 남성, 40대 집중. 경영진급이 연말에 검색하는 패턴.",
    shortformOpp: "'2026년 달라지는 부담금' 뉴스형 → CEO 타겟",
  },
];
```

#### 검색 여정 (PathFinder) 핵심 패턴:
```javascript
const SEARCH_JOURNEYS = [
  {
    name: "세무 처리 경로 (회계담당자)",
    path: "고용부담금 → 손금 불산입 → 경정청구 → 대법원 판결",
    persona: "회계·세무 담당자",
    insight: "부담금을 '세금 비용처리'로 인식. 경정청구 가능 여부 확인 중.",
    shortformFrame: "'부담금 손금 처리보다 더 좋은 방법이 있습니다' → 진단기",
  },
  {
    name: "채용 행동 경로 (HR 실무자)",
    path: "고용부담금 → 신고 → e신고 → 고용포털 → 채용공고",
    persona: "HR 담당자 (이미 채용 의사결정 완료)",
    insight: "부담금을 내다가 채용으로 전환하기로 결정한 사람. 실행 방법 탐색 중.",
    shortformFrame: "'e신고 전에 이것만 확인하세요' → 진단기",
  },
  {
    name: "벤치마킹 경로 (경영진)",
    path: "장애인 재택근무 → 쿠팡 장애인 재택근무 후기 → 브이드림",
    persona: "CEO/HR 관리자 (다른 기업 사례 탐색)",
    insight: "쿠팡 등 대기업 사례를 벤치마킹하려는 검색. FOMO 자극 가능.",
    shortformFrame: "'대기업이 이미 시작한 장애인 재택근무, 당신 회사는?' → 상담",
  },
  {
    name: "대안 탐색 경로 (비교 검토자)",
    path: "고용부담금 → 연계고용 → 도급계약 → 부담금 감면",
    persona: "HR 관리자 (직접채용 외 대안 검토)",
    insight: "직접 채용이 부담스러워서 연계고용을 검토하는 사람.",
    shortformFrame: "'연계고용 vs 직접채용, 뭐가 더 이득?' 비교형 → 진단기",
  },
  {
    name: "제도 이해 경로 (입문자)",
    path: "장애인 고용 → 장애인 고용촉진 → 고용법 → 고용부담금",
    persona: "HR 신입/이직자 (제도 처음 접하는 사람)",
    insight: "장애인 고용 제도 전반을 파악하려는 초기 탐색.",
    shortformFrame: "'신입 HR이 알아야 할 장애인 고용 ABC' 교육형 시리즈",
  },
];
```

#### 소비자 인식 클러스터 (ClusterFinder):
```javascript
const PERCEPTION_CLUSTERS = [
  {
    cluster: "세무/법률 클러스터",
    keywords: ["손금 불산입", "경정청구", "대법원 판결", "세무조정", "가산세"],
    insight: "부담금을 세무 이슈로 인식하는 그룹. 최근 대법원 판결이 화제.",
    opportunity: "세무사 크리에이터와 콜라보 → '부담금 안 내는 게 최선의 절세' 프레임",
  },
  {
    cluster: "신고/절차 클러스터",
    keywords: ["e신고", "신고 방법", "연계고용", "감면", "상시근로자 수 산정"],
    insight: "실무 절차를 처리해야 하는 담당자. 매년 1월 반복되는 업무.",
    opportunity: "'HR 실무자를 위한 신고 가이드' → 브이드림이 이 과정을 대행",
  },
  {
    cluster: "계산/비용 클러스터",
    keywords: ["부담금 계산", "기초액", "계산 방법", "요율", "상시근로자 기준"],
    insight: "자기 회사에 얼마가 부과되는지 확인하려는 사람. 진단기 직접 타겟.",
    opportunity: "진단기 SEO 최적화 + '30초 계산' 숏폼 광고",
  },
  {
    cluster: "브이드림/재택근무 클러스터",
    keywords: ["브이드림", "플립", "재택근무", "모두의잡", "브이드림 후기"],
    insight: "브이드림이 '장애인 재택근무' 검색에서 이미 독점적 위치.",
    opportunity: "브이드림 인지도 강화보다 '문제→해결책' 전환 경로 최적화",
  },
  {
    cluster: "쿠팡/대기업 사례 클러스터",
    keywords: ["쿠팡 장애인 재택근무", "쿠팡 장애인 후기", "삼성 장애인 채용"],
    insight: "대기업 사례를 벤치마킹하려는 검색. 기업·구직자 혼재.",
    opportunity: "'○○기업이 장애인 고용을 시작한 이유' 스토리텔링 숏폼",
  },
];
```

---

## 빌드 지침

### 폴더 구조
```
vdream-growth-engine/
├── app/
│   ├── layout.js
│   ├── page.js              # 메인 엔트리
│   ├── globals.css
│   └── api/
│       ├── diagnose/route.js   # Claude API: 직무추천
│       └── report/route.js     # Claude API: 리포트생성
├── components/
│   ├── DiagnosticTab.jsx
│   ├── ShortformTab.jsx
│   ├── CreatorTab.jsx
│   ├── CalendarTab.jsx
│   ├── SearchDataTab.jsx
│   └── ui/
│       ├── Card.jsx
│       ├── Badge.jsx
│       ├── ProgressBar.jsx
│       └── TabButton.jsx
├── data/
│   ├── searchData.js          # ListeningMind 하드코딩 데이터
│   ├── personas.js            # 타겟 페르소나 데이터
│   ├── creators.js            # 크리에이터 매칭 데이터
│   └── calendar.js            # 캠페인 캘린더 데이터
├── lib/
│   └── calculate.js           # 부담금 계산 로직
├── .env.local                 # ANTHROPIC_API_KEY
├── package.json
├── tailwind.config.js
├── next.config.js
└── GUIDE.md
```

### 핵심 구현 사항

1. **Claude API는 서버 사이드 API Route로 호출** — API 키 노출 방지
2. **진단기 계산은 클라이언트 사이드** — 즉각 반응
3. **AI 직무추천/리포트는 서버 API Route** — /api/diagnose, /api/report
4. **검색 데이터는 하드코딩** — 위 SEARCH_DATA, SEARCH_JOURNEYS, PERCEPTION_CLUSTERS
5. **반응형** — 모바일/데스크탑 대응 (Tailwind breakpoints)
6. **다크 테마 고정** — 브이드림 브랜드 컬러

### 환경변수
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 배포
```bash
# GitHub 연결
git init
git remote add origin https://github.com/pentacle123/vdream-growth-engine.git

# Vercel 배포
npx vercel --prod
# 또는 Vercel 대시보드에서 GitHub 연동 자동 배포
```

### 참고: 브이드림 회사 정보

- 회사명: (주)브이드림
- 대표: 김민지
- 설립: 2018년
- 핵심 제품: 플립(Flipped) — 장애인 특화 재택근무 인사관리 플랫폼
- 누적 고객사: 450~600개사 (신한라이프, 현대산업개발, 홈플러스, 차병원그룹 등)
- 장애인 인재풀: 30만명+
- 누적 채용: 24,000명+
- 매출: 2020년 5억 → 2023년 45억 → 2024년 150억 예상
- B2B SaaS 매출 비중: 90%
- 누적 투자: 약 130억원 (프리시리즈C 브릿지까지)
- 2026년 코스닥 상장 목표 (삼성증권 주관)
- 누적 고용부담금 절감: 8,300억원+
- 법적/노무 분쟁률: 0%
- 홈페이지: https://www.vdream.co.kr/
- USP: 재택근무 기반 → 편의시설 투자 불필요, 2~4주 내 도입
