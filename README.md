# 회의비서팀 자동화 허브

Claude Opus 5 API로 동작하는 부서별 자동화 대시보드입니다. 7개 부서(개발/디자인/마케팅/소셜·콘텐츠/재무/운영/법무) 카드가 전체 뼈대로 구성되어 있고, 그중 **운영** 부서의 두 스킬이 실제로 동작합니다.

## 실제로 동작하는 스킬

- **회의록 자동 요약** (`/tools/meeting-summary`) — 회의 내용을 붙여넣으면 요약·결정사항·액션아이템으로 정리
- **후속 이메일 초안** (`/tools/email-draft`) — 회의 요약을 바탕으로 참석자에게 보낼 이메일 초안 작성

나머지 부서/스킬은 카드 UI만 있고 "준비중"으로 표시됩니다.

## 시작하기

1. Anthropic API 키 발급: https://console.anthropic.com
2. `.env.local` 파일에 키 입력:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. 의존성 설치 및 개발 서버 실행:
   ```bash
   npm install
   npm run dev
   ```
4. http://localhost:3000 접속

## 참고

- Turbopack이 비-ASCII(한글) 경로에서 패닉을 일으키는 버그가 있어, `dev`/`build` 스크립트는 `--webpack` 플래그로 고정되어 있습니다.
- 스킬 추가는 `src/lib/departments.ts`의 `skills` 배열에 항목을 추가하고, 실제 동작이 필요하면 `status: "live"`와 `href`, 그리고 `/src/app/api/`에 라우트를 만들면 됩니다.
