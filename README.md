# 김민찬 Portfolio

복잡한 도메인을 사용자가 판단하고 실행할 수 있는 인터페이스로 바꾸는 FE Developer **김민찬**의 포트폴리오 사이트입니다.

**배포 URL:** https://mucho7.github.io/minchan-portfolio/

## 이 레포의 목적

이 레포는 실무 프로젝트의 **문제 정의·의사결정·성과**를 Case Study로 전달하는 동시에, 콘텐츠부터 상호작용과 배포까지 TypeScript로 검증하는 포트폴리오입니다. 정적 페이지에는 Astro를, 상태가 필요한 프로젝트 팝업에는 React island를 사용합니다.

## Why Astro

React Island를 쓰기 위해 Astro를 선택한 것이 아닙니다. 대부분의 페이지가 정적 콘텐츠 중심이고 필요한 인터랙션이 거의 없기 때문에, Astro + MDX + Content Collection이 더 단순하고 적합하다고 판단했습니다.

- 정적 콘텐츠 중심 페이지에 맞는 빌드 구조
- MDX 기반 Case Study 작성·확장과 스키마 검증 (`content.config.ts`)
- 불필요한 클라이언트 JavaScript 최소화 (React SPA 미사용)
- GitHub Pages 서브패스 배포와의 단순한 호환

## TypeScript-first 원칙

- Content Collection 타입을 UI 데이터 계약의 단일 소스로 사용
- Astro, React Props, URL 상태와 Framer Motion variants를 strict mode로 검사
- 팝업의 open·focus·URL·ARIA 상태를 분리된 TypeScript 훅으로 관리
- GitHub Actions에서 타입 검사와 사용자 상호작용 테스트를 통과한 결과만 배포

자세한 설계와 트레이드오프는 [TypeScript-first 전환 기록](./docs/typescript-first-architecture.md)에서 확인할 수 있습니다.

## 주요 페이지

| 페이지 | 경로 | 설명 |
| --- | --- | --- |
| Home | `/` | 소개, 핵심 가치, 대표 Case Study 미리보기 |
| About | `/about/` | 경력 철학, 협업 스타일, 기술 스택과 사용 맥락 |
| Case Studies | `/case-studies/` | 문제 정의 → 설계 → 결과 형식의 프로젝트 사례 |
| Engineering | `/engineering/` | 이 사이트의 타입 구조, 상태 모델, 테스트와 기술적 의사결정 |
| Contact | `/contact/` | 이메일, GitHub, Velog 등 연락처 |

## 기술 스택

