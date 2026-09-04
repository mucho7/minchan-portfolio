import { expect, test } from '@playwright/test';

test('프로젝트 탭의 선택 상태와 Case Study 이동을 유지한다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  const agentTab = page.getByRole('tab', { name: 'Agent UI' });
  await agentTab.click();
  await expect(agentTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('반복 구현 영역을');
  await expect(page.getByRole('link', { name: '전체 Case Study 읽기' })).toHaveAttribute('href', /agent-ui-reuse/);
});

test('홈과 프로젝트 패널에서 가로 스크롤이 생기지 않는다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  const getOverflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(await getOverflow()).toBe(0);

  await page.getByRole('tab', { name: 'Workflow' }).click();
  expect(await getOverflow()).toBe(0);
});
