import { expect } from "playwright/test";

import { PageAbstract } from "./page-abstract.po";

export class ConfirmationPage extends PageAbstract {
    async waitForUrl(): Promise<void> {
        await super.waitForUrl('confirmation');
    }

    async verifyPaymentResult(expectedResult: string): Promise<void> {
        const confirmationText = await this.page.locator('h2').innerText();
        expect(confirmationText).toEqual(expectedResult);
    }
}