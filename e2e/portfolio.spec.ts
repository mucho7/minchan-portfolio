import { expect, test } from '@playwright/test';

test('프로젝트 팝업의 URL·접근성·포커스 계약을 유지한다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  const trigger = page.getByRole('button', { name: /5천만 건 시계열/ });
  await trigger.click();

  await expect(page).toHaveURL(/project=time-series-performance/);
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: '프로젝트 상세 닫기' })).toBeFocused();
  await expect(page.locator('#portfolio-page-content')).toHaveAttribute('inert', '');

  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page).not.toHaveURL(/project=/);
  await expect(trigger).toBeFocused();
});

test('홈과 프로젝트 팝업에서 가로 스크롤이 생기지 않는다', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('[data-hydrated="true"]')).toBeAttached();
  const getOverflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(await getOverflow()).toBe(0);

  await page.getByRole('button', { name: /Agent UI 공통화/ }).click();
  expect(await getOverflow()).toBe(0);
});
