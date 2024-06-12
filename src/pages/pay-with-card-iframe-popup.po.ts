import { Page } from "@playwright/test";

import { Card } from "../models/cards";

import { PageAbstract } from "./page-abstract.po";

export class PayWithCardIframePopup extends PageAbstract {
    async verifyPopupIsUploaded(page: Page): Promise<void> {
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
            if (!isDisplayed) {
                await zipInput?.fill(card.zip);
            }
            const submitButton = await frame.$('#submitButton');
            await submitButton?.click();

        } else {
            throw new Error('Failed to access iframe content frame');
        }
    }
}