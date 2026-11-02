import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { auditVisualUI } from '../../utils/aiVisualCheck';

test.describe('AI-Augmented Visual Regression Suite (Advisory Mode)', () => {

  test('Verify Login Page UI layout integrity', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // DOM assertions determine Test Pass/Fail
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // AI operates purely as an advisory diagnostic tool
    await auditVisualUI(page, 'SauceDemo Login Screen', testInfo);
  });

  test('Verify Inventory Page UI layout', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/.*inventory.html/);

    // AI attaches layout summary to the report
    await auditVisualUI(page, 'Inventory Products Grid', testInfo);
  });
});