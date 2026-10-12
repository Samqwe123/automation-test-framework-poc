import {Page, Locator} from '@playwright/test';

export class CartPage{
//variable declaration
readonly page: Page;
readonly cartItems: Locator;
readonly checkoutButton: Locator;
readonly continueShoppingButton: Locator;
readonly productName: Locator;

//constructor
constructor(page: Page){
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.productName= page.locator('[data-test="inventory-item-name"]');
}
// this no need async because just get n use
getCartItemByName(name: string): Locator{
    return this.cartItems.filter({hasText: name});
}

getCartItemByDesc(desc: string): Locator{
    return this.cartItems.filter({hasText:desc});
}

async removeItems(name: string): Promise<void>{
    // get name , then getbyrole with role and 'Remove' word
    const item = this.getCartItemByName(name);
    //get the specific item from the cart list
    await item.getByRole('button', {name: 'Remove'}).click();
}

async payment(): Promise<void> {
    await this.checkoutButton.click();
}


}
