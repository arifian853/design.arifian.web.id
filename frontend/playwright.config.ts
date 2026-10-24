import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './browser', fullyParallel: false, workers: 1,
  reporter: 'line',
  outputDir: '../private/qa/browser-results',
  use: { baseURL: process.env.SPECIMEN_BASE_URL ?? 'http://127.0.0.1:4321', trace: 'off', screenshot: 'off', video: 'off',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE, args: ['--no-sandbox'] },
  },
});
