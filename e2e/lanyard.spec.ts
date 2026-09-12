import { expect, test } from '@playwright/test';

test('세 카드의 내용과 공통 크기 및 티맥스 배색을 유지한다', async ({ page }) => {
  await page.goto('./');
  const cards = page.locator('.badge-anchor');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('Frontend 연구원');
  await expect(cards.nth(1)).toContainText('2023.08 – 2024.11');
  await expect(cards.nth(2)).toContainText('개인 프로젝트');
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS('width', '224px');
    await expect(card).toHaveCSS('height', '304px');
  }
  const tmax = page.locator('.lanyard').nth(1);
  await expect(tmax.locator('.static-strap')).toHaveCSS('border-left-width', '2px');
  await expect(tmax.locator('.static-strap')).toHaveCSS('border-left-color', 'rgb(189, 40, 57)');
  const footer = tmax.locator('.badge-footer');
  expect(await footer.locator('span').evaluate(el => el.getBoundingClientRect().width / el.parentElement!.getBoundingClientRect().width)).toBeCloseTo(.7, 2);
});

test('키보드 진입, 회사별 상세 링크, 돌아온 카드의 포커스를 유지한다', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('button', { name: '움직임 끄기' })).toBeAttached();
  const card = page.getByRole('link', { name: '티맥스 클라우드 상세 보기', exact: true });
  await card.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '티맥스 클라우드', exact: true })).toBeFocused();
  await expect(page.locator('#career-detail .career-project')).toHaveCount(1);
  await expect(page.locator('#career-detail .career-project')).toHaveAttribute('href', /web-ide-rendering/);
  await page.getByRole('button', { name: '경력으로 돌아가기' }).click();
  await expect(card).toBeFocused();
  await page.getByRole('link', { name: '개인 프로젝트 상세 보기', exact: true }).click();
  await expect(page.locator('#career-detail')).toContainText('Vercel Ship 2024');
  await expect(page.locator('#career-detail .career-project')).toHaveAttribute('href', /engineering\/#lanyard-interaction/);
});

test('짧게 당기면 복귀하고 충분히 당겨 놓으면 상세가 열린다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.getByRole('button', { name: '움직임 끄기' })).toBeAttached();
  const card = page.locator('#career-card-ahha');
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + 75;
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 12, y + 35, { steps: 5 }); await page.mouse.up();
  await expect(page.locator('#career-detail')).toHaveCount(0);
  await expect(card).toHaveCSS('transform', 'none');
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x, y + 95, { steps: 6 });
  await expect(page.locator('.lanyard').first()).toHaveAttribute('data-armed', 'true');
  await page.mouse.up();
  await expect(page.getByRole('heading', { name: '아하랩스', exact: true })).toBeVisible();
});

test('pointercancel과 Escape는 상세 진입 없이 드래그를 해제한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await expect(page.getByRole('button', { name: '움직임 끄기' })).toBeAttached();
  const card = page.locator('#career-card-ahha');
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  await page.mouse.move(box.x + 100, box.y + 70); await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 170, { steps: 5 });
  await card.dispatchEvent('pointercancel', { pointerId: 1 }); await page.mouse.up();
  await expect(page.locator('#career-detail')).toHaveCount(0);
  await expect(page.locator('.lanyard').first()).toHaveAttribute('data-armed', 'false');
  await card.focus(); await page.mouse.move(box.x + 100, box.y + 70); await page.mouse.down();
  await page.mouse.move(box.x + 100, box.y + 170, { steps: 5 });
  await page.keyboard.press('Escape'); await page.mouse.up();
  await expect(page.locator('#career-detail')).toHaveCount(0);
});

test('모션 감소 시 3D를 요청하지 않고 같은 상세를 연다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('./');
  await page.getByRole('link', { name: '티맥스 클라우드 경력 보기', exact: true }).click();
  await expect(page.locator('#career-detail')).toBeVisible();
  expect(requests.some(url => /LanyardScene|rapier/.test(url))).toBe(false);
});

