# 김민찬 Portfolio

복잡한 도메인을 사용자 경험으로 바꾸는 FE Developer 김민찬의 포트폴리오입니다.

## 로컬 실행

```sh
npm install
npm run dev
```

브라우저: http://localhost:4321/minchan-portfolio/

## 배포 (GitHub Pages)

공개 URL: **https://mucho7.github.io/minchan-portfolio/**

### 최초 1회 설정

1. GitHub 리포지토리 `mucho7/minchan-portfolio` → **Settings** → **Pages**
2. **Source**를 **GitHub Actions**로 선택
3. **Actions** 탭에서 `Deploy Astro to GitHub Pages` 워크플로 **Re-run** (또는 master에 push)

### 이후

`master` 브랜치에 push하면 자동 배포됩니다.

## 구조

- `src/pages/` — Home, About, Case Studies, Resume, Contact
- `src/content/case-studies/` — Case Study MDX 콘텐츠
- `public/resume/resume.pdf` — 범용 이력서 PDF
