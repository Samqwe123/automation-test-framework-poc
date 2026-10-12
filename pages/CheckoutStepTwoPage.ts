import {Page, Locator } from '@playwright/test';

export class CheckoutStepTwoPage {
    readonly page: Page;
    readonly cancelButton: Locator;
    readonly finishButton: Locator;
    readonly cartItem: Locator;
    readonly summaryTotal: Locator;

    constructor(page:Page){
        this.page = page;
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cartItem = page.locator('[data-test="inventory-item"]');
        this.summaryTotal = page.locator('[data-test="total-label"]');
    };

    private getProductName(productName: string): Locator {
        return this.cartItem.filter({hasText: productName});
    };


    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    };



}