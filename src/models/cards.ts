import { faker } from '@faker-js/faker';

export class Card {
    public cardNumber: string;
    public expireMonth: string;
    public expireYear: string;
    public cvc: string;
    public zip: string;

    constructor() {
        this.cardNumber = '';
        this.expireMonth = '';
        this.expireYear = '';
        this.cvc = '';
        this.zip = '';
    }

    // here we form random data as a precondition for the feather mandatory checks
    // some cards might trigger the display of s ZIP field. it has no validation UnionPay (19-digit card)
    public getRandomCardData(): Card {
        // got back to this way of preparing card number, as it provides a stable result
        // #creditcardnumber by faker sometimes returns invalid card numbers
        const cardNumbers = [
            "4242424242424242", // Visa
            "4000056655665556", // Visa (debit)
            "5555555555554444", // Mastercard
            "2223003122003222", // Mastercard (2-series)
            "5200828282828210", // Mastercard (debit)
            "378282246310005",  // American Express
            "6205 5000 0000 0000 004" // UnionPay (19-digit card)
        ];
        const randomCardNumber = cardNumbers[Math.floor(Math.random() * cardNumbers.length)];

        // the validation demands the expire date to be later than current.
        // to fit we set the same month but the next year
        const currentDate = new Date();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const currentYear = currentDate.getFullYear().toString().slice(-2);
        const expireMonth = currentMonth;
        const expireYear = (+currentYear + 1).toString().padStart(2, '0');

        // https://next.fakerjs.dev/api/finance.html#creditcardcvv 
        const randomCvc = faker.finance.creditCardCVV();

        this.cardNumber = randomCardNumber;
        this.expireMonth = expireMonth;
        this.expireYear = expireYear;
        this.cvc = randomCvc;
        this.zip = 'lol';

        return this;
    }
}