import { expect, test } from '@playwright/test';

test('큰 화면에서 카드 섹션이 GNB 아래를 채우고 카드 크기를 유지한다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  await page.setViewportSize({ width: 1920, height: 1200 });
  await page.goto('./');
  const hero = page.locator('#hero');
  await expect.poll(async () => {
    const box = (await hero.boundingBox())!;
    return Math.round(box.y + box.height);
  }).toBe(1200);
  await expect(page.locator('.badge-anchor').first()).toHaveCSS('width', '224px');
  await expect(page.locator('.badge-anchor').first()).toHaveCSS('height', '304px');
  const guidance = (await page.locator('.career-guidance').boundingBox())!;
  expect(1200 - guidance.y - guidance.height).toBeCloseTo(32, 0);
  await page.setViewportSize({ width: 1280, height: 720 });
  expect((await hero.boundingBox())!.height).toBeGreaterThan(720 - 65);
});

test('세 카드의 내용과 공통 크기 및 회사별 배색을 유지한다', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: '김민찬 포트폴리오', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /움직임 (끄기|켜기)/ })).toHaveCount(0);
  await expect(page.locator('.career-intro p')).toHaveCount(0);
  const cards = page.locator('.badge-anchor');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('Frontend 연구원');
  await expect(cards.nth(1)).toContainText('2023.08 – 2024.11');
  await expect(cards.nth(2)).toContainText('개인 프로젝트');
  for (const card of await cards.all()) {
    await expect(card).toHaveCSS('width', '224px');
    await expect(card).toHaveCSS('height', '304px');
  }
  await expect(page.locator('.lanyard-stage').first()).toHaveCSS('height', '568px');
  const ahha = page.locator('.lanyard').first();
  await expect(ahha.locator('.static-strap')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(ahha.locator('.static-strap')).toHaveCSS('border-left-color', 'rgb(230, 0, 39)');
  await expect(ahha.locator('.static-strap')).toHaveCSS('border-right-color', 'rgb(230, 0, 39)');
  await expect(ahha.locator('.static-strap')).toHaveCSS('background-image', /ahha-strap\.svg/);
  await expect(ahha.locator('.static-strap')).toHaveCSS('background-size', '100% 75%');
  const patternResponse = await page.request.get('./assets/ahha-strap.svg');
  expect(patternResponse.ok()).toBe(true);
  expect(await patternResponse.text()).toContain('AHHA Labs');
  await expect(ahha.locator('.badge-face')).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  const tmax = page.locator('.lanyard').nth(1);
  await expect(tmax.locator('.static-strap')).toHaveCSS('border-left-width', '2px');
  await expect(tmax.locator('.static-strap')).toHaveCSS('border-left-color', 'rgb(189, 40, 57)');
  const footer = tmax.locator('.badge-footer');
  expect(await footer.locator('span').evaluate(el => el.getBoundingClientRect().width / el.parentElement!.getBoundingClientRect().width)).toBeCloseTo(.7, 2);
});

test('키보드 진입, 회사별 상세 링크, 돌아온 카드의 포커스를 유지한다', async ({ page }) => {
  await page.goto('./');
  const card = page.getByRole('link', { name: '티맥스 클라우드 상세 보기', exact: true });
  await card.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '티맥스 클라우드', exact: true })).toBeFocused();
  await expect(page.locator('#career-detail .career-project')).toHaveCount(1);
  await expect(page.locator('#career-detail .career-project')).toHaveAttribute('href', /web-ide-rendering/);
  await page.getByRole('button', { name: '경력으로 돌아가기' }).click();
  await expect(card).toBeFocused();
  await page.getByRole('link', { name: '개인 프로젝트 상세 보기', exact: true }).click();
  await expect(page.locator('#career-detail')).toContainText('Vercel Ship 2024');
  await expect(page.locator('#career-detail .career-project')).toHaveAttribute('href', /case-studies\/portfolio-engineering\/$/);
});

test('짧게 당기면 복귀하고 충분히 당겨 놓으면 상세가 열린다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const card = page.locator('#career-card-ahha');
  await card.scrollIntoViewIfNeeded();
  const box = (await card.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + 75;
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x + 8, y + 16, { steps: 4 }); await page.mouse.up();
  await expect(page.locator('#career-detail')).toHaveCount(0);
  await expect(card).toHaveCSS('transform', 'none');
  await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x, y + 105, { steps: 6 });
  await expect(page.locator('.lanyard').first()).toHaveAttribute('data-armed', 'true');
  await page.mouse.up();
  await expect(page.getByRole('heading', { name: '아하랩스', exact: true })).toBeVisible();
});

