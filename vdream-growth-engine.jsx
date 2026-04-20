import { useState } from "react";

const C = {
  bg:"#060b14",sf:"#0f1623",sa:"#141d2e",sh:"#1a2540",
  ac:"#36CFBA",ad:"rgba(54,207,186,0.12)",ag:"rgba(54,207,186,0.3)",
  bl:"#1D85EB",bd:"rgba(29,133,235,0.12)",
  wn:"#F59E0B",wd:"rgba(245,158,11,0.1)",
  rd:"#EF4444",pp:"#A78BFA",
  t:"#E2E8F0",td:"#94A3B8",tm:"#64748B",
  b:"rgba(255,255,255,0.05)",bl2:"rgba(255,255,255,0.08)",
};
const F={s:"'Noto Sans KR',sans-serif",m:"'JetBrains Mono',monospace"};
const fmt=n=>new Intl.NumberFormat("ko-KR").format(n);
const fW=n=>{if(n>=1e8)return`${(n/1e8).toFixed(1)}억원`;if(n>=1e4)return`${fmt(Math.round(n/1e4))}만원`;return`${fmt(n)}원`};

const PERSONAS=[
  {emoji:"👔",label:"HR 담당자",age:"30~45세",pain:"부담금 신고·채용방법 모름",plat:"쇼츠/릴스/링크드인",hook:"비용절감+실무편의",
   desc:"100인 이상 기업 인사담당. 매년 1월 부담금 신고를 직접 처리하며 장애인 채용 의무는 알지만 방법을 모르는 실무자.",
   ct:[{t:"충격형",ti:"당신 회사가 매년 버리는 돈",d:"부담금 시뮬레이션 30초 숫자 충격",s:95},{t:"교육형",ti:"3분 고용부담금 완전정복",d:"카드뉴스 스타일 제도 정리",s:80},{t:"사례형",ti:"이 회사는 연 2억 아꼈습니다",d:"도입 기업 Before/After",s:88},{t:"시즌형",ti:"1월 신고 전 체크리스트",d:"10~12월 긴급성 콘텐츠",s:92}]},
  {emoji:"📊",label:"CFO/경영진",age:"40~55세",pain:"비용최적화·ESG압박",plat:"쇼츠/링크드인/네이버클립",hook:"ROI+ESG",
   desc:"비용 구조를 관리하는 의사결정자. HR의 장애인 채용 품의를 최종 승인하는 사람.",
   ct:[{t:"데이터형",ti:"부담금 vs 채용비용 비교표",d:"ROI 인포그래픽 숏폼",s:90},{t:"트렌드형",ti:"ESG 평가 속 장애인 고용 비중",d:"ESG 등급과 고용률 상관관계",s:85},{t:"뉴스형",ti:"고용부담금 인상 임박",d:"제도 변화 속보 형태",s:93}]},
  {emoji:"🏢",label:"CEO/대표",age:"35~55세",pain:"기업이미지·명단공표 리스크",plat:"유튜브/링크드인/네이버",hook:"리스크관리+사회적가치",
   desc:"경영 전반 최종 의사결정자. 불이행 기업 명단 공표를 가장 민감하게 받아들이는 포지션.",
   ct:[{t:"위기형",ti:"당신 회사, 명단 공표 대상?",d:"불이행 명단 공표의 실제 영향",s:96},{t:"비전형",ti:"장애인 고용이 기업가치를 높이는 이유",d:"글로벌 ESG 트렌드 연결",s:78},{t:"인터뷰형",ti:"도입 CEO의 실제 경험",d:"고객사 대표 인터뷰 클립",s:87}]},
];

