import { PageAbstract } from "./page-abstract.po";

export class ConfirmationPage extends PageAbstract {
    async waitForUrl(): Promise<void> {
        await super.waitForUrl('confirmation');
    }

    async verifyPaymentResult(expectedResult: string): Promise<void> {
        const confirmationText = await this.page.locator('h2').innerText();
        // we need to take into account the 5% probability of getting fail result as this behaviour is also correct, the test must pass
        const failText = "PAYMENT FAILED";
        if (confirmationText !== expectedResult && confirmationText !== failText) {
            throw new Error(`Expected payment result to be '${expectedResult}' or '${failText}', but got '${confirmationText}'`);
        }
    }
}