- [Astro](https://astro.build/) 7 — 정적 사이트 생성과 Content Collection
- [Tailwind CSS](https://tailwindcss.com/) 4 — 스타일링
- [MDX](https://mdxjs.com/) — Case Study 콘텐츠 작성
- [Mermaid](https://mermaid.js.org/) — Case Study 상세 페이지 다이어그램 (클라이언트 렌더링)
- [TypeScript](https://www.typescriptlang.org/) — 콘텐츠·상태·설정의 strict 타입 검사
- [Vitest](https://vitest.dev/) + Testing Library — 타입 변환과 컴포넌트 상태 계약 테스트
- [Playwright](https://playwright.dev/) — 데스크톱·모바일 사용자 흐름 검증
- GitHub Pages + GitHub Actions — 배포

### Mermaid와 JavaScript

본문 페이지는 정적 HTML 중심으로 제공합니다. 구조 설명이 필요한 **Case Study 상세**(`/case-studies/[slug]/`)에서만 Mermaid 클라이언트 스크립트를 로드해 다이어그램을 렌더링합니다. 랜딩·목록·About·Contact에는 Mermaid JS가 포함되지 않습니다.

## 사전 요구사항

- Node.js **22.12.0** 이상 (`package.json`의 `engines` 참고)

## 로컬 실행

```sh
npm install
npm run dev
```

개발 서버: http://localhost:4321/minchan-portfolio/

> GitHub Pages 서브패스(`/minchan-portfolio/`) 배포를 위해 `astro.config.ts`에 `base`가 설정되어 있습니다. 로컬에서도 동일한 경로로 접속해야 합니다.

## 빌드 및 미리보기

```sh
# TypeScript와 Astro 템플릿 검사
npm run check

# 단위·컴포넌트 테스트
npm run test

# 실제 브라우저 상호작용 테스트
npm run test:e2e

# check + test + production build
npm run verify

# 프로덕션 빌드만 실행
npm run build

# 빌드 결과물 로컬 미리보기
npm run preview
```

빌드 결과물은 `dist/` 디렉터리에 생성됩니다.

## 프로젝트 구조

```
src/
├── components/
│   └── portfolio/         # 프로젝트 목록·Detail dialog와 상태 스타일
├── content/
│   └── case-studies/      # Case Study MDX 콘텐츠
├── data/
│   ├── portfolio.ts       # 타입 검사되는 홈 데이터와 UI 토큰
│   └── tech-context.ts    # About 페이지 기술 스택 데이터
├── hooks/                 # URL·dialog focus 상태 계약
├── layouts/
│   └── BaseLayout.astro   # 공통 레이아웃 (헤더, 푸터, SEO 메타)
├── mappers/               # Content Entry → UI ViewModel
├── motion/                # Framer Motion typed variants
├── pages/                 # 라우트 페이지
│   ├── index.astro
│   ├── about.astro
│   ├── engineering.astro
│   ├── contact.astro
│   └── case-studies/
│       ├── index.astro
│       └── [slug].astro
├── styles/
│   └── global.css
├── types/
│   └── portfolio.ts       # Content Collection에서 파생한 공통 타입
└── utils/
    └── withBase.ts        # base URL 경로 헬퍼

public/
└── images/case-studies/   # Case Study 이미지 에셋

.github/workflows/
└── deploy.yml             # GitHub Pages 배포 워크플로
```

## Case Study 추가하기

1. `src/content/case-studies/`에 `.mdx` 파일을 추가합니다.
2. frontmatter 스키마는 `src/content.config.ts`에 정의되어 있습니다.

```yaml
---
title: "프로젝트 제목"
summary: "한 줄 요약"
order: 4                    # 목록 정렬 순서 (작을수록 앞)
period: "2024.01 - 2024.06"
role: "FE / UI 설계"
skills:
  - React
  - TypeScript
metrics:
  - "측정 가능한 성과 1"
preview:
  problem: "문제 정의"
  decision: "핵심 의사결정"
  result: "결과"
---
```

3. 본문에서 Mermaid 다이어그램을 쓰려면 컴포넌트를 import합니다.

```mdx
import Mermaid from '../../components/Mermaid.astro';

<Mermaid chart={`
flowchart LR
  A[Before] --> B[After]
`} caption="개선 흐름" />
```

4. 이미지는 `public/images/case-studies/<slug>/`에 넣고, MDX에서 `/minchan-portfolio/images/...` 경로로 참조합니다.

## 배포 (GitHub Pages)

`master` 브랜치에 push하면 `.github/workflows/deploy.yml`이 타입 검사, 단위 테스트, Playwright 상호작용 테스트와 빌드를 실행합니다. 모든 단계가 통과한 결과만 GitHub Pages에 배포됩니다.

### 최초 1회 설정

1. GitHub 리포지토리 **Settings → Pages**
2. **Source**를 **GitHub Actions**로 선택
3. **Actions** 탭에서 `Deploy Astro to GitHub Pages` 워크플로 실행 (또는 `master`에 push)

### base URL 변경 시

루트 도메인 등 다른 경로로 배포할 경우 `astro.config.ts`의 `site`, `base` 값을 함께 수정하세요.

```ts
export default defineConfig({
  site: 'https://mucho7.github.io',
  base: '/minchan-portfolio/',
  // ...
});
```

## GitHub 리포지토리 About (권장)

리포지토리 메인 페이지 **About** 편집 시 아래 값을 사용하면 됩니다.

| 항목 | 값 |
| --- | --- |
| Description | 복잡한 도메인 UI를 Case Study 중심으로 정리한 FE 포트폴리오 (Astro + MDX) |
| Website | https://mucho7.github.io/minchan-portfolio/ |
| Topics | `astro`, `mdx`, `portfolio`, `frontend`, `case-study` |

`gh` CLI가 있다면 한 번에 설정할 수 있습니다.

```sh
gh repo edit --description "복잡한 도메인 UI를 Case Study 중심으로 정리한 FE 포트폴리오 (Astro + MDX)" \
  --homepage "https://mucho7.github.io/minchan-portfolio/" \
  --add-topic astro --add-topic mdx --add-topic portfolio --add-topic frontend --add-topic case-study
```

## 연락처

- Email: ydjm1994@gmail.com
- GitHub: [mucho7](https://github.com/mucho7)
- Blog: [Velog](https://velog.io/@kimjih94/posts)