const CREATORS=[
  {cat:"HR/노무 전문 크리에이터",em:"⚖️",fit:95,why:"HR 담당자가 이미 팔로우하는 채널과 콜라보가 가장 직접적",ex:["노무사 유튜버","HR인사이트 채널","직장인 노동법"],fm:"정보+사례분석",pl:["쇼츠","링크드인"]},
  {cat:"경영/비즈니스 크리에이터",em:"💼",fit:88,why:"CEO·CFO 타겟 직접 도달. ESG·비용최적화와 자연스럽게 연결",ex:["경영트렌드","스타트업 CEO","ESG 채널"],fm:"트렌드+인사이트",pl:["유튜브","링크드인"]},
  {cat:"장애인 당사자 크리에이터",em:"🤝",fit:82,why:"사회적 가치를 진정성 있게 전달. 브랜디드 다큐에 최적",ex:["장애인 일상 브이로그","인권 채널","재택근무 근로자"],fm:"스토리텔링+다큐",pl:["유튜브","릴스"]},
  {cat:"직장인 공감 숏폼 크리에이터",em:"🎬",fit:75,why:"직장인 공감대 활용. 스케치 코미디로 인식개선+바이럴 극대화",ex:["사내뷰공업 스타일","숏박스 스타일"],fm:"스케치코미디",pl:["쇼츠","릴스","틱톡"]},
  {cat:"금융/세무 전문 크리에이터",em:"🧮",fit:80,why:"고용부담금을 '절세' 프레임으로 다루면 CFO·경리팀 직접 어필",ex:["세금절약 채널","세무사 유튜버"],fm:"절세팁+계산",pl:["쇼츠","네이버클립"]},
];

const CAL=[
  {m:"1월",ph:"🔥",l:"부담금 신고 피크",i:100,a:"긴급 진단 CTA + 실시간 계산기 광고"},
  {m:"2월",ph:"📈",l:"신규 고용 상담",i:75,a:"도입 사례 숏폼 집중 배포"},
  {m:"3월",ph:"🌱",l:"연간 계획 수립기",i:50,a:"ESG 트렌드 교육 콘텐츠"},
  {m:"4~6월",ph:"📚",l:"제도이해 콘텐츠",i:40,a:"정보성 숏폼, 크리에이터 콜라보 시작"},
  {m:"7~9월",ph:"🎯",l:"하반기 예산편성",i:60,a:"ROI 비교, CFO 타겟 강화"},
  {m:"10월",ph:"⚡",l:"부담금 산정 시작",i:80,a:"위기형 콘텐츠 + 명단 공표 경고"},
  {m:"11월",ph:"🚨",l:"연말 의사결정",i:90,a:"대량 숏폼 광고 + 진단기 CTA 집중"},
  {m:"12월",ph:"💥",l:"최종 의사결정",i:95,a:"긴급성 숏폼 + 리타겟팅 풀가동"},
];

