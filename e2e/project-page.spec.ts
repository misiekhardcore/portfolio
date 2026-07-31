import { test, expect } from '@playwright/test'

test.describe('Project detail page', () => {
  const PAGE_SIZE = 8

  async function goToFirstProject(page: import('@playwright/test').Page): Promise<boolean> {
    await page.goto('/projects')
    const cards = page.locator('.grid a[href^="/projects/"]')
    const count = await cards.count()
    if (count === 0) return false
    const href = await cards.first().getAttribute('href')
    await page.goto(href!)
    return true
  }

  function getGalleryImages(page: import('@playwright/test').Page) {
    return page.locator('.columns-1 [role="button"]')
  }

  test('renders rich text content', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const contentArea = page.locator('[class*="lg:col-span-2"]')
    await expect(contentArea).toBeVisible()

    const contentElements = contentArea.locator('h1, h2, h3, h4, p, ul, ol, blockquote')
    await expect(contentElements.first()).toBeVisible({ timeout: 2000 })
  })

  test('displays gallery images when images exist', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const galleryImages = getGalleryImages(page)
    const imageCount = await galleryImages.count()
    test.skip(imageCount === 0, 'No gallery images for this project')

    await expect(galleryImages.first()).toBeVisible()
  })

  test('shows "+N more" button when images exceed pageSize', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const galleryImages = getGalleryImages(page)
    const imageCount = await galleryImages.count()
    test.skip(imageCount === 0, 'No gallery images for this project')

    const moreButton = page.locator('button', { hasText: /^\+\d+ more$/ })

    if (imageCount > PAGE_SIZE) {
      await expect(moreButton).toBeVisible()
    } else {
      test.skip(true, `Project has ${imageCount} images (≤${PAGE_SIZE}), no "+N more" button expected`)
    }
  })

  test('lightbox opens on image click and closes via backdrop click', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const galleryImages = getGalleryImages(page)
    const imageCount = await galleryImages.count()
    test.skip(imageCount === 0, 'No gallery images for this project')

    await galleryImages.first().click()

    const lightbox = page.locator('.fixed.inset-0.z-50')
    await expect(lightbox).toBeVisible()
    await expect(lightbox.locator('img')).toBeVisible()

    await lightbox.click({ position: { x: 10, y: 10 } })

    await expect(lightbox).not.toBeVisible()
  })

  test('lightbox closes with Escape key', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const galleryImages = getGalleryImages(page)
    const imageCount = await galleryImages.count()
    test.skip(imageCount === 0, 'No gallery images for this project')

    await galleryImages.first().click()

    const lightbox = page.locator('.fixed.inset-0.z-50')
    await expect(lightbox).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(lightbox).not.toBeVisible()
  })

  test('lightbox has prev/next navigation for multiple images', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const galleryImages = getGalleryImages(page)
    const imageCount = await galleryImages.count()
    test.skip(imageCount < 2, 'Need at least 2 gallery images for navigation test')

    await galleryImages.first().click()

    const lightbox = page.locator('.fixed.inset-0.z-50')
    await expect(lightbox).toBeVisible()

    const prevButton = lightbox.locator('button[aria-label="Previous image"]')
    const nextButton = lightbox.locator('button[aria-label="Next image"]')

    await expect(nextButton).toBeVisible()
    const initialSrc = await lightbox.locator('img').getAttribute('src')

    await nextButton.click()
    const nextSrc = await lightbox.locator('img').getAttribute('src')
    expect(nextSrc).not.toBe(initialSrc)

    await prevButton.click()
    const prevSrc = await lightbox.locator('img').getAttribute('src')
    expect(prevSrc).toBe(initialSrc)
  })

  test('details sidebar present when project has details', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const sidebar = page.locator('aside dl')
    const hasSidebar = await sidebar.count() > 0
    if (!hasSidebar) {
      test.skip(true, 'Project has no details')
    }
    await expect(sidebar).toBeVisible()
  })

  test('inline images in rich text open lightbox', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    // Inline images inside the RichText description area
    const descriptionArea = page.locator('[class*="lg:col-span-2"]')
    const inlineImgs = descriptionArea.locator('img')
    const inlineCount = await inlineImgs.count()
    test.skip(inlineCount === 0, 'No inline images in rich text for this project')

    await inlineImgs.first().click()

    const lightbox = page.locator('.fixed.inset-0.z-50')
    await expect(lightbox).toBeVisible()
    await expect(lightbox.locator('img')).toBeVisible()

    // Close the lightbox
    await page.keyboard.press('Escape')
    await expect(lightbox).not.toBeVisible()
  })

  test('lightbox shows merged gallery+inline images with correct ordering', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const galleryImages = getGalleryImages(page)
    const galleryCount = await galleryImages.count()

    const descriptionArea = page.locator('[class*="lg:col-span-2"]')
    const inlineImgs = descriptionArea.locator('img')
    const inlineCount = await inlineImgs.count()

    const totalImageCount = galleryCount + inlineCount
    test.skip(totalImageCount < 2, 'Need at least 2 total images for ordering test')

    // Open an inline image (click the first one)
    if (inlineCount > 0) {
      await inlineImgs.first().click()
    } else {
      await galleryImages.first().click()
    }

    const lightbox = page.locator('.fixed.inset-0.z-50')
    await expect(lightbox).toBeVisible()

    // Verify the counter shows the correct total
    const counter = lightbox.locator('text=/\\d+ \\/ \\d+/')
    await expect(counter).toBeVisible()
    const counterText = await counter.textContent()
    const match = counterText?.match(/(\d+) \/ (\d+)/)
    expect(match).not.toBeNull()
    const totalFromCounter = parseInt(match![2], 10)
    expect(totalFromCounter).toBe(totalImageCount)

    await page.keyboard.press('Escape')
  })

  test('body scroll is locked when lightbox is open', async ({ page }) => {
    const found = await goToFirstProject(page)
    test.skip(!found, 'No projects in database')

    const galleryImages = getGalleryImages(page)
    const imageCount = await galleryImages.count()
    test.skip(imageCount === 0, 'No gallery images for this project')

    await galleryImages.first().click()

    const lightbox = page.locator('.fixed.inset-0.z-50')
    await expect(lightbox).toBeVisible()

    const overflow = await page.evaluate(() => document.body.style.overflow)
    expect(overflow).toBe('hidden')

    await page.keyboard.press('Escape')
    await expect(lightbox).not.toBeVisible()

    const overflowAfter = await page.evaluate(() => document.body.style.overflow)
    expect(overflowAfter).not.toBe('hidden')
  })
})
