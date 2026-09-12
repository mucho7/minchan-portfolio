import { expect, test } from '@playwright/test';

test('홈은 경력 카드에 집중하고 Work 탐색은 GNB에서 제공한다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  await expect(page.locator('main > #contact')).toHaveCount(0);
  await expect(page.locator('main > #work')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '주요 성과' })).toHaveCount(0);
  await expect(page.getByRole('tablist')).toHaveCount(0);
  await expect(page.locator('.badge-anchor')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'Work', exact: true })).toHaveAttribute('href', /case-studies\/$/);
  await expect(page.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', /contact\/$/);
});

test('Work 목록에서 포트폴리오 제작기를 열고 공통 상세 레이아웃으로 읽는다', async ({ page }) => {
  await page.goto('./case-studies/');
  await expect(page.locator('main section > a')).toHaveCount(6);
  const link = page.getByRole('link').filter({ hasText: '인터랙티브 포트폴리오 제작기' });
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/case-studies\/portfolio-engineering\/$/);
  await expect(page.getByRole('heading', { level: 1, name: '인터랙티브 포트폴리오 제작기' })).toBeVisible();
  await expect(page.locator('.case-study-body')).toContainText('Vercel Ship 2024에 참여했을 때');
  await expect(page.locator('.case-study-body')).toContainText('세 카드를 하나의 물리 월드에 배치');
});

test('기존 Engineering 주소는 포트폴리오 Case Study로 연결한다', async ({ page }) => {
  await page.goto('./engineering/');
  await expect(page).toHaveURL(/case-studies\/portfolio-engineering\/$/);
  await expect(page.getByRole('heading', { level: 1, name: '인터랙티브 포트폴리오 제작기' })).toBeVisible();
});

test('Case Study 목록은 제목과 핵심 badge만 표시한다', async ({ page }) => {
  await page.goto('./case-studies/');
  await expect(page.getByRole('navigation', { name: '주요 메뉴' })).toContainText('Work');
  await expect(page.getByRole('navigation', { name: '주요 메뉴' })).toContainText('About');
  await expect(page.getByRole('navigation', { name: '주요 메뉴' })).not.toContainText('Engineering');
  await expect(page.getByRole('heading', { name: 'Work' })).toBeVisible();
  const badges = page.getByRole('list', { name: '프로젝트 핵심 정보' });
  await expect(badges.first()).toBeVisible();
  await expect(page.getByText('Decision.', { exact: true })).toHaveCount(0);
  await expect(page.getByText('React', { exact: true })).toHaveCount(0);
  await expect(page.getByText('TypeScript', { exact: true })).toHaveCount(0);
  await expect(page.getByText('IndexedDB', { exact: true })).toBeVisible();
});

test('Case Study 상세 헤더는 제목과 요약만 표시한다', async ({ page }) => {
  await page.goto('./case-studies/manufacturing-monitoring-poc/');
  await expect(page.getByRole('heading', { level: 1, name: '시뮬레이션 재생 동기화' })).toBeVisible();
  await expect(page.getByText('공통 pose 모델로 리포트와 Konva 맵의')).toBeVisible();
  await expect(page.getByText('Case Study', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Evidence', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Technology', { exact: true })).toHaveCount(0);
  await expect(page.getByText('(주) 아하랩스', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Frontend Engineer / Simulation Playback', { exact: true })).toHaveCount(0);
});

test('홈에서 가로 스크롤이 생기지 않는다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  const getOverflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(await getOverflow()).toBe(0);
});
