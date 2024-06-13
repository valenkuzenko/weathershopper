# Temperature-Related Skincare Purchase Automation

## Project Description

This project automates the process of purchasing skincare products (moisturizers or sunscreens) based on the current temperature. The script navigates through a web application, checks the current temperature, and selects the appropriate skincare category (moisturizers if the temperature is low and sunscreens if the temperature is high). It then proceeds to add the least expensive items to the cart and completes the purchase process.

## Prerequisites

Before you can run this test, ensure you have the following installed on your platform:

- **Node.js** (version 14.x or later)
- **npm** (Node Package Manager, usually comes with Node.js)
- **Playwright** (version 1.15.0 or later)
- **TypeScript** (version 4.1 or later)

## Installation

### 1. Clone the Repository
First, clone the repository to your local machine:

```bash
git clone https://github.com/valenkuzenko/weathershopper.git
cd weathershopper
```

### 2. Install Dependencies
Install the necessary dependencies using npm:
```bash
npm install
```
This will install all required packages listed in the package.json file.

### 3. Install Docker
Go to [https://www.docker.com/](https://www.docker.com/)  to install it on your device

## Configuration

### Playwright
Ensure Playwright is set up correctly:
```bash
npx playwright install
```

# Running the Tests in Docker container

### 1. Build Docker image
- Navigate to Project Directory: Open a terminal or command prompt and navigate to the root directory of the Playwright project where the Dockerfile is located (in our case it's weathershopper folder) and enter:

```bash
docker build -t playwright-tests .
```

### 2. Run the Tests
After successful image build you'll see "What's Next?" text and two options - your environment is ready to ru the test: enter 

```bash
docker run --rm playwright-tests
```

# Project Structure
Here's a brief overview of the project structure:

# temperature-related-skincare-purchase

### tests/                     Test files
- both_cases_test.spec.ts     - test file for temperature-related purchase

### pages/                      Page Object Model files
- temperaturePage.po.ts          - Page class for the temperature page
- cataloguePage.po.ts            - Page class for the catalogue page
- checkoutPage.po.ts             - Page class for the checkout page
- payWithCardIframePopup.po.ts   - Page class for the payment details popup
- confirmationPage.po.ts         - Page class for the confirmation page
- locators.ts                    - locators of used pages splited into separate classes

### models/                      Helper functions and utilities
- cards.ts                       - class with a constructor method used for creating Card instances
- item-data.ts                   - class with items data structure

- Dockerfile (Docker configuration file, creates a Docker image tailored for running tests using Playwright)
- package.json                    - Project's package file
- README.md                       - Project's README file

# Contact
For any questions or feedback, please open an issue on this repository or contact valenkuzenko1101@gmail.com