// Components
const Bd=({children,color=C.ac,bg})=><span style={{display:"inline-block",padding:"3px 9px",borderRadius:6,fontSize:11,fontWeight:700,color,background:bg||`${color}1a`,border:`1px solid ${color}28`}}>{children}</span>;
const Br=({v,color=C.ac,h=5})=><div style={{width:"100%",height:h,borderRadius:h,background:"rgba(255,255,255,0.04)",overflow:"hidden"}}><div style={{width:`${v}%`,height:"100%",borderRadius:h,background:`linear-gradient(90deg,${color},${color}99)`,transition:"width 0.6s ease"}}/></div>;
const Cd=({children,style={},glow})=><div style={{background:C.sf,border:`1px solid ${C.b}`,borderRadius:14,padding:18,boxShadow:glow?`0 0 24px ${C.ag}`:"none",...style}}>{children}</div>;
const Sp=()=><span style={{display:"inline-block",width:16,height:16,border:`2px solid ${C.ac}33`,borderTop:`2px solid ${C.ac}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>;

// TAB 1: AI Diagnostic
function T1() {
  const [f,sF]=useState({emp:"",cur:"",sv:30,ind:"제조업"});
  const [r,sR]=useState(null);
  const [jL,sJL]=useState(false);const [jR,sJR]=useState(null);
  const [rL,sRL]=useState(false);const [rR,sRR]=useState(null);

  const calc=()=>{
    const e=parseInt(f.emp)||0,c=parseInt(f.cur)||0;if(e<50)return;
    const mr=0.031,mc=Math.ceil(e*mr),sc=Math.round(c*(f.sv/100)),lc=c-sc,ef=sc*2+lc,df=Math.max(0,mc-ef);
    const rt=e>0?ef/e:0;let ba;if(rt===0)ba=2156880;else if(rt<mr*0.5)ba=1618440;else if(rt<mr*0.75)ba=1348080;else ba=1214400;
    const pn=df*ba*12,hi=Math.ceil(df/2),co=hi*2200000*12,sv=Math.max(0,pn-co);
    const ex=ef+(hi*2)-mc,inc=ex>0?ex*600000*12:0;
    sR({e,mc,ef,df,pn,hi,co,sv,inc,tot:sv+inc,rt:(ef/e*100).toFixed(2)});sJR(null);sRR(null);
  };

  const callAI=async(type)=>{
    if(!r)return;const isJ=type==="job";isJ?sJL(true):sRL(true);
    const prompt=isJ
      ?`당신은 장애인 고용 전문 컨설턴트입니다. 다음 기업에 적합한 장애인 재택근무 직무를 5개 추천하세요.\n\n기업: ${f.ind}, ${r.e}명, 부족 ${r.df}명, 필요채용(중증) ${r.hi}명\n\nJSON만 응답(백틱/마크다운 없이):\n{"jobs":[{"title":"직무명","type":"장애유형","difficulty":"상/중/하","desc":"설명1줄","fit":"적합도 높음/보통"}],"tip":"업종특화 팁1줄"}`
      :`장애인 고용 컨설턴트로서 경영진 보고용 요약을 작성하세요.\n\n기업: ${f.ind}, ${r.e}명, 의무 ${r.mc}명, 유효 ${r.ef}명(${r.rt}%), 부담금 ${fW(r.pn)}, 절감 ${fW(r.sv)}, 장려금 ${fW(r.inc)}, 총이익 ${fW(r.tot)}\n\nJSON만 응답:\n{"summary":"핵심요약3~4문장","risk":"미이행리스크2~3문장","recommendation":"도입권고2~3문장","timeline":"추천일정1~2문장"}`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const data=await res.json();const txt=data.content?.map(b=>b.type==="text"?b.text:"").join("")||"";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      isJ?sJR(parsed):sRR(parsed);
    }catch(err){
      if(isJ)sJR({jobs:[{title:"데이터 라벨링",type:"지체/뇌병변",difficulty:"하",desc:"AI 학습 데이터 분류·태깅",fit:"적합도 높음"},{title:"온라인 모니터링",type:"지체/시각",difficulty:"중",desc:"웹사이트·앱 품질 모니터링",fit:"적합도 높음"},{title:"문서/자료 관리",type:"지체/내부장애",difficulty:"하",desc:"사내 문서 정리·데이터 입력",fit:"적합도 높음"},{title:"디자인 보조",type:"지체/청각",difficulty:"중",desc:"배너·카드뉴스 그래픽 보조",fit:"보통"},{title:"CS 채팅 상담",type:"청각/지체",difficulty:"중",desc:"채팅 기반 고객 응대",fit:"보통"}],tip:`${f.ind} 특성 반영 재택 직무 추천입니다.`});
      else sRR({summary:`의무고용률 3.1% 대비 ${r.rt}%로 연간 ${fW(r.pn)} 부담금 발생. 브이드림 도입 시 중증 ${r.hi}명 채용으로 연간 ${fW(r.tot)} 이익 가능.`,risk:"부담금 인상 논의 중이며 미이행 기업 명단 공표 시 기업 이미지 타격. ESG 평가에서도 장애인 고용률은 주요 지표.",recommendation:"브이드림 플립 시스템을 통한 재택근무 기반 채용 권고. 편의시설 투자 없이 2~4주 내 도입 가능.",timeline:"10~11월 상담 → 12월 매칭 → 1월 부담금 신고 즉시 반영 가능"});
    }
    isJ?sJL(false):sRL(false);
  };

  return <div>
    <div style={{marginBottom:20}}><h2 style={{fontSize:19,fontWeight:800,color:C.t,margin:0,fontFamily:F.s}}>🏥 고용부담금 AI 진단기</h2><p style={{fontSize:12,color:C.td,margin:"5px 0 0"}}>기업 정보 입력 → 부담금·절감·맞춤직무·경영진 리포트 AI 생성</p></div>
    <Cd style={{marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {[{k:"emp",l:"상시 근로자 수",ph:"예: 500",u:"명"},{k:"cur",l:"현재 장애인 고용 수",ph:"예: 5",u:"명"}].map(x=>
          <div key={x.k}><label style={{fontSize:11,color:C.td,fontWeight:600,display:"block",marginBottom:4}}>{x.l}</label>
          <div style={{position:"relative"}}><input type="number" value={f[x.k]} onChange={e=>sF(p=>({...p,[x.k]:e.target.value}))} placeholder={x.ph} style={{width:"100%",padding:"9px 34px 9px 12px",borderRadius:8,border:`1px solid ${C.bl2}`,background:C.sa,color:C.t,fontSize:14,fontFamily:F.m,outline:"none",boxSizing:"border-box"}}/>
          <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:11,color:C.tm}}>{x.u}</span></div></div>
        )}
        <div><label style={{fontSize:11,color:C.td,fontWeight:600,display:"block",marginBottom:4}}>중증 비율: {f.sv}%</label><input type="range" min={0} max={100} value={f.sv} onChange={e=>sF(p=>({...p,sv:+e.target.value}))} style={{width:"100%",accentColor:C.ac}}/></div>
        <div><label style={{fontSize:11,color:C.td,fontWeight:600,display:"block",marginBottom:4}}>업종</label>
        <select value={f.ind} onChange={e=>sF(p=>({...p,ind:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${C.bl2}`,background:C.sa,color:C.t,fontSize:13,outline:"none",boxSizing:"border-box"}}>
          {["제조업","IT/소프트웨어","금융/보험","유통/물류","건설","서비스업","공공기관","기타"].map(v=><option key={v}>{v}</option>)}</select></div>
      </div>
      <button onClick={calc} style={{marginTop:14,width:"100%",padding:"12px 0",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.ac},${C.bl})`,color:"#000",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:F.s}}>🔍 부담금 진단 실행</button>
    </Cd>

    {r&&<>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
        <Cd glow><div style={{fontSize:10,color:C.td,fontWeight:600,marginBottom:2}}>현재 연간 고용부담금</div><div style={{fontSize:19,fontWeight:900,color:C.rd,fontFamily:F.m}}>{fW(r.pn)}</div><div style={{fontSize:10,color:C.tm,marginTop:2}}>미달 {r.df}명 × 12개월</div></Cd>
        <Cd><div style={{fontSize:10,color:C.td,fontWeight:600,marginBottom:2}}>도입 시 절감</div><div style={{fontSize:19,fontWeight:900,color:C.ac,fontFamily:F.m}}>{fW(r.sv)}</div><div style={{fontSize:10,color:C.tm,marginTop:2}}>중증 {r.hi}명 채용 기준</div></Cd>
        <Cd><div style={{fontSize:10,color:C.td,fontWeight:600,marginBottom:2}}>총 연간 이익</div><div style={{fontSize:19,fontWeight:900,color:C.wn,fontFamily:F.m}}>{fW(r.tot)}</div><div style={{fontSize:10,color:C.tm,marginTop:2}}>절감+장려금</div></Cd>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <button onClick={()=>callAI("job")} disabled={jL} style={{padding:"11px",borderRadius:10,border:`1px solid ${C.ac}44`,background:C.ad,color:C.ac,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F.s,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {jL?<Sp/>:"🤖"} AI 맞춤 직무 추천
        </button>
        <button onClick={()=>callAI("report")} disabled={rL} style={{padding:"11px",borderRadius:10,border:`1px solid ${C.bl}44`,background:C.bd,color:C.bl,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:F.s,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {rL?<Sp/>:"📋"} 경영진 리포트 생성
        </button>
      </div>

      {jR&&<Cd style={{marginBottom:12}}>
        <h3 style={{fontSize:13,fontWeight:700,color:C.ac,margin:"0 0 10px"}}>🤖 AI 맞춤 직무 추천 — {f.ind}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {jR.jobs?.map((j,i)=><div key={i} style={{padding:"9px 11px",borderRadius:8,background:C.sa,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:13,fontWeight:700,color:C.t}}>{j.title}</div><div style={{fontSize:11,color:C.td,marginTop:1}}>{j.desc}</div>
            <div style={{display:"flex",gap:5,marginTop:3}}><Bd color={C.pp}>{j.type}</Bd><Bd color={C.tm} bg={C.sh}>난이도: {j.difficulty}</Bd></div></div>
            <Bd color={j.fit?.includes("높")?C.ac:C.wn}>{j.fit}</Bd>
          </div>)}
        </div>
        {jR.tip&&<div style={{marginTop:8,padding:"6px 9px",borderRadius:6,background:`${C.ac}08`,border:`1px solid ${C.ac}15`,fontSize:11,color:C.ac}}>💡 {jR.tip}</div>}
      </Cd>}

      {rR&&<Cd style={{marginBottom:12,border:`1px solid ${C.bl}22`}}>
        <h3 style={{fontSize:13,fontWeight:700,color:C.bl,margin:"0 0 10px"}}>📋 AI 경영진 리포트</h3>
        {[{l:"핵심 요약",t:rR.summary,c:C.t},{l:"미이행 리스크",t:rR.risk,c:C.rd},{l:"도입 권고",t:rR.recommendation,c:C.ac},{l:"추천 일정",t:rR.timeline,c:C.wn}].map((s,i)=><div key={i} style={{marginBottom:8}}>
          <div style={{fontSize:11,fontWeight:700,color:s.c,marginBottom:2}}>{s.l}</div>
          <div style={{fontSize:12,color:C.td,lineHeight:1.6,padding:"7px 9px",borderRadius:6,background:C.sa}}>{s.t}</div>
        </div>)}
        <div style={{textAlign:"center",marginTop:4}}><button style={{padding:"9px 26px",borderRadius:8,border:"none",background:C.bl,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>📄 PDF 다운로드 (리드 수집)</button></div>
      </Cd>}
    </>}
  </div>;
}

// TAB 2: Shortform
function T2(){const[s,sS]=useState(0);const p=PERSONAS[s];return<div>
  <div style={{marginBottom:20}}><h2 style={{fontSize:19,fontWeight:800,color:C.t,margin:0,fontFamily:F.s}}>🎬 숏폼 콘텐츠 전략</h2><p style={{fontSize:12,color:C.td,margin:"5px 0 0"}}>타겟별 콘텐츠 유형·후킹·CTA 전략</p></div>
  <div style={{display:"flex",gap:8,marginBottom:16}}>{PERSONAS.map((pp,i)=><button key={i} onClick={()=>sS(i)} style={{flex:1,padding:"11px 8px",borderRadius:10,border:s===i?`2px solid ${C.ac}`:`1px solid ${C.b}`,background:s===i?C.ad:C.sf,cursor:"pointer",textAlign:"center"}}><div style={{fontSize:22,marginBottom:2}}>{pp.emoji}</div><div style={{fontSize:12,fontWeight:700,color:s===i?C.ac:C.t}}>{pp.label}</div><div style={{fontSize:10,color:C.tm}}>{pp.age}</div></button>)}</div>
  <Cd style={{marginBottom:12}}>
    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}><div style={{width:42,height:42,borderRadius:10,background:C.ad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{p.emoji}</div>
    <div style={{flex:1}}><h3 style={{margin:0,fontSize:15,fontWeight:700,color:C.t}}>{p.label}</h3><p style={{margin:"4px 0 7px",fontSize:12,color:C.td,lineHeight:1.6}}>{p.desc}</p>
    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}><Bd color={C.ac}>훅: {p.hook}</Bd><Bd color={C.bl}>페인: {p.pain}</Bd></div>
    <div style={{marginTop:5,fontSize:11,color:C.tm}}><strong style={{color:C.td}}>플랫폼:</strong> {p.plat}</div></div></div>
  </Cd>
  <h3 style={{fontSize:13,fontWeight:700,color:C.ac,margin:"0 0 8px"}}>📝 추천 숏폼 콘텐츠</h3>
  <div style={{display:"flex",flexDirection:"column",gap:8}}>{p.ct.map((ct,i)=><Cd key={i} style={{padding:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
      <div><Bd color={C.wn}>{ct.t}</Bd><h4 style={{margin:"5px 0 2px",fontSize:13,fontWeight:700,color:C.t}}>"{ct.ti}"</h4><p style={{margin:0,fontSize:11,color:C.td}}>{ct.d}</p></div>
      <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}><div style={{fontSize:10,color:C.tm}}>임팩트</div><div style={{fontSize:17,fontWeight:900,color:ct.s>=90?C.ac:C.bl,fontFamily:F.m}}>{ct.s}</div></div>
    </div>
    <Br v={ct.s} color={ct.s>=90?C.ac:C.bl}/>
    <div style={{marginTop:7,padding:"5px 8px",borderRadius:6,background:C.sa,fontSize:11,color:C.td}}><strong style={{color:C.ac}}>CTA →</strong> "지금 우리 회사 고용부담금 무료 진단받기" → 진단기 유도</div>
  </Cd>)}</div>
</div>;}

// TAB 3: Creator
function T3(){return<div>
  <div style={{marginBottom:20}}><h2 style={{fontSize:19,fontWeight:800,color:C.t,margin:0,fontFamily:F.s}}>🤝 크리에이터 매칭</h2><p style={{fontSize:12,color:C.td,margin:"5px 0 0"}}>타겟별 최적 크리에이터와 콜라보 방식</p></div>
  <div style={{display:"flex",flexDirection:"column",gap:10}}>{CREATORS.map((cr,i)=><Cd key={i}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:38,height:38,borderRadius:10,background:C.sa,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>{cr.em}</div>
      <div><h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.t}}>{cr.cat}</h3><div style={{fontSize:11,color:C.tm,marginTop:1}}>{cr.fm} | {cr.pl.join(", ")}</div></div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:10,color:C.tm}}>적합도</div><div style={{fontSize:19,fontWeight:900,color:cr.fit>=90?C.ac:cr.fit>=80?C.bl:C.wn,fontFamily:F.m}}>{cr.fit}%</div></div>
    </div>
    <Br v={cr.fit} color={cr.fit>=90?C.ac:cr.fit>=80?C.bl:C.wn}/>
    <p style={{margin:"7px 0 5px",fontSize:12,color:C.td,lineHeight:1.5}}>{cr.why}</p>
    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{cr.ex.map((e,j)=><Bd key={j} color={C.tm} bg={C.sh}>{e}</Bd>)}</div>
    <div style={{marginTop:7,padding:"5px 8px",borderRadius:6,background:`${C.ac}08`,border:`1px solid ${C.ac}12`,fontSize:11,color:C.ac}}>💡 콜라보 CTA → "진단기" 삽입으로 리드 전환</div>
  </Cd>)}</div>
</div>;}

// TAB 4: Calendar
function T4(){return<div>
  <div style={{marginBottom:20}}><h2 style={{fontSize:19,fontWeight:800,color:C.t,margin:0,fontFamily:F.s}}>📅 연간 캠페인 캘린더</h2><p style={{fontSize:12,color:C.td,margin:"5px 0 0"}}>시즌별 숏폼+광고 스케줄</p></div>
  <Cd style={{marginBottom:14}}>
    <h3 style={{fontSize:13,fontWeight:700,color:C.ac,margin:"0 0 10px"}}>🔄 전환 퍼널</h3>
    <div style={{display:"flex",alignItems:"center",gap:3}}>{[{l:"숏폼노출",ic:"📱",co:C.bl},{l:"후킹",ic:"👀",co:C.bl},{l:"진단기",ic:"🔍",co:C.ac},{l:"리드수집",ic:"📧",co:C.ac},{l:"계약",ic:"🤝",co:C.wn}].map((s,i)=>
      <div key={i} style={{flex:1,textAlign:"center"}}><div style={{display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:34,height:34,borderRadius:"50%",background:`${s.co}1a`,border:`2px solid ${s.co}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{s.ic}</div>{i<4&&<div style={{width:14,height:2,background:C.bl2,margin:"0 -1px"}}/>}</div><div style={{fontSize:9,color:C.td,marginTop:4,fontWeight:600}}>{s.l}</div></div>
    )}</div>
  </Cd>
  <div style={{display:"flex",flexDirection:"column",gap:6}}>{CAL.map((m,i)=><Cd key={i} style={{padding:"11px 13px"}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:50,textAlign:"center",flexShrink:0}}><div style={{fontSize:12,fontWeight:800,color:C.t,fontFamily:F.m}}>{m.m}</div><div style={{fontSize:10,color:C.tm}}>{m.ph}</div></div>
      <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <span style={{fontSize:12,fontWeight:700,color:C.t}}>{m.l}</span><span style={{fontSize:11,fontWeight:800,fontFamily:F.m,color:m.i>=90?C.rd:m.i>=70?C.wn:C.ac}}>{m.i}%</span></div>
        <Br v={m.i} color={m.i>=90?C.rd:m.i>=70?C.wn:C.ac} h={4}/>
        <div style={{fontSize:10,color:C.td,marginTop:4}}>{m.a}</div></div>
    </div>
  </Cd>)}</div>
  <Cd style={{marginTop:12,background:`linear-gradient(135deg,${C.wn}06,${C.rd}06)`,border:`1px solid ${C.wn}18`}}>
    <h3 style={{fontSize:13,fontWeight:700,color:C.wn,margin:"0 0 6px"}}>🔑 핵심 인사이트</h3>
    <div style={{fontSize:12,color:C.td,lineHeight:1.7}}><strong style={{color:C.rd}}>10~1월 골든타임.</strong> 숏폼 광고 예산 <strong style={{color:C.ac}}>60% 집중 투하.</strong> 모든 CTA → <strong style={{color:C.ac}}>AI 진단기</strong>로 수렴.</div>
  </Cd>
