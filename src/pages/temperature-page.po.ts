import { Page } from "@playwright/test";

import { By, PageAbstract } from "./page-abstract.po";
import { temperaturePage } from "./locators";

export class TemperaturePage extends PageAbstract {
    async getCurrentTemperature(page: Page): Promise<number> {
        const temperatureLocator = await page.$('#temperature');
        if (!temperatureLocator) {
            throw new Error('Temperature element not found');
        }

        const temperatureText = await temperatureLocator.innerText();
        const currentTemperature = parseFloat(temperatureText.split(' ')[0]);

        if (isNaN(currentTemperature)) {
            throw new Error('Failed to parse temperature');
        }

        return currentTemperature;
    }

    async clickOnByMoistrizersButton(): Promise<void> {
        await this.getElement(
            By.css(temperaturePage.buyMoisturizersButton),
        ).click();
    }

    async clickOnBySunscreensButton(): Promise<void> {
        await this.getElement(
            By.css(temperaturePage.buySunscreensButton),
        ).click();
    }
}