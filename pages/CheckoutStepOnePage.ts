import { Page,Locator } from "@playwright/test";

export class CheckoutStepOne{

//variable
readonly page: Page;
readonly firstName: Locator;
readonly lastName: Locator;
readonly zipPostalCode: Locator;
readonly ContinueButton: Locator;
readonly CancelButton: Locator;
readonly errorMessage: Locator;


constructor(page: Page){
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[placeholder="Last Name"]');
    this.zipPostalCode = page.locator('[data-test="postalCode"]');
    this.ContinueButton = page.locator('[data-test="continue"]');
    this.CancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
}

async fillInInfoformation(firstName: string, lastName: string, postalCode: string): Promise<void>{
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.zipPostalCode.fill(postalCode);
    await this.ContinueButton.click();
}


async ClickNoInfoContinue(): Promise<void>{
    await this.ContinueButton.click();
}
}