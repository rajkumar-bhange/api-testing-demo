import { defineConfig, devices } from '@playwright/test';
import { allure } from 'allure-playwright';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: 'https://jsonplaceholder.typicode.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.api.spec.ts',
    },
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
