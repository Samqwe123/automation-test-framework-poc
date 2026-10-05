import {Locator,Page} from '@playwright/test'

export class LoginPage{
    readonly page: Page;
    readonly passwordInput: Locator;
    readonly usernameInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page:Page){
        this.page = page;
        this.usernameInput=page.locator('[data-test="username"]');
        this.passwordInput=page.locator('[data-test="password"]');
        this.loginButton=page.locator('[data-test="login-button"]');
        this.errorMessage=page.locator('[data-test="error"]');
    }

    async navigate(): Promise<void>{
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(user: string, password: string):Promise<void>{
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}