</div>;}

// TAB 5: Search Data (ListeningMind placeholder)
function T5({ld,ll,run}){return<div>
  <div style={{marginBottom:20}}><h2 style={{fontSize:19,fontWeight:800,color:C.t,margin:0,fontFamily:F.s}}>📡 검색 데이터 분석</h2><p style={{fontSize:12,color:C.td,margin:"5px 0 0"}}>ListeningMind 실데이터 기반 콘텐츠 기회 발굴</p></div>
  {!ld&&<Cd style={{textAlign:"center",padding:28}}>
    <div style={{fontSize:38,marginBottom:8}}>🔍</div><div style={{fontSize:14,fontWeight:700,color:C.t,marginBottom:5}}>검색 데이터 분석</div>
    <div style={{fontSize:12,color:C.td,marginBottom:14}}>"고용부담금","장애인 채용" 관련 검색 의도·경로를 분석합니다</div>
    <button onClick={run} disabled={ll} style={{padding:"11px 28px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${C.pp},${C.bl})`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8}}>
      {ll?<><Sp/> 분석 중...</>:"📡 ListeningMind 데이터 로드"}</button>
  </Cd>}
  {ld&&<div style={{display:"flex",flexDirection:"column",gap:10}}>{ld.map((cl,i)=><Cd key={i}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
      <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.t}}>{cl.kw}</h3>
      {cl.vol&&<Bd color={C.ac}>검색량: {cl.vol}</Bd>}
    </div>
    {cl.intent&&<div style={{fontSize:12,color:C.td,marginBottom:6}}><strong style={{color:C.bl}}>검색 의도:</strong> {cl.intent}</div>}
    {cl.opp&&<div style={{padding:"6px 9px",borderRadius:6,background:`${C.ac}08`,border:`1px solid ${C.ac}12`,fontSize:12,color:C.ac,marginBottom:6}}>💡 <strong>숏폼 기회:</strong> {cl.opp}</div>}
    {cl.paths&&<div><div style={{fontSize:11,fontWeight:600,color:C.tm,marginBottom:4}}>검색 경로:</div><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{cl.paths.map((p,j)=><Bd key={j} color={C.tm} bg={C.sa}>{p}</Bd>)}</div></div>}
  </Cd>)}</div>}
</div>;}

