import { expect, test } from '@playwright/test';

test('프로젝트 탭의 선택 상태와 Case Study 이동을 유지한다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  await expect(page.locator('main > #contact')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', /contact\/$/);
  const agentTab = page.getByRole('tab', { name: 'Agent UI' });
  await agentTab.click();
  await expect(agentTab).toHaveAttribute('aria-selected', 'true');
  await expect(agentTab).toHaveCSS('background-color', 'rgb(242, 97, 48)');
  await expect(agentTab).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('tabpanel')).toContainText('반복하던 Agent UI를');
  const caseStudyLink = page.getByRole('link', { name: '전체 Case Study 읽기' });
  await expect(caseStudyLink).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(caseStudyLink).toHaveAttribute('href', /agent-ui-reuse/);
});

test('Web IDE를 마지막 탭에 두고 IndexedDB 성과를 보여준다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  const tabs = page.getByRole('tab');
  await expect(tabs.last()).toHaveText('Web IDE');
  await tabs.last().click();
  await expect(page.getByRole('tabpanel')).toContainText('IndexedDB');
  await expect(page.getByRole('tabpanel')).toContainText('티맥스 클라우드');
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

test('홈과 프로젝트 패널에서 가로 스크롤이 생기지 않는다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  const getOverflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(await getOverflow()).toBe(0);

  await page.getByRole('tab', { name: 'Workflow' }).click();
  expect(await getOverflow()).toBe(0);
});
