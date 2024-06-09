import { Page } from "@playwright/test";

import { By, PageAbstract } from "./page-abstract.po";
import { mainPage } from "./locators";

export class MainPage extends PageAbstract {
    async getCurrentTemperature(page: Page): Promise<number> {
        const temperatureLocator = await page.$('#temperature');
        if (!temperatureLocator) {
            throw new Error('Temperature element not found');
        }

        const temperatureText = await temperatureLocator.innerText();
        const temperature = parseFloat(temperatureText.split(' ')[0]);

        if (isNaN(temperature)) {
            throw new Error('Failed to parse temperature');
        }

        return temperature;
    }

    async clickOnByMoistrizersButton(): Promise<void> {
        await this.getElement(
            By.css(mainPage.buyMoisturizersButton),
        ).click();
    }

    async clickOnBySunscreensButton(): Promise<void> {
        await this.getElement(
            By.css(mainPage.buySunscreensButton),
        ).click();
    }
}