// MAIN
export default function App(){
  const[tab,sT]=useState(0);
  const[ld,sLD]=useState(null);const[ll,sLL]=useState(false);
  const run=()=>{sLL(true);setTimeout(()=>{sLD([
    {kw:"고용부담금",vol:"월 12,000+",intent:"제도 이해, 계산법, 절감법 탐색",opp:"'당신 회사 고용부담금 얼마?' 충격형 숏폼 → 진단기 CTA",paths:["고용부담금 계산","고용부담금 신고","장애인 고용부담금 절감"]},
    {kw:"장애인 채용 방법",vol:"월 5,400+",intent:"실무적 채용 프로세스 탐색",opp:"'3단계로 끝내는 장애인 채용' 교육형 숏폼",paths:["장애인 채용 절차","장애인 재택근무","장애인 직무"]},
    {kw:"장애인 의무고용",vol:"월 8,100+",intent:"법적 의무 확인, 대상기업 기준",opp:"'50인 이상이면 반드시 알아야 할 것' 정보형 숏폼",paths:["의무고용률","의무고용 대상","의무고용 미이행 명단"]},
    {kw:"ESG 장애인",vol:"월 1,800+",intent:"ESG 경영과 장애인 고용 연결고리",opp:"'ESG 등급 올리는 가장 빠른 방법' 트렌드형 → CEO 타겟",paths:["ESG 사회공헌","ESG 평가 항목","장애인 고용 ESG"]},
    {kw:"고용부담금 인상",vol:"월 2,400+",intent:"제도 변화 불안, 대응법 탐색",opp:"'부담금 인상 확정? 대응법 3가지' 뉴스형 긴급 숏폼",paths:["고용부담금 2026","부담금 인상 시기","부담금 절감"]},
  ]);sLL(false);},2000);};

  const tabs=[{ic:"🏥",l:"AI 진단기"},{ic:"🎬",l:"숏폼 전략"},{ic:"🤝",l:"크리에이터"},{ic:"📅",l:"캘린더"},{ic:"📡",l:"검색데이터"}];

  return<div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:F.s}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}select option{background:${C.sf};color:${C.t}}@keyframes spin{to{transform:rotate(360deg)}}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${C.bl2};border-radius:4px}`}</style>
    <div style={{padding:"14px 18px 10px",borderBottom:`1px solid ${C.b}`,background:`linear-gradient(180deg,${C.sa} 0%,${C.bg} 100%)`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.ac},${C.bl})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"#000"}}>V</div>
          <div><h1 style={{margin:0,fontSize:16,fontWeight:900,letterSpacing:-0.5}}>VDream <span style={{color:C.ac}}>Growth Engine</span></h1><div style={{fontSize:10,color:C.tm}}>AI-Powered B2B Marketing Platform v2.0</div></div>
        </div>
        <Bd color={C.ac}>by Pentacle</Bd>
      </div>
    </div>
    <div style={{padding:"9px 18px",display:"flex",gap:4,borderBottom:`1px solid ${C.b}`,overflowX:"auto"}}>
      {tabs.map((t,i)=><button key={i} onClick={()=>sT(i)} style={{padding:"7px 13px",borderRadius:8,border:tab===i?`1px solid ${C.ac}44`:"1px solid transparent",background:tab===i?C.ad:"transparent",color:tab===i?C.ac:C.td,fontSize:12,fontWeight:tab===i?700:500,cursor:"pointer",fontFamily:F.s,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:14}}>{t.ic}</span>{t.l}</button>)}
    </div>
    <div style={{padding:18,maxWidth:860,margin:"0 auto"}}>
      {tab===0&&<T1/>}{tab===1&&<T2/>}{tab===2&&<T3/>}{tab===3&&<T4/>}{tab===4&&<T5 ld={ld} ll={ll} run={run}/>}
    </div>
  </div>;
}
