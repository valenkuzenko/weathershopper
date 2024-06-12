import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { Card } from "../models/cards";
import { ItemData } from "../models/item-data";

import { TemperaturePage } from "../pages/temperature-page.po";
import { CataloguePage } from "../pages/catalogue-page.po";
import { CheckoutPage } from "../pages/checkout-page.po";
import { PayWithCardIframePopup } from "../pages/checkout-page.po";
import { ConfirmationPage } from "../pages/confirmation-page.po";

test.describe('proper skincare purchase path', () => {
    /**
     * Steps:
     * 1. Make sure you're at the temperature page
     * 2. Get the current temperature value
     * 3. Get to the proper product catalogue page according to the task (click on "Moisturizers"/"Sunscreens" button)
     * task: Shop for moisturizers if the weather is below 19 degrees. Shop for suncreens if the weather is above 34 degrees.
     * 4. Add to cart the least expensive products that contain needed parameters
     * task: Aloe & almond containing items among moisturizers or SPF-50 & SPF-30 among suncreens
     * 5. Move to cart (click on "Cart" button)
     * task: Verify table looks correct. Fill out payment details and submit the form.
     * 6. Verify all selected items are in the cart and the total price
     * 7. Pay for items (click on "Pay with card" button)
     * 8. Fill the popup fields by valid data and pay
     * 9. Verify the success message (if not, throw error)
     */
    test('check temperature related successful purchase', async ({ page }) => {
        // initializing the pages before for comfortable feature reading of the test steps
        let mainPage = new TemperaturePage(page);
        let cataloguePage = new CataloguePage(page);
        let checkoutPage = new CheckoutPage(page);
        let payWithCardPopup = new PayWithCardIframePopup(page);
        let confirmationPage = new ConfirmationPage(page);

        // selecting proper skincare category due to the temperature
        // go to baseURL
        await page.goto('/');
        await mainPage.verifyTitle('Current temperature');

        let currentTemperature = await mainPage.getCurrentTemperature(page);
        let neededItems: string[];

        while (true) {
            currentTemperature = await mainPage.getCurrentTemperature(page);

            if (currentTemperature < 19) {
                // if the temperature is low, we will select moistrizers with aloe and almond
                neededItems = ['Aloe', 'almond'];
                await mainPage.clickOnByMoistrizersButton();
                await cataloguePage.waitForMositurizersUrl();
                await cataloguePage.verifyTitle('Moisturizers');
                break;

            } else if (currentTemperature > 34) {
                // if the temperature is high, we will select sunscreens with SPF-50 and SPF-30
                neededItems = ['SPF-50', 'SPF-30'];
                await mainPage.clickOnBySunscreensButton();
                await cataloguePage.waitForSunscreensUrl();
                await cataloguePage.verifyTitle('Sunscreens');
                break;
            } else {
                // if the temperature is between 19 and 34 we come later (refresh page)
                await cataloguePage.refreshPage();
            }
        }
        await cataloguePage.verifyEmptyCart();

        // second item doesn't appear every time, so we refresh page till it gets found in the catalogue
        // as the cart gets empty after refresh, we firstly search for the second item
        let secondTargetItem: ItemData | undefined;
        while (!secondTargetItem) {
            await cataloguePage.refreshPage();
            secondTargetItem = await cataloguePage.getNeededItemLowestPriceItem(neededItems[1]);
        }
        // add to cart the least expensive second item (moisturizer that contains almond or sunscreen with SPF-30)
        await cataloguePage.addTargetItemToCheckout(secondTargetItem.itemTitle);

        // find and add to cart the least expensive first item (Aloe moisturizer or sunscreen with SPF-50)
        const firstTargetItem = await cataloguePage.getNeededItemLowestPriceItem(neededItems[0]);
        await cataloguePage.addTargetItemToCheckout(firstTargetItem.itemTitle);

        await cataloguePage.verifyAddedItemsCount('2');
        await cataloguePage.clickOnCartButton();

        // Verify table, verify total, and pay
        await checkoutPage.waitForUrl();
        await checkoutPage.verifyTitle('Checkout');
        await checkoutPage.verifyTable([secondTargetItem, firstTargetItem]);
        const expectedTotal = await checkoutPage.countExpectedTotal([secondTargetItem, firstTargetItem]);
        await checkoutPage.verifyTotal(expectedTotal);
        await checkoutPage.clickOnPayWithCardButton();

        // As we shift to the side service, we need to wait 3 seconds for payment popup to upload
        // (2 is enough, but we add 1 more to guarantee stability)
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Prepare and enter email & card data to continue
        const email = faker.internet.email({provider: 'gmail.com'});
        const cardData = Card.prepareRandomCardData();
        await payWithCardPopup.verifyPopupIsUploaded(page);
        await payWithCardPopup.fillPaymentDetails(page, email, cardData);

        await confirmationPage.waitForUrl();
        await confirmationPage.verifyPaymentResult("PAYMENT SUCCESS");
    });
});