import { test, expect } from '@playwright/test'

test('mock login redirects to home and persists the token', async ({ page }) => {
  await page.goto('/login')

  await page.getByRole('button', { name: /continue with spotify/i }).click()

  await expect(page).toHaveURL('/')

  const token = await page.evaluate(() => window.localStorage.getItem('kanaplay_token'))
  expect(token).toBeTruthy()
})
