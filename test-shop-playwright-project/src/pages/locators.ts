export enum mainPage {
    buyMoisturizersButton = 'a[href="/moisturizer"] button',
    buySunscreensButton = 'a[href="/sunscreen"] button',
}

export enum products {
    itemsRowByPositon = 'div:nth-of-type({0})', // items rows are counted from 2
    itemInRowByPosition = '.col-4:nth-of-type({0})', // items in row are counted from 1
    itemTitle = 'p.top-space-10',
    itemPrice = 'p.top-space-10+p',
    cartButton = '.navbar button',
    cartButtonText = '#cart'
}

export enum checkoutPage {
    tableRowByPosition = 'tr:nth-child({0})',
    titleCell = 'td:nth-child(1)',
    priceCell = 'td:nth-child(2)',
    total = '#total',
    payWithCardButton = '.stripe-button-el',
}