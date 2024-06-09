import { expect, Page } from "@playwright/test";

import { ItemData } from "../models/item-data";
import { Card } from "../models/cards";

import { By, PageAbstract } from "./page-abstract.po";
import { checkoutPage } from "./locators";

export class CheckoutPage extends PageAbstract {
    async waitForUrl(): Promise<void> {
        await super.waitForUrl('cart');
    }

    // we expect the items order in cart is from first added to last
    public async verifyTable(addedItems: ItemData[]): Promise<void> {
        const rowsCount = await this.getRowsCount();
        for (let i = 0; i < rowsCount; i++) {
            // positions in array start with 0 and rows in the table body start with 1, so we set "i + 1" as the row position
            await this.verifyItemTitle(addedItems[i].itemTitle, i + 1);
            await this.verifyItemPrice(addedItems[i].itemPrice.toString(), i + 1);
        }
    }

    async getRowsCount(): Promise<number> {
        return (await this.getElements(By.css('tbody tr'))).length;
    }

    async verifyItemTitle(expectedTitle: string, rowPos: number): Promise<void> {
        const rowTitle = await this.getElement(
            By.css(CheckoutPage.format(checkoutPage.tableRowByPosition, rowPos)),
            By.css(checkoutPage.titleCell),
        ).getText();
        expect(rowTitle).toEqual(expectedTitle);
    }

    async verifyItemPrice(expectedPrice: string, rowPos: number): Promise<void> {
        const rowPrice = await this.getElement(
            By.css(CheckoutPage.format(checkoutPage.tableRowByPosition, rowPos)),
            By.css(checkoutPage.priceCell),
        ).getText();
        expect(rowPrice).toContain(expectedPrice);
    }


    public async countExpectedTotal(addedItems: ItemData[]): Promise<string> {
        const rowsCount = await this.getRowsCount();
        let total = 0;
        for (let i = 0; i < rowsCount; i++) {
            total += addedItems[i].itemPrice
        }
        return total.toString()
    }

    async verifyTotal(expectedTotal: string): Promise<void> {
        const tableTotal = await this.getElement(
            By.css(checkoutPage.total),
        ).getText();
        expect(tableTotal).toContain(expectedTotal);
    }

    async clickOnPayWithCardButton(): Promise<void> {
        await this.getElement(
            By.css(checkoutPage.payWithCardButton),
        ).click();
    }
}

export class PayWithCardIframePopup extends PageAbstract {
    async verifyPopupIsUploaded(page: Page):Promise<void> {
        // Verify iFrame elements have uploaded. we check only one as they appear simultaneously
        const iFrameIsLoadedMarker = await page.$('.brandingLogoView');
        await iFrameIsLoadedMarker?.isVisible();
    }

    async fillPaymentDetails(page: Page, email: string, card: Card): Promise<void> {
        // Wait for the iFrame to appear in the DOM and check if frame is not null before further actions
        const iframeSelector = 'iframe[src*="stripe"]';
        await page.waitForSelector(iframeSelector);
        const iframeElement = await page.$(iframeSelector);
        const frame = await iframeElement?.contentFrame();

        if (frame) {
            // Fill payment details
            const emailInput = await frame.$('#email');
            await emailInput?.fill(email);
            card.cardNumber = '6205 5000 0000 0000 004';
            const cardNumberInput = await frame.$('#card_number');
            await cardNumberInput?.fill(card.cardNumber);
            const expireDateInput = await frame.$('#cc-exp');
            await expireDateInput?.fill(card.expireMonth + card.expireYear);
            const cvcInput = await frame.$('#cc-csc');
            await cvcInput?.fill(card.cvc);
            const zipInput = await frame.$('#billing-zip');
            // Zip input might be disabled, we won't try to fill this field if it's not displayed
            const isDisplayed = await zipInput?.evaluate((node) => {
                return window.getComputedStyle(node).display !== 'none';
            });
            if (!isDisplayed){
                await zipInput?.fill(card.zip);
            }
            const submitButton = await frame.$('#submitButton');
            await submitButton?.click();

        } else {
            throw new Error('Failed to access iframe content frame');
        }
    }
}