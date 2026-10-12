import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutStepOne } from "../../pages/CheckoutStepOnePage";

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
