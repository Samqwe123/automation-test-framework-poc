import {test, expect} from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage';
import {InventoryPage} from '../../pages/InventoryPage'

test.describe('SauceDemo Inventroy Test', ()=> {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);

        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/.*inventory.html/);
    });


    test('should display all 6 inventory items', async () => {
        await expect(inventoryPage.inventoryItems).toHaveCount(6);
    });

    test('should update cart badge when adding and removing an item' ,async({page})=>{
        await expect(page).toHaveTitle("Swag Labs");
        await expect(page).toHaveURL(/.*inventory.html/);

        const productName = 'Sauce Labs Backpack';

        //Add item into cart
        await inventoryPage.addItemToCart(productName);
        await expect(inventoryPage.shoppingCartBadge).toHaveText("1");

        await inventoryPage.removeItemFromCart(productName);
        await expect(inventoryPage.shoppingCartBadge).not.toBeVisible();

    })

    test('test button', async () => {
        await inventoryPage.openBurgerSideBar();
    })
})