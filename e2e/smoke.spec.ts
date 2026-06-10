import { test, expect, type Page } from '@playwright/test'

const ROUTES = ['/', '/heatmap', '/tracking', '/satelital', '/draw', '/storymap']

const IGNORED_ERRORS = [/mapbox/i, /webgl/i, /access token/i, /Failed to fetch/i]

const collectPageErrors = (page: Page): string[] => {
  const errors: string[] = []
  page.on('pageerror', (error) => {
    if (!IGNORED_ERRORS.some((pattern) => pattern.test(error.message))) {
      errors.push(error.message)
    }
  })
  return errors
}

for (const route of ROUTES) {
  test(`renders ${route} without application errors`, async ({ page }) => {
    const errors = collectPageErrors(page)

    await page.goto(route)
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByText('GeoInsights').first()).toBeVisible()

    await page.waitForTimeout(1500)
    expect(errors).toEqual([])
  })
}

test('navigates from the hub to a demo through the navbar', async ({ page }) => {
  await page.goto('/')
  await page.locator('nav a[href="/heatmap"]').first().click()
  await expect(page).toHaveURL(/\/heatmap/)
  await expect(page.locator('nav')).toBeVisible()
})
