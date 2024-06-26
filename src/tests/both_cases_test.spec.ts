import { test, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { Card } from "../models/cards";
import { ItemData } from "../models/item-data";

import { TemperaturePage } from "../pages/temperature-page.po";
import { CataloguePage } from "../pages/catalogue-page.po";

enum NeededItems {
  Moisturizer1 = 'Aloe',
  Moisturizer2 = 'almond',
  Sunscreen1 = 'SPF-50',
  Sunscreen2 = 'SPF-30',
}

interface WhatAndWereWeWillSearch {
  neededItems: string[];
  cataloguePage: CataloguePage;
}

async function conditionDependentSteps(page: Page, type: string): Promise<WhatAndWereWeWillSearch> {
  const temperaturePage = new TemperaturePage(page);
  let neededItems: string[];
  let cataloguePage: CataloguePage;

  if (type === 'low') {
    neededItems = [NeededItems.Moisturizer1, NeededItems.Moisturizer2];
    cataloguePage = await temperaturePage.clickOnByMoistrizersButton();
    await cataloguePage.waitForMositurizersUrl();
    await cataloguePage.verifyTitle('Moisturizers');
  } else if (type === 'high') {
    neededItems = [NeededItems.Sunscreen1, NeededItems.Sunscreen2];
    cataloguePage = await temperaturePage.clickOnBySunscreensButton();
    await cataloguePage.waitForSunscreensUrl();
    await cataloguePage.verifyTitle('Sunscreens');
  } else {
    // to make sure we will get to return only with proper values
    throw new Error(`Unknown type: ${type}`);
  }

  return { neededItems, cataloguePage };
}

test.describe('proper skincare purchase path', () => {
    /**
     * Steps:
     * 1. Announce both cases we need to check
     * 2. Start with "low" condition
     * 3. Get temperature value and refresh page if needed till it's below 19 degrees
     * 4. Move to moisturizers page (click on "Moisturizers" button), 
     * 5. Find and add to cart the least expensive products that contain needed parameters
     * 6. Move to cart (click on "Cart" button)
     * 7. Verify all selected items are in the cart and the total price
     * 8. Pay for items (click on "Pay with card" button)
     * 9. Fill the popup fields by valid data and pay
     * 10. Verify the success message (if not, throw error)
     * 11. Step to "high" condition
     * 12. Get temperature value and refresh page if needed till it's above 34 degrees
     * 13. Move to sunscreens page (click on "Sunscreens" button)
     * 14. Repete steps 5 - 10 for the "high" condition
     */
    test('check temperature related successful purchase', async ({ page }) => {
        // selecting proper skincare category due to the temperature
        // go to baseURL
        const conditions = ['low', 'high'];
        for (let conditionType of conditions) {
          await page.goto('/');
          const mainPage = new TemperaturePage(page);
          await mainPage.verifyTitle('Current temperature');

          let currentTemperature = await mainPage.getCurrentTemperature(page);
        
          if (conditionType === 'low') {
            do {
              currentTemperature = await mainPage.getCurrentTemperature(page);
              if (currentTemperature >= 19) {
                await mainPage.refreshPage();
              }
            } while (currentTemperature >= 19);
          } else if (conditionType === 'high') {
            do {
              currentTemperature = await mainPage.getCurrentTemperature(page);
              if (currentTemperature <= 34) {
               await mainPage.refreshPage();
             }
            } while (currentTemperature <= 34);
          }
          // performing condition dependent steps due to current condition type
          const { neededItems, cataloguePage } = await conditionDependentSteps (page, conditionType);
          // const cataloguePage = { neededItems, cataloguePage }.cataloguePage;
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
          const checkoutPage = await cataloguePage.clickOnCartButton();
  
          // Verify table, verify total, and pay
          await checkoutPage.waitForUrl();
          await checkoutPage.verifyTitle('Checkout');
          await checkoutPage.verifyTable([secondTargetItem, firstTargetItem]);
          const expectedTotal = await checkoutPage.calculateExpectedTotal([secondTargetItem, firstTargetItem]);
          await checkoutPage.verifyTotal(expectedTotal);
          const payWithCardPopup = await checkoutPage.clickOnPayWithCardButton();
  
          // As we shift to the side service, we need to wait 3 seconds for payment popup to upload
          // (2 is enough, but we add 1 more to guarantee stability)
          await new Promise(resolve => setTimeout(resolve, 3000));
  
          // Prepare and enter email & card data to continue
          const email = faker.internet.email({provider: 'gmail.com'});
          const cardData = new Card();
          cardData.getRandomCardData();
  
          await payWithCardPopup.verifyPopupIsUploaded(page);
          await payWithCardPopup.fillPaymentDetails(page, email, cardData);
          const confirmationPage = await payWithCardPopup.submitPaymentDetails(page);
  
          await confirmationPage.waitForUrl();
          await confirmationPage.verifyPaymentResult("PAYMENT SUCCESS");
        }
    });
});