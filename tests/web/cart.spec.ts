import {test, expect} from '@playwright/test';
import {LoginPage} from '../../pages/LoginPage';
import {InventoryPage} from '../../pages/InventoryPage';
import {CartPage} from '../../pages/CartPage';

test.describe('Cart Operations', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    const targetItem = 'Sauce Labs Backpack';
    const targetItem2 = 'Sauce Labs Bike Light';

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        //log in
        await loginPage.navigate();
        await loginPage.login('standard_user' , 'secret_sauce');
        await expect(page).toHaveURL(/.*inventory.html/);

        //then pick an item and navigate to checkout page
        await inventoryPage.addItemToCart(targetItem);
        await inventoryPage.openCart();
        await expect(page).toHaveURL(/.*cart.html/);
        });

        test('should display the added product in the cart' , async ({page}) => {
            const item1 = cartPage.getCartItemByName(targetItem);

            //verify the specific row is visible and make sure only 2 is added inside the cart
            await expect(item1).toBeVisible();
            await expect(cartPage.cartItems).toHaveCount(1);
            //second item
            await cartPage.continueShoppingButton.click();
            await expect(page).toHaveURL(/.*inventory.html/);
            await inventoryPage.addItemToCart(targetItem2);
            await inventoryPage.openCart();
            await expect(page).toHaveURL(/.*cart.html/);
            await expect(cartPage.cartItems).toHaveCount(2);

        });

        test('should remove the product from the cart successfully', async ({page}) => {
            
            await cartPage.continueShoppingButton.click();
            await expect(page).toHaveURL(/.*inventory.html/);
            await inventoryPage.addItemToCart(targetItem2);
            await inventoryPage.openCart();
            await expect(page).toHaveURL(/.*cart.html/);
            await expect(cartPage.cartItems).toHaveCount(2);

            //remove item 2
            await cartPage.removeItems(targetItem2);
            await expect(cartPage.cartItems).toHaveCount(1);
            await expect(cartPage.getCartItemByName(targetItem2)).not.toBeVisible();
            
            //remove final item
            await cartPage.removeItems(targetItem);
            await expect(cartPage.cartItems).toHaveCount(0);
            await expect(cartPage.getCartItemByName(targetItem)).not.toBeVisible();
            
        });

        test('should navigate to checkout step one when clicking checkout', async ({page})=> {
            await cartPage.payment();
            await expect(page).toHaveURL(/.*checkout-step-one.html/);
        })

})