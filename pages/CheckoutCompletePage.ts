import {Page, Locator} from '@playwright/test';

export class CheckoutCompletePage {
    readonly page: Page;
    readonly completeHeader: Locator;
    readonly BackHomeButton: Locator;
    readonly GeneratePdfOrder: Locator;

    constructor(page: Page){
        this.page = page;
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.BackHomeButton = page.locator('[data-test="back-to-products"]');
        this.GeneratePdfOrder = page.locator('[data-test="generate-pdf-order"]');
    }
}