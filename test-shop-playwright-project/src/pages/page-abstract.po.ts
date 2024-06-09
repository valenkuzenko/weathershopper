import { expect, Locator, Page } from '@playwright/test';

export abstract class PageAbstract {
    // Default base URL
    public static baseUrl = 'https://weathershopper.pythonanywhere.com/';

    constructor(protected page: Page) {}

    // Wait for a specific URL
    protected async waitForUrl(url = PageAbstract.baseUrl, timeout = 30000): Promise<void> {
        await this.page.waitForURL(url, { timeout });
    }

    // Refresh the page and wait for it to load
    async refreshPage(): Promise<void> {
        await this.page.reload();
        await this.page.waitForLoadState('load');
    }

    // Utility function to format strings
    public static format(message: string, arg0: number | string): string {
        return message.replace('{0}', arg0.toString());
    }

    // Verify the page title
    public async verifyTitle(expectedTitle: string): Promise<void> {
        const title = await this.page.locator('h2').innerText();
        expect(title).toEqual(expectedTitle);
    }

    // Combine locators
    protected chainLocators(locators: string[]): Locator {
        return locators
            .filter((selector) => !!selector)
            .splice(1)
            .reduce<Locator>(
                (locator, selector: string) =>
                    selector.includes('|')
                        ? locator.locator(selector.split('|')[0]).filter({ hasText: selector.split('|')[1] })
                        : locator.locator(selector),
                locators[0].includes('|')
                    ? this.page.locator(locators[0].split('|')[0]).filter({ hasText: locators[0].split('|')[1] })
                    : this.page.locator(locators[0]),
            );
    }

    // Get a single element by chaining locators
    getElement(...locators: string[]): Element {
        return new Element(this.chainLocators(locators), this.page);
    }

    // Get multiple elements by chaining locators
    async getElements(...locators: string[]): Promise<Element[]> {
        const elem = new Element(this.chainLocators(locators), this.page);
        return elem.all();
    }
}

export class Element {
    constructor(protected element: Locator, protected page: Page) {}

    // We use will all to get the count of similar objects on the page to later iterate by this count
    async all(): Promise<Element[]> {
        const locators = await this.element.all();
        return locators.map((locator) => new Element(locator, this.page));
    }

    async click(timeout = 30000): Promise<Element> {
        await this.element.click({ timeout });
        return this;
    }

    // In the methods were we interact with elements using By class, we will use
    // this custom way of getting inner text to reduce the amount of code and make it more readable
    async getText(): Promise<string> {
        return await this.element.innerText();
    }
}

export class By {
    static css(locator: string): string {
        return locator;
    }
}