test('드래그 중에만 기간 아래 안내를 표시하고 임계점에서 문구를 전환한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const card = page.locator('#career-card-ahha');
  const face = card.locator('.badge-face');
  const period = card.locator('.badge-period');
  const hint = card.locator('.badge-drag-hint');
  const periodBefore = (await period.boundingBox())!;
  const box = (await card.boundingBox())!;
  const x = box.x + box.width / 2, y = box.y + 70;

  await expect(face).toHaveAttribute('data-interaction', 'idle');
  await expect(hint.locator('.badge-drag-hint-pull')).toHaveCSS('opacity', '0');
  await page.mouse.move(x, y); await page.mouse.down();
  await expect(face).toHaveAttribute('data-interaction', 'pull');
  await expect(hint).toHaveCSS('height', '26px');
  await expect(hint).toHaveCSS('font-size', '13px');
  await expect(hint).toHaveCSS('text-align', 'center');
  await expect(hint.locator('.badge-drag-hint-pull')).toHaveCSS('opacity', '1');
  expect(periodBefore.y - (await period.boundingBox())!.y).toBeGreaterThan(12);

  await page.mouse.move(x, y + 105, { steps: 6 });
  await expect(face).toHaveAttribute('data-interaction', 'release');
  await expect(hint.locator('.badge-drag-hint-release')).toHaveCSS('opacity', '1');
  await card.dispatchEvent('pointercancel', { pointerId: 1 }); await page.mouse.up();
  await expect(face).toHaveAttribute('data-interaction', 'idle');
  await expect(hint).toHaveCSS('height', '0px');
  await expect(hint.locator('.badge-drag-hint-release')).toHaveCSS('opacity', '0');
});

test('pointercancel과 Escape는 상세 진입 없이 드래그를 해제한다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
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
  await page.getByRole('link', { name: '티맥스 클라우드 상세 보기', exact: true }).click();
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
  if (testInfo.project.name === 'desktop') await expect(page.locator('.career-shelf')).toHaveAttribute('data-physics', 'fallback');
  await page.getByRole('link', { name: '아하랩스 상세 보기', exact: true }).click();
  await expect(page.locator('#career-detail')).toContainText('React Flow 렌더링 최적화');
});

test('JS 없이도 세 카드와 기존 경력·개인 작업 링크를 제공한다', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:' + (process.env.PLAYWRIGHT_PORT ?? '4321') + '/minchan-portfolio/');
  await expect(page.locator('.badge-anchor')).toHaveCount(3);
  await page.getByRole('link', { name: '개인 프로젝트 상세 보기', exact: true }).click();
  await expect(page).toHaveURL(/case-studies\/portfolio-engineering\/$/);
  await context.close();
});

test('데스크톱 물리 카드는 선반 전체 폭에서 겹쳐 움직이고 취소 후 복귀한다', async ({ page }, testInfo) => {
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
  const ahha = page.locator('#career-card-ahha');
  const ahhaBox = (await ahha.boundingBox())!;
  await page.mouse.move(box.x + 110, box.y + 60); await page.mouse.down();
  await page.mouse.move(box.x + 700, box.y + 40, { steps: 10 });
  await expect.poll(async () => (await card.boundingBox())!.x - box.x).toBeGreaterThan(250);
  expect(Math.abs((await ahha.boundingBox())!.x - ahhaBox.x)).toBeLessThan(35);
  await page.keyboard.press('Escape'); await page.mouse.up();
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
  await expect(page.locator('.career-shelf')).toHaveAttribute('data-physics', 'fallback');
  await expect(page.locator('#career-card-ahha')).toHaveCSS('transform', 'none');
  await page.getByRole('link', { name: '아하랩스 상세 보기', exact: true }).click();
  await expect(page.getByRole('heading', { name: '아하랩스', exact: true })).toBeVisible();
});

test('개인 작업의 Case Study는 Ship 2024의 계기와 기술적 판단을 설명한다', async ({ page }) => {
  await page.goto('./case-studies/portfolio-engineering/');
  await expect(page.getByRole('heading', { level: 1, name: '인터랙티브 포트폴리오 제작기' })).toBeVisible();
  await expect(page.locator('.case-study-body')).toContainText('Vercel Ship 2024에 참여했을 때');
  await expect(page.locator('.case-study-body')).toContainText('효과와 콘텐츠의 렌더링 경계');
  await expect(page.locator('.case-study-body')).toContainText('세 카드를 하나의 물리 월드에 배치');
  await expect(page.locator('.case-study-body')).toContainText('실패를 별도 화면으로 만들지 않기');
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
  await page.locator('canvas').evaluate(canvas => canvas.dataset.instance = 'shared');
  await page.locator('#career-card-tmax').hover();
  await expect(page.locator('[data-physics="ready"]')).toHaveCount(1, { timeout: 20000 });
  await expect(page.locator('canvas')).toHaveCount(1);
  await expect(page.locator('canvas')).toHaveAttribute('data-instance', 'shared');
});
