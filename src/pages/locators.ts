export enum temperaturePage {
    buyMoisturizersButton = 'a[href="/moisturizer"] button',
    buySunscreensButton = 'a[href="/sunscreen"] button',
}

export enum cataloguePage {
    itemsRowByPositon = 'div:nth-of-type({0})', // rows start with 2
    itemInRowByPosition = '.col-4:nth-of-type({0})', // items in row start with 1
    itemTitle = 'p.top-space-10',
    itemPrice = 'p.top-space-10+p',
    cartButton = '.navbar button',
    cartButtonText = '#cart'
}

export enum checkoutPage {
    tableRow = 'tbody tr',
    tableRowByPosition = 'tr:nth-child({0})', // rows in the table body start with 1
    titleCell = 'td:nth-child(1)',
    priceCell = 'td:nth-child(2)',
    total = '#total',
    payWithCardButton = '.stripe-button-el',
}