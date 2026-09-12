# TypeScript-first 포트폴리오 전환 기록

## 1. 목표

이 작업의 목표는 파일 확장자를 모두 `.ts` 또는 `.tsx`로 바꾸는 것이 아니다. 콘텐츠, 페이지, React 상호작용, 애니메이션과 배포 사이에 검증 가능한 타입 계약을 만들고 그 계약을 CI에서 강제하는 것이다.

정적 콘텐츠에 적합한 Astro와 MDX는 유지한다. Astro frontmatter의 코드는 strict TypeScript 검사 대상이며, 브라우저 상태가 필요한 영역만 React island로 제공한다.

## 2. 전환 전 진단

- `tsconfig.json`은 이미 `astro/tsconfigs/strict`를 확장하고 있었다.
- 명시적인 JavaScript 파일은 `astro.config.mjs` 하나뿐이었다.
- 그러나 `typescript`와 `@astrojs/check`가 개발 의존성에 없었고 CI는 `astro build`만 실행했다.
- Content Collection의 스키마와 `PortfolioExperience.tsx`의 `Project` 타입이 별도로 존재했다.
- 홈 컴포넌트 하나가 팝업 렌더링, URL query, 포커스 트랩, 스크롤 잠금과 모션 값을 모두 소유했다.
- Mermaid가 상세 페이지 클라이언트 엔트리에서 정적으로 import되어 큰 초기 청크를 만들었다.

## 3. 핵심 설계

### 콘텐츠 타입을 단일 소스로 사용

`src/content.config.ts`의 Zod 스키마가 MDX frontmatter를 런타임에 검증한다. `CollectionEntry<'case-studies'>['data']`에서 `CaseStudyData` 타입을 파생하고, `toProjectViewModel()`이 클라이언트에 필요한 `slug`와 `href`만 추가한다.

```text
MDX frontmatter
  → Zod schema
  → CollectionEntry<'case-studies'>
  → toProjectViewModel()
  → Astro 목록·상세 페이지 / React 경력 카드 상세
```

필드가 추가·삭제되면 스키마, ViewModel, React Props와 테스트가 컴파일 단계에서 함께 영향을 받는다.

### 경력 탐색 상태 계약

홈은 회사 경력 두 장과 개인 프로젝트 한 장을 같은 `Lanyard` 계약으로 렌더링한다. 선택한 카드에서 경력 상세와 관련 Case Study 링크를 파생하며, 카드의 클릭·Enter·당김 동작이 같은 진입 함수를 사용한다.

- 카드 선택 시 상세 제목으로 포커스 이동
- `경력으로 돌아가기`에서 선택했던 카드로 포커스 복귀
- 회사명·직급·기간은 HTML에 유지하고 줄의 움직임만 공유 Canvas에서 계산
- 모바일·모션 감소·WebGL 실패·JavaScript 비활성 환경에서 정적 카드와 링크 유지
- 개인 프로젝트도 Content Collection의 Case Study를 사용해 Work 목록과 같은 상세 레이아웃 제공

### Mermaid 지연 로딩

`render-mermaid.ts`는 먼저 DOM에 다이어그램이 있는지 확인하고, 있을 때만 `import('mermaid')`를 실행한다. Mermaid 자체 청크 크기는 크지만 홈과 일반 페이지의 초기 실행 경로에서는 제외된다.

프로덕션 빌드의 minified·비압축 파일 크기를 기준으로 측정한 결과는 다음과 같다.

| 항목 | 변경 전 | 변경 후 | 의미 |
| --- | ---: | ---: | --- |
| Case Study 최초 실행 스크립트 | 608,677 bytes | 2,784 bytes | 초기 실행 경로 약 99.5% 감소 |
| Mermaid dependency graph | 최초 스크립트에서 시작 | core·diagram별 지연 청크로 분리 | 다이어그램이 있을 때만 동적 요청 |

이 변경은 Mermaid가 실제 필요한 상세 페이지의 최종 전송량 자체를 제거하지 않는다. 정적 본문과 작은 조건 검사 코드를 먼저 실행하고, 큰 파서와 렌더러의 평가 시점을 뒤로 옮긴 것이다.

