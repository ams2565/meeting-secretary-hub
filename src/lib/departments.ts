export type SkillStatus = "live" | "soon";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  status: SkillStatus;
  href?: string;
}

export interface Department {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  icon: string;
  accent: {
    text: string;
    bg: string;
    ring: string;
    dot: string;
  };
  skills: Skill[];
}

export const departments: Department[] = [
  {
    id: "dev",
    name: "개발",
    subtitle: "빌드 팀",
    tagline: "기획부터 완성까지 개발 전 과정을 빠르게.",
    icon: "🛠️",
    accent: {
      text: "text-orange-400",
      bg: "bg-orange-500/10",
      ring: "ring-orange-500/30",
      dot: "bg-orange-500",
    },
    skills: [
      {
        slug: "superpowers",
        name: "Superpowers",
        description: "코드 작성 전 설계와 계획을 먼저 세우고 개발",
        status: "live",
        href: "/tools/superpowers",
      },
      {
        slug: "verification",
        name: "Verification",
        description: "완료라고 말하기 전 실제로 실행해 결과 확인",
        status: "live",
        href: "/tools/verification",
      },
      {
        slug: "systematic-debug",
        name: "Systematic Debug",
        description: "버그를 임시로 덮지 않고 근본 원인부터 파악",
        status: "live",
        href: "/tools/root-cause-debug",
      },
      {
        slug: "context7",
        name: "Context7",
        description: "최신 공식 문서를 불러와 잘못된 코드 생성 방지",
        status: "live",
        href: "/tools/context7",
      },
      {
        slug: "skill-creator",
        name: "Skill Creator",
        description: "반복하는 작업을 재사용 가능한 스킬로 제작",
        status: "live",
        href: "/tools/skill-creator",
      },
      {
        slug: "mcp-builder",
        name: "MCP Builder",
        description: "외부 서비스를 Claude와 연결하는 서버 구축",
        status: "live",
        href: "/tools/mcp-builder",
      },
      {
        slug: "app-builder",
        name: "App Builder",
        description: "대화로 작은 웹 도구를 함께 만들고 실제 주소로 배포",
        status: "live",
        href: "/tools/app-builder",
      },
    ],
  },
  {
    id: "design",
    name: "디자인",
    subtitle: "디자인 스튜디오",
    tagline: "어디서 본 듯한 디자인 말고, 개성 있게.",
    icon: "🎨",
    accent: {
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      ring: "ring-purple-500/30",
      dot: "bg-purple-500",
    },
    skills: [
      {
        slug: "ui-ux-pro-max",
        name: "UI/UX Pro Max",
        description: "84가지 스타일로 완성형 디자인 자동 설계",
        status: "live",
        href: "/tools/uiux-pro-max",
      },
      {
        slug: "taste-skill",
        name: "Taste Skill",
        description: "뻔하지 않은 감각적인 화면 제작",
        status: "live",
        href: "/tools/taste-skill",
      },
      {
        slug: "frontend-design",
        name: "Frontend Design",
        description: "어디서 본 듯한 UI 대신 개성 있는 화면으로",
        status: "live",
        href: "/tools/frontend-design",
      },
      {
        slug: "web-artifacts",
        name: "Web Artifacts",
        description: "여러 화면·기능이 얽힌 웹앱 화면 제작",
        status: "live",
        href: "/tools/web-artifacts",
      },
      {
        slug: "canvas-design",
        name: "Canvas Design",
        description: "포스터·이미지를 PNG·PDF로 제작",
        status: "live",
        href: "/tools/canvas-design",
      },
      {
        slug: "algorithmic-art",
        name: "Algorithmic Art",
        description: "코드로 만드는 예술적인 그래픽",
        status: "live",
        href: "/tools/algorithmic-art",
      },
    ],
  },
  {
    id: "marketing",
    name: "마케팅",
    subtitle: "성장 엔진",
    tagline: "전환되는 카피·SEO·광고를 자동으로.",
    icon: "📈",
    accent: {
      text: "text-rose-400",
      bg: "bg-rose-500/10",
      ring: "ring-rose-500/30",
      dot: "bg-rose-500",
    },
    skills: [
      {
        slug: "claude-seo",
        name: "Claude SEO",
        description: "사이트 SEO를 통째로 진단·개선",
        status: "live",
        href: "/tools/site-seo",
      },
      {
        slug: "claude-ads",
        name: "Claude Ads",
        description: "광고 계정 분석해 성과·예산 최적화",
        status: "live",
        href: "/tools/claude-ads",
      },
      {
        slug: "cro",
        name: "CRO",
        description: "방문자가 가입·구매하게 페이지 개선",
        status: "live",
        href: "/tools/cro",
      },
      {
        slug: "mktg-psychology",
        name: "Marketing Psychology",
        description: "사람 심리를 활용한 설득 전략 적용",
        status: "live",
        href: "/tools/persuasive-copy",
      },
      {
        slug: "programmatic-seo",
        name: "Programmatic SEO",
        description: "데이터로 검색 노출 페이지 대량 생성",
        status: "live",
        href: "/tools/programmatic-seo",
      },
      {
        slug: "ai-seo",
        name: "AI SEO",
        description: "AI 검색 답변에 내 콘텐츠 인용되게",
        status: "live",
        href: "/tools/ai-seo",
      },
    ],
  },
  {
    id: "social",
    name: "소셜·콘텐츠",
    subtitle: "콘텐츠 머신",
    tagline: "알고리즘에 콘텐츠를 자동으로 공급.",
    icon: "📣",
    accent: {
      text: "text-indigo-400",
      bg: "bg-indigo-500/10",
      ring: "ring-indigo-500/30",
      dot: "bg-indigo-500",
    },
    skills: [
      {
        slug: "claude-blog",
        name: "Claude Blog",
        description: "SEO 최적화된 블로그 글 통째로 작성",
        status: "live",
        href: "/tools/blog-writer",
      },
      {
        slug: "social",
        name: "Social",
        description: "플랫폼별 소셜 게시물 기획·제작",
        status: "live",
        href: "/tools/social-posts",
      },
      {
        slug: "content-strategy",
        name: "Content Strategy",
        description: "뭘 만들지 콘텐츠 주제·계획 설계",
        status: "live",
        href: "/tools/content-plan",
      },
      {
        slug: "video",
        name: "Video",
        description: "AI로 영상 스크립트·제작",
        status: "live",
        href: "/tools/video-script",
      },
      {
        slug: "pillar-content",
        name: "Pillar Content",
        description: "검색 권위 잡는 콘텐츠 구조 설계",
        status: "live",
        href: "/tools/pillar-content",
      },
      {
        slug: "email-sequence",
        name: "Email Sequence",
        description: "자동 발송되는 이메일 시리즈 제작",
        status: "live",
        href: "/tools/email-sequence",
      },
    ],
  },
  {
    id: "finance",
    name: "재무",
    subtitle: "CFO",
    tagline: "돈 쓰기 전에 숫자부터 모델링.",
    icon: "💰",
    accent: {
      text: "text-emerald-400",
      bg: "bg-emerald-500/10",
      ring: "ring-emerald-500/30",
      dot: "bg-emerald-500",
    },
    skills: [
      {
        slug: "dcf-model",
        name: "DCF Model",
        description: "미래 현금흐름으로 기업 가치 계산",
        status: "live",
        href: "/tools/dcf-model",
      },
      {
        slug: "3-statements",
        name: "3 Statements",
        description: "손익·재무·현금흐름표 연동 모델 작성",
        status: "live",
        href: "/tools/finance-model",
      },
      {
        slug: "lbo-model",
        name: "LBO Model",
        description: "차입 인수(LBO) 수익률 모델 완성",
        status: "live",
        href: "/tools/lbo-model",
      },
      {
        slug: "comps-analysis",
        name: "Comps Analysis",
        description: "비슷한 기업과 비교해 가치 산정",
        status: "live",
        href: "/tools/comps-analysis",
      },
      {
        slug: "pitch-deck",
        name: "Pitch Deck",
        description: "자료로 투자 피치덱 자동 채우기",
        status: "live",
        href: "/tools/pitch-deck",
      },
      {
        slug: "finance-skills",
        name: "Finance Skills",
        description: "밸류·포트폴리오 재무 81종 확장팩",
        status: "live",
        href: "/tools/finance-skills",
      },
    ],
  },
  {
    id: "ops",
    name: "운영",
    subtitle: "운영 척추",
    tagline: "회사를 기계처럼 굴리기.",
    icon: "⚙️",
    accent: {
      text: "text-lime-400",
      bg: "bg-lime-500/10",
      ring: "ring-lime-500/30",
      dot: "bg-lime-500",
    },
    skills: [
      {
        slug: "meeting-summary",
        name: "회의록 자동 요약",
        description: "회의 내용을 붙여넣으면 요약·결정사항·액션아이템 정리",
        status: "live",
        href: "/tools/meeting-summary",
      },
      {
        slug: "email-draft",
        name: "후속 이메일 초안",
        description: "회의 요약을 바탕으로 참석자에게 보낼 이메일 초안 작성",
        status: "live",
        href: "/tools/email-draft",
      },
      {
        slug: "sop-builder",
        name: "SOP Builder",
        description: "업무 절차를 단계별 매뉴얼로 정리",
        status: "live",
        href: "/tools/sop-builder",
      },
      {
        slug: "incident-postmortem",
        name: "Incident Postmortem",
        description: "사고 원인·재발방지 보고서 작성",
        status: "live",
        href: "/tools/incident-postmortem",
      },
      {
        slug: "business-case",
        name: "Business Case",
        description: "비용·수익 따져 사업 타당성 분석",
        status: "live",
        href: "/tools/business-case",
      },
      {
        slug: "launch-runbook",
        name: "Launch Runbook",
        description: "출시 체크리스트·비상 대응 계획",
        status: "live",
        href: "/tools/launch-runbook",
      },
    ],
  },
  {
    id: "legal",
    name: "법무",
    subtitle: "법무 데스크",
    tagline: "깨알 계약서, 대신 읽어주기.",
    icon: "⚖️",
    accent: {
      text: "text-slate-400",
      bg: "bg-slate-500/10",
      ring: "ring-slate-500/30",
      dot: "bg-slate-500",
    },
    skills: [
      {
        slug: "contract-review",
        name: "Contract Review",
        description: "계약서 위험 조항 찾아 수정안 제시",
        status: "live",
        href: "/tools/contract-review",
      },
      {
        slug: "ai-legal-claude",
        name: "AI Legal Claude",
        description: "계약 검토·NDA·협상까지 법무 전반",
        status: "live",
        href: "/tools/legal-consult",
      },
      {
        slug: "legal-risks",
        name: "Legal Risks",
        description: "조항별 법적 위험 정도 평가",
        status: "live",
        href: "/tools/legal-risk",
      },
      {
        slug: "compliance",
        name: "Compliance",
        description: "GDPR 등 개인정보 규제 점검",
        status: "live",
        href: "/tools/compliance",
      },
      {
        slug: "docx",
        name: "DOCX",
        description: "워드 문서 작성·변경 추적",
        status: "live",
        href: "/tools/docx",
      },
      {
        slug: "sql-queries",
        name: "SQL Queries",
        description: "SQL로 데이터 조회·추출",
        status: "live",
        href: "/tools/sql-queries",
      },
    ],
  },
];

export function findLiveSkill(slug: string): { department: Department; skill: Skill } | null {
  for (const department of departments) {
    const skill = department.skills.find((s) => s.slug === slug && s.status === "live");
    if (skill) return { department, skill };
  }
  return null;
}
