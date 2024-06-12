import { expect, Locator } from "@playwright/test";

import { ItemData } from "../models/item-data";

import { By, PageAbstract } from "./page-abstract.po";
import { CheckoutPage } from "../pages/checkout-page.po";
import { cataloguePage } from "./locators";


export class CataloguePage extends PageAbstract {
    async waitForMositurizersUrl(): Promise<void> {
        await super.waitForUrl('moisturizer');
    }

    async waitForSunscreensUrl(): Promise<void> {
        await super.waitForUrl('sunscreen');
    }

    // methods to interact with catalogue items

    // getting price of the least expensive item that contains the ingredient or needed sun protection factor
    async getNeededItemLowestPriceItem(ingredient: string): Promise<ItemData> {
        const featuredMoisturisers: ItemData[] = [];
        // hardcoded 3 is items in the row count
        for (let i = 1; i <= 3; i++) {
            for (let j = 2; j <= 3; j++) {
                const itemTitle = await this.getItemsTitle(j, i);
                if (itemTitle.includes(ingredient)) {
                    const itemPrice = await this.getItemsPrice(j, i);
                    featuredMoisturisers.push(new ItemData(itemTitle, +itemPrice));
                }
            }
        }
        return this.getLowestPriceItem(featuredMoisturisers);
    }

    async getLowestPriceItem(aloeMoisturisers: ItemData[]): Promise<ItemData> {
        let minPrice = Infinity;
        let lowestPriceItem: ItemData = aloeMoisturisers[0];

        for (let i = 0; i < aloeMoisturisers.length; i++) {
            if (aloeMoisturisers[i].itemPrice < minPrice) {
                minPrice = aloeMoisturisers[i].itemPrice;
                lowestPriceItem = new ItemData(aloeMoisturisers[i].itemTitle, aloeMoisturisers[i].itemPrice);
            }
        }
        return lowestPriceItem;
    }

    async getItemsTitle(rowPos: number, itemPos: number): Promise<string> {
        return await this.getElement(
            By.css(CataloguePage.format(cataloguePage.itemsRowByPositon, rowPos)),
            By.css(CataloguePage.format(cataloguePage.itemInRowByPosition, itemPos)),
            By.css(cataloguePage.itemTitle),
        ).getText();
    }

    async getItemsPrice(rowPos: number, pricePos: number): Promise<number> {
        const itemPriceText = await this.getElement(
            By.css(CataloguePage.format(cataloguePage.itemsRowByPositon, rowPos)),
            By.css(CataloguePage.format(cataloguePage.itemInRowByPosition, pricePos)),
            By.css(cataloguePage.itemPrice),
        ).getText();
        // From all price text we need only the digits so we use a regular expression to get them
        return parseInt(itemPriceText.replace(/[^\d]/g, ''), 10);
    }

    async addTargetItemToCheckout(itemTitle: string): Promise<void> {
        const buttonSelector = `button[onclick*="${itemTitle}"]`;
        const element: Locator = this.page.locator(buttonSelector);
        // There's a low probability that we don't get both items on one page
        // In such case we won't find the button with the fist needed item title
        // The message will help us to know the reason of the crash right after it happens
        if (await element.count() === 0 || !await element.isVisible()) {
            throw new Error(`The product with ${itemTitle} is absent on page`);
        }
        await element.click();
    }

    // methods to interact with cart

    public async verifyEmptyCart(): Promise<void> {
        const cartButtonText = await this.getElement(
            By.css(cataloguePage.cartButtonText),
        ).getText();
        // adding gaps to make sure we have the passed number, not the several digits that contain it
        expect(cartButtonText).toEqual('Empty');
    }

    public async verifyAddedItemsCount(expectedCount: string): Promise<void> {
        const cartButtonText = await this.getElement(
            By.css(cataloguePage.cartButtonText),
        ).getText();
        // adding gaps to make sure we have the passed number, not the several digits that contain it
        expect(cartButtonText).toContain(expectedCount + ' ');
    }

    async clickOnCartButton(): Promise<CheckoutPage> {
        await this.getElement(
            By.css(cataloguePage.cartButton),
        ).click();
        return new CheckoutPage(this.page);
    }
}