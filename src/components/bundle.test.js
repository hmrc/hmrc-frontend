/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */
import { ports } from '../../config/paths.json';

let browser;
let page;

beforeAll(async () => {
  // eslint-disable-next-line no-underscore-dangle
  browser = global.__BROWSER__;
  page = await browser.newPage();
});

afterAll(async () => {
  await page.close();
});

describe('Minified bundle', () => {
  const url = `http://localhost:${ports.test}`;

  it('should define HMRCFrontend', async () => {
    await page.goto(url);

    const HMRCFrontend = await page.evaluate(() => window.HMRCFrontend);

    expect(HMRCFrontend).toBeDefined();
    expect(HMRCFrontend.initAll).toBeDefined();
  });
});
