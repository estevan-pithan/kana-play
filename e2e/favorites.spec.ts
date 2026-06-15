import { test, expect } from '@playwright/test'

test('user can favorite a track from the home page and the heart stays toggled', async ({
  page,
}) => {
  await page.goto('/login')
  await page.getByRole('button', { name: /continue with spotify/i }).click()
  await expect(page).toHaveURL('/')

  const favoriteButton = page.getByRole('button', { name: /add to favorites/i }).first()
  await favoriteButton.click()

  const submit = page.getByRole('button', { name: /add to collection/i })
  await submit.click()

  await expect(page.getByRole('button', { name: /remove from favorites/i }).first()).toBeVisible()
})
