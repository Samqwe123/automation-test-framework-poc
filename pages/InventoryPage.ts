import {type Page,type Locator} from '@playwright/test'

export class InventoryPage {

    private readonly page: Page;
    readonly inventoryItems: Locator;
    readonly shoppingCartBadge: Locator;
    readonly shoppingCartLink: Locator;
    readonly productSortDropdown: Locator;
    readonly burgerSideBar: Locator;

    constructor(page: Page){
        this.page = page;
        this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
        //inventoryItems control all cards
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
        this.productSortDropdown = page.locator('[data-test="product-sort-container"]');
        //or can use direct ID selector (example: '#react-burger-menu-btn')
        this.burgerSideBar = page.getByRole('button', {name: 'Open Menu'});
    }

    // Locates a specific product card dynamically by its visible name
    // it return as locator (so it can specific focus on the card)
    private FindAProductName (productName:string): Locator {
        return this.inventoryItems.filter({hasText: productName});
    }

    //adds a specific product to the cart
    // need to be async , cuz await need it
    async addItemToCart(productName: string): Promise<void> {
        //this "item" is a locator, so it can use getByRole
        const item = this.FindAProductName(productName);
        await item.getByRole('button', {name: 'Add to cart' }).click();
    }

    async removeItemFromCart(productName: string): Promise<void> {
        const item = this.FindAProductName(productName);
        await item.getByRole('button', {name: 'Remove'}).click();
    }

    //just press the filter and filter it
    async sortProductsBy(optionValue: string): Promise<void> {
        await this.productSortDropdown.selectOption(optionValue);
    }

    async openBurgerSideBar(): Promise<void> {
        await this.burgerSideBar.click();
    }

    async openCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }

}

