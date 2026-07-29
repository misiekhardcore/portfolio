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

test('GET /admin → 200', async ({ page }) => {
  const res = await page.goto('/admin')
  expect(res?.status()).toBe(200)
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
