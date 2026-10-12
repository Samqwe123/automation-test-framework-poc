import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutStepOne } from "../../pages/CheckoutStepOnePage";
import { CheckoutStepTwoPage } from "../../pages/CheckoutStepTwoPage";
import { CheckoutCompletePage } from "../../pages/CheckoutCompletePage";

test.describe("Fill In the Info", () => {
  let loginPage: LoginPage;
  let cartPage: CartPage;
  let checkoutStepOne: CheckoutStepOne;
  let inventoryPage: InventoryPage;

  const targetItem = "Sauce Labs BackPack";

  //test before run scripts
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cartPage = new CartPage(page);
    checkoutStepOne = new CheckoutStepOne(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL(/.*inventory.html/);
    await inventoryPage.addItemToCart(targetItem);
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await cartPage.payment();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
  });

  test("should proceed to second checkout page with valid infos", async ({
    page,
  }) => {
    await checkoutStepOne.fillInInfoformation("Lee", "Orb", "43500");
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
  });

  test("should display error if one field is blank", async ({ page }) => {
    await checkoutStepOne.ClickNoInfoContinue();

    await expect(checkoutStepOne.errorMessage).toBeVisible();
    await expect(checkoutStepOne.errorMessage).toContainText(
      "Error: First Name is required",
    );
  });
});

test.describe("Complete Checkout Funnel", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOne;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutCompletePage: CheckoutCompletePage;

  const targetItem = "Sauce Labs Backpack";

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOne(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");
    await inventoryPage.addItemToCart(targetItem);
    await inventoryPage.openCart();
    await cartPage.payment();
    await checkoutStepOnePage.fillInInfoformation("Sam", "Test", "57000");
  });

  test("should complete end to end purchase successfully", async ({ page }) => {
    //check if navigate to second screen of checkout
    await expect(page).toHaveURL(/.*checkout-step-two.html/, {timeout: 10000});
    await expect(checkoutStepTwoPage.cartItem).toHaveCount(1);

    await checkoutStepTwoPage.finishCheckout();

    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText(
      "Thank you for your order!",
    );
  });

  test("should complete end to end purchase if two items selected", async ({
    page,
  }) => {
    const target_items2 = "Sauce Labs Bike Light";

    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(checkoutStepTwoPage.cartItem).toHaveCount(1);
    await inventoryPage.openBurgerSideBar();
    //await inventoryPage.InventorySideBarLink.click();
    await inventoryPage.InventorySideBarLink.click();
    await inventoryPage.addItemToCart(target_items2);
    await inventoryPage.openCart();
    await cartPage.payment();

    await checkoutStepOnePage.fillInInfoformation("Sam", "Test", "57000");
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(checkoutStepTwoPage.cartItem).toHaveCount(2);
    //final checkout
    await checkoutStepTwoPage.finishCheckout();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(checkoutCompletePage.completeHeader).toHaveText(
      "Thank you for your order!",
    );
  });
});
