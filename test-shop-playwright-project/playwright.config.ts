import { defineConfig, devices } from '@playwright/test';
import path from "node:path";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const args = process.argv.slice(2);
const projectIndex = args.findIndex((arg) => arg.startsWith('--project='));
if (projectIndex !== -1) process.env.PROJECT = args[projectIndex].split('=')[1];

const headless = true;
const envCI = !!process.env.CI;
export default defineConfig({
  outputDir: 'test-results',
  testDir: './src/tests',
  timeout: 120000, // global timeout to 120 seconds
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    headless: true,
    baseURL: 'https://weathershopper.pythonanywhere.com/',

    trace: 'on-first-retry',
  },

  projects: [

    {
      name: 'chromium',
      use: {
        ...devices['Desktop-Chrome'],
        launchOptions: {
          args: ['--window-position=0,0', '--force-color-profile=srgb', '--hide-scrollbars'],
          downloadsPath: path.join(__dirname, '/test-results/downloads'),
        },
      },

    }]
});
