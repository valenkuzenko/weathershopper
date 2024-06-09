import {By, PageAbstract} from "./page-abstract.po";
import {mainPage} from "./locators";
import {Page} from "@playwright/test";

export class MainPage extends PageAbstract {
    // async getCurrentTemperature(page: Page): Promise<number|undefined>{
    //     const temperatureLocator = await page.$('#temperature');
    //     const temperature = await temperatureLocator?.innerText();
    //     if (temperature)
    //     return +temperature.split(' ')[0]
    // }

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