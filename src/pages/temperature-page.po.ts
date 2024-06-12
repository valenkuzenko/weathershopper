import { Page } from "@playwright/test";

import { By, PageAbstract } from "./page-abstract.po";
import { CataloguePage } from "../pages/catalogue-page.po";
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

    async clickOnByMoistrizersButton(): Promise<CataloguePage> {
        await this.getElement(
            By.css(temperaturePage.buyMoisturizersButton),
        ).click();
        return new CataloguePage(this.page);
    }

    async clickOnBySunscreensButton(): Promise<CataloguePage> {
        await this.getElement(
            By.css(temperaturePage.buySunscreensButton),
        ).click();
        return new CataloguePage(this.page);
    }
}