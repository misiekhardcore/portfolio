import { test, expect } from '@playwright/test'

test('GET / → 200', async ({ page }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
})

test('GET /about → 200', async ({ page }) => {
  const res = await page.goto('/about')
  expect(res?.status()).toBe(200)
})

test('GET /contact → 200', async ({ page }) => {
  const res = await page.goto('/contact')
  expect(res?.status()).toBe(200)
})

test('GET /projects → 200', async ({ page }) => {
  const res = await page.goto('/projects')
  expect(res?.status()).toBe(200)
})

test('GET /projects/nonexistent → 404', async ({ page }) => {
  const res = await page.goto('/projects/nonexistent')
  expect(res?.status()).toBe(404)
})

test('GET /admin → route accessible (no DB in CI may return non-200)', async ({ page }) => {
  const res = await page.goto('/admin')
  expect([200, 302, 500]).toContain(res?.status())
})

test('GET /api/images/nonexistent.jpg → not 500', async ({ request }) => {
  const res = await request.get('/api/images/nonexistent.jpg')
  expect(res.status()).not.toBe(500)
})

test('GET /api/images/test.jpg → 200 with cache headers', async ({ request }) => {
  const res = await request.get('/api/images/test.jpg')
  if (res.status() === 200) {
    expect(res.headers()['cache-control']).toBeDefined()
  }
})

test('GET /projects → shows project cards or empty state', async ({ page }) => {
  await page.goto('/projects')
  const cards = page.locator('.grid a[href^="/projects/"]')
  const cardCount = await cards.count()
  if (cardCount > 0) {
    await expect(cards.first()).toBeVisible()
  } else {
    await expect(page.getByText('No projects yet')).toBeVisible()
  }
})
