 # Using the official Playwright image as a base
FROM mcr.microsoft.com/playwright:focal

 # Setting the working directory
WORKDIR /usr/src/app

 # Copying package.json and package-lock.json
COPY package*.json ./

 # Installing all dependencies
RUN npm install

 # Copying all the project files to the working directory of the container
COPY . .

 # Starting Playwright to install browsers and dependencies
RUN npx playwright install --with-deps

 # Setting the start command to run the tests in headless mode with Chromium
CMD ["npx", "playwright", "both_cases_test"]
