# weathershopper

RUN DIRECTIONS

1. Clone your Playwright project repository from the external source to your local machine and open in your IDE.
2. Navigate to Project Directory: Open a terminal or command prompt and navigate to the root directory of the Playwright
project where the Dockerfile is located. (use cd command. i.g.: my-device: username$ cd test-shop-playwright-project)
3. When your row looks "my-device:test-shop-playwright-project username$ " enter "docker build -t playwright-tests ." command
This command will build your Docker image.
4. After successful image build you'll see "What's Next?" text and two options - your environment is ready to ru the test:
enter "docker run --rm playwright-tests" command.
Next you will see:
(named parameters are announced and can be changed in playwright.config.ts file. here i add after // the exact rows in file):

Running 1 test using 1 worker // (row 27)

  ✓  1 [chromium] › test.spec.ts:28:9 › proper skincare purchase path › check temperature related successful purchase (10.5s) // (row 39)

  1 passed (11.1s)

To open last HTML report run: // (row 28)

  npx playwright show-report

5. After entering command "npx playwright show-report" the page with report will open in your default browser

TEST DESCRIPTION
This test simulates an automated workflow for purchasing skincare products based on the current temperature.
The test navigates through a skincare shopping website and verifies the successful purchase of moisturizers or sunscreens
depending on the temperature conditions.

------------------------------------------------------------------------------------------------------------------------
Steps:

Initialization:
- Initialize the required page objects (MainPage, CataloguePage, CheckoutPage, PayWithCardIframePopup, ConfirmationPage)
for structured test execution.

Navigate to Website:
- Navigate to the skincare shopping website (https://weathershopper.pythonanywhere.com/).
- Verify the title of the main page to ensure correct navigation.

Check Current Temperature:
- Get the current temperature from the website.
- Determine the skincare products needed based on temperature:
Condition 1: If the temperature is below 19°C, select moisturizers with Aloe and Almond.
Condition 2:If the temperature is above 34°C, select sunscreens with SPF-50 and SPF-30.
- If the temperature is between 19°C and 34°C, refresh the page until temperature belongs to one of the mentioned conditions.

Select Skincare Products:
- Click on the appropriate category button (Buy Moisturizers or Buy Sunscreens).
- Wait for the respective category page to load and verify the page title.

Verify Empty Cart:
- Ensure that the shopping cart is empty before adding items.

Select Second Target Item:
- If the least expensive second target item (moisturizer with almond or sunscreen with SPF-30) is not present at the page,
refresh the catalogue page until it is found. (we do this first, as refresh clears the cart, and we need to see both items in it)
- Add the item to the shopping cart.

Select First Target Item:
- Find and add the least expensive first target item (Aloe moisturizer or sunscreen with SPF-50) to the shopping cart.

Verify Cart Contents:
Confirm that both items are successfully added to the cart.
Verify that the cart contains exactly 2 items.

Proceed to Checkout:
Click on the cart button to proceed to checkout.

Verify Checkout Page:
- Wait for the checkout page to load and verify the page title.
- Verify that the table displays the selected items.
- Calculate the expected total based on the selected items and verify the displayed total.

Proceed to Payment:
- Click on the "Pay with Card" button to initiate the payment process.

Fill Payment Details:
- Wait for the payment popup to load and verify its presence.
- Enter fake email address and randomly generated card details for payment.

Verify Payment Success:
- Wait for the confirmation page to load and verify the payment result as "PAYMENT SUCCESS".

Expected Outcome:
The test is expected to navigate through the website, select appropriate skincare products based on temperature,
add them to the cart, proceed through the checkout process, and successfully complete the payment.