test('WebGL 초기화 실패 시 정적 카드로 계속 탐색한다', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (kind.includes('webgl')) return null;
      return original.apply(this, [kind, ...args] as never);
    } as typeof original;
  });
  await page.goto('./');
  await expect(page.getByRole('button', { name: '움직임 끄기' })).toBeAttached();
  if (testInfo.project.name === 'desktop') await expect(page.locator('[data-physics="fallback"]')).toHaveCount(3);
  await page.getByRole('link', { name: '아하랩스 경력 보기', exact: true }).click();
  await expect(page.locator('#career-detail')).toContainText('React Flow 렌더링 최적화');
});

test('JS 없이도 세 카드와 기존 경력·개인 작업 링크를 제공한다', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:' + (process.env.PLAYWRIGHT_PORT ?? '4321') + '/minchan-portfolio/');
  await expect(page.locator('.badge-anchor')).toHaveCount(3);
  await page.getByRole('link', { name: '개인 프로젝트 상세 보기', exact: true }).click();
  await expect(page).toHaveURL(/engineering/);
  await context.close();
});

test('데스크톱 물리 카드가 준비되고 취소 후 화면 안으로 복귀한다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  const card = page.locator('#career-card-tmax');
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  await expect(page.locator('[data-physics="ready"]')).toHaveCount(1, { timeout: 20000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  const box = (await card.boundingBox())!;
  await page.mouse.move(box.x + 110, box.y + 60); await page.mouse.down();
  await page.mouse.move(box.x + 700, box.y + 95, { steps: 10 }); await page.mouse.up();
  await expect(page.locator('#career-detail')).toHaveCount(0);
  await expect.poll(async () => {
    const current = (await card.boundingBox())!;
    return Math.abs(current.x - box.x) < 35 && Math.abs(current.y - box.y) < 35;
  }, { timeout: 8000 }).toBe(true);
  expect(errors).toEqual([]);
});


test('WebGL 컨텍스트 유실 후 카드가 정적으로 복구된다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  await page.goto('./');
  await page.locator('#career-card-ahha').hover();
  await expect(page.locator('[data-physics="ready"]')).toHaveCount(1, { timeout: 20000 });
  await page.locator('canvas').first().evaluate(canvas => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(page.locator('.lanyard').first()).toHaveAttribute('data-physics', 'fallback');
  await expect(page.locator('#career-card-ahha')).toHaveCSS('transform', 'none');
  await page.getByRole('link', { name: '아하랩스 상세 보기', exact: true }).click();
  await expect(page.getByRole('heading', { name: '아하랩스', exact: true })).toBeVisible();
});

test('움직임을 끄고 다시 켜도 카드 내용과 상세 이동은 유지된다', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '움직임 끄기' }).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '움직임 켜기' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: '움직임 켜기' }).click();
  await page.getByRole('link', { name: '개인 작업 보기', exact: true }).click();
  await expect(page.locator('#career-detail')).toContainText('출입증을 경력 탐색으로 바꾸기');
});

test('개인 작업의 구현 기록은 Ship 2024의 계기와 기술적 판단을 설명한다', async ({ page }) => {
  await page.goto('./engineering/#lanyard-interaction');
  await expect(page.getByRole('heading', { name: '행사 출입증을, 경력을 여는 인터페이스로.' })).toBeVisible();
  await expect(page.locator('#lanyard-interaction')).toContainText('Vercel Ship 2024에 참여했을 때');
  await expect(page.locator('#lanyard-interaction')).toContainText('물리와 콘텐츠의 렌더링 경계 나누기');
  await expect(page.locator('#lanyard-interaction')).toContainText('무거운 코드는 사용 의도 뒤로 미루기');
  await expect(page.locator('#lanyard-interaction')).toContainText('조작 실패를 정상 경로로 다루기');
});

test('데스크톱 3D 코드는 카드 사용 의도 전까지 요청하지 않고 Canvas를 하나만 유지한다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('./');
  await expect(page.locator('.badge-anchor')).toHaveCount(3);
  expect(requests.some(url => /LanyardScene/.test(url))).toBe(false);
  await page.locator('#career-card-ahha').hover();
  await expect(page.locator('[data-physics="ready"]')).toHaveCount(1, { timeout: 20000 });
  expect(requests.some(url => /LanyardScene/.test(url))).toBe(true);
  await page.locator('#career-card-tmax').hover();
  await expect(page.locator('[data-physics="ready"]')).toHaveCount(1, { timeout: 20000 });
  await expect(page.locator('canvas')).toHaveCount(1);
});
