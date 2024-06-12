import { expect } from "@playwright/test";

import { ItemData } from "../models/item-data";

import { By, PageAbstract } from "./page-abstract.po";
import { PayWithCardIframePopup } from "../pages/pay-with-card-iframe-popup.po";
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
        return (await this.getElements(By.css(checkoutPage.tableRow))).length;
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


    public async calculateExpectedTotal(addedItems: ItemData[]): Promise<string> {
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

    async clickOnPayWithCardButton(): Promise<PayWithCardIframePopup> {
        await this.getElement(
            By.css(checkoutPage.payWithCardButton),
        ).click();
        return new PayWithCardIframePopup(this.page);
    }
}