import {Locator,Page} from '@playwright/test'

export class LoginPage{
    readonly page: Page;
    readonly passwordInput: Locator;
    readonly usernameInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page:Page){
        this.page = page;
        this.usernameInput = page.getByTestId('username');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.errorMessage = page.getByTestId('error');
    }

    async navigate(): Promise<void>{
        await this.page.goto('/');
    }

    async login(user: string, password: string):Promise<void>{
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}