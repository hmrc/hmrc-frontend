/**
 * @jest-environment ./lib/puppeteer/environment.js
 */

/* eslint-env jest */
import configPaths from '../../../config/paths.json';

const PORT = configPaths.ports.test;

let page;
let browser;
const printSpy = jest.fn();
const baseUrl = `http://localhost:${PORT}`;

beforeAll(async () => {
  // eslint-disable-next-line no-underscore-dangle
  browser = global.__BROWSER__;

  page = await browser.newPage();
});

describe('open print dialog', () => {
  it('should display print dialog when link is clicked', async () => {
    await page.goto(`${baseUrl}/components/hmrc-print-link/default/preview`);
    await page.exposeFunction('printSpy', printSpy);
    await page.evaluate(() => {
      window.print = printSpy;
    });

    await page.click('a[data-module="hmrc-print-link"]');
    expect(printSpy).toHaveBeenCalled();
  });
});
