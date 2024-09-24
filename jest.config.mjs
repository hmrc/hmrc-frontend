// eslint-disable-next-line import/extensions
import jestPuppeteerConfig from './jest-puppeteer.config.js';

const { headless } = jestPuppeteerConfig.launch;

export default {
  maxWorkers: headless
    ? '50%'
    : 1,

  projects: [
    {
      displayName: 'unit tests',
      setupFilesAfterEnv: ['<rootDir>/lib/jest-helpers.js'],
      clearMocks: true,
      testMatch: [
        '**/*test.js',
        '!**/*jsdom.test.js',
        '!**/*browser.test.js',
      ],
    },
    {
      displayName: 'jsdom tests',
      testEnvironment: 'jsdom',
      snapshotSerializers: ['jest-serializer-html'],
      setupFilesAfterEnv: ['<rootDir>/lib/jest-helpers.js'],
      clearMocks: true,
      testMatch: [
        '**/*jsdom.test.js',
      ],
    },
    {
      displayName: 'browser tests',
      preset: 'jest-puppeteer',
      clearMocks: true,
      setupFilesAfterEnv: ['expect-puppeteer', '<rootDir>/lib/browser-tests/jest-setup.js'],
      testMatch: [
        '**/*browser.test.js',
      ],
    },
  ],

  modulePathIgnorePatterns: ['<rootDir>/package'],

  testTimeout: 60000,
};
