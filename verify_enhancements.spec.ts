import { test, expect } from '@playwright/test';

test('verify enhancements', async ({ page }) => {
  // Go to home
  await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Screenshot Dashboard with new widgets
  await page.screenshot({ path: 'dashboard_enhanced.png', fullPage: true });

  // 1. Task Creation with Knowledge Link
  await page.locator('text=Neue Aufgabe erstellen').click();
  await page.waitForTimeout(500); // Wait for expand
  await page.screenshot({ path: 'task_creator_enhanced.png' });
  // Close task creator (reload page easiest)
  await page.reload();

  // 2. Reflection Widget
  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'reflection_widget.png' });

  // Click "Tag abschließen" to see prompts
  await page.getByRole('button', { name: 'Tag abschließen' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'reflection_open.png' });

  // 3. Weekly Review
  // Click the bar chart icon in header
  await page.locator('button[title="Wochenrückblick"]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'weekly_review_modal.png' });
  // Close modal
  await page.keyboard.press('Escape');

  // 4. Focus Page
  await page.goto('http://localhost:8080/focus');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Wait for animations
  await page.screenshot({ path: 'focus_page.png' });

});