## 4. 보안과 프레임워크 마이그레이션

의존성 감사에서 Astro 6.3.5, Mermaid 11.15와 하위 빌드 도구의 수정 가능한 경고를 확인했다. 자동 `npm audit fix` 대신 공식 호환 범위를 확인하고 다음 버전을 명시적으로 갱신했다.

- Astro 6.3.5 → 7.2.10
- `@astrojs/mdx` 5 → 8
- Mermaid 11.15 → 11.17
- DOMPurify 3.4.14 이상 강제
- esbuild 0.28.1 이상

Astro 7이 요구하는 Node 22.12 이상은 기존 `engines` 조건과 일치했다. 마이그레이션 후 `astro check`, Vitest, Playwright와 production build를 다시 실행했고 배포 의존성 기준 `npm audit --omit=dev` 결과는 취약점 0건이다.

## 5. 검증 계층

### `npm run check`

`astro check`가 `.ts`, `.tsx`, `.astro`의 TypeScript 오류와 Astro 템플릿 오류를 검사한다.

### `npm run test`

Vitest와 Testing Library가 다음을 검증한다.

- Content Entry → Project ViewModel 변환
- 카드 디자인 기본값과 회사별 디자인 입력
- 카드 스테이지와 상세 진입 임계값

### `npm run test:e2e`

Playwright가 데스크톱 Chrome과 모바일 viewport에서 다음 실제 사용자 흐름을 검증한다.

- 경력 카드의 클릭·키보드·당김 상세 진입과 포커스 복귀
- 공유 Canvas 지연 로딩과 WebGL 실패 폴백
- Work 목록에서 포트폴리오 제작 Case Study로 이동
- 홈의 가로 스크롤 부재

### `npm run verify`

로컬 기본 검증 명령은 타입 검사, 단위 테스트, 프로덕션 빌드를 순서대로 실행한다. GitHub Actions는 여기에 Playwright 테스트를 추가하고 모두 통과한 산출물만 Pages에 배포한다.

전환 완료 시점의 검증 결과:

- Astro/TypeScript 검사: 33 files, 오류·경고·힌트 0건
- Vitest: 2 files, 3 tests 통과
- Playwright: desktop·mobile 총 4 tests 통과
- Astro production build: 9 routes 생성

## 6. 주요 파일

- `src/types/portfolio.ts`: 콘텐츠에서 파생한 공통 타입과 대표 프로젝트 slug
- `src/mappers/case-study.ts`: 서버 콘텐츠를 클라이언트 ViewModel로 변환
- `src/data/portfolio.ts`: 경력 카드와 관련 Case Study 계약
- `src/components/hero/`: 경력 카드, 공유 물리 장면과 정적 폴백
- `src/content/case-studies/portfolio-engineering.mdx`: 포트폴리오 제작 과정과 기술적 판단
- `src/scripts/render-mermaid.ts`: 조건부 Mermaid 로더
- `src/pages/engineering.astro`: 기존 Engineering URL의 Case Study 연결 경로

## 7. 개발자가 알아야 할 명령

```bash
npm run dev       # 로컬 개발 서버
npm run check     # Astro + TypeScript 검사
npm run test      # 단위·컴포넌트 테스트
npm run test:e2e  # 실제 브라우저 상호작용 테스트
npm run build     # 프로덕션 빌드
npm run verify    # check + test + build
```

## 8. 트레이드오프와 후속 과제

- 모든 `.astro` 파일을 TSX로 바꾸지 않았다. 정적 HTML에 React hydration 비용을 추가할 이유가 없기 때문이다.
- 홈의 카드 선택은 현재 URL에 보존하지 않는다. 각 프로젝트는 공유 가능한 Case Study URL을 별도로 제공한다.
- E2E 테스트는 핵심 흐름만 다룬다. 시각 회귀 테스트는 디자인이 더 안정된 뒤 스냅샷 유지 비용과 함께 검토한다.
- 의존성 감사 경고는 기능 변경과 분리해 원인 패키지·실제 배포 영향·업데이트 위험을 확인한 뒤 처리한다. 자동 `npm audit fix`는 실행하지 않는다.
