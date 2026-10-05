import {test, expect, Page} from '@playwright/test'
import { LoginPage} from '../../pages/LoginPage'

test.describe('log in group', ()=>{
    test("log in successfully module", async ({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('failed to log in', async ({page})=>{
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('locked_out_user', 'secret_sauce');

        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText('locked out');
        //await expect(loginPage.errorMessage).toContainText('locked out', {ignoreCase: true });
    })
})