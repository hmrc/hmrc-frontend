/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */
import configPaths from '../../../config/paths.json';

// eslint-disable-next-line no-underscore-dangle
const browser = global.__BROWSER__;
let page;

beforeAll(async () => {
  page = await browser.newPage();
});

afterAll(async () => {
  await page.close();
});

describe('/components/back-link-helper', () => {
  const PORT = configPaths.ports.test;
  const baseUrl = `http://localhost:${PORT}`;
  const backLinkExampleUrl = (exampleName) => `${baseUrl}/components/back-link-helper/${exampleName}/preview`;

  async function linkDisplayStyle() {
    return page.$eval('.govuk-back-link', (el) => window.getComputedStyle(el).display);
  }

  describe('When a JS-enabled back link is included on a page', () => {
    it('should be hidden when referrer is on a different domain', async () => {
      await page.goto(backLinkExampleUrl('JavaScript-back-link-hidden-when-referrer-is-on-different-domain'), {
        referer: 'http://somewhere-else.com',
      });
      expect(await linkDisplayStyle()).toBe('none');
    });

    it('should be hidden when referrer is empty', async () => {
      await page.goto(backLinkExampleUrl('JavaScript-back-link-hidden-when-referrer-is-on-different-domain'), {
        referer: '',
      });
      expect(await linkDisplayStyle()).toBe('none');
    });

    it('should be visible when JS is enabled', async () => {
      await page.goto(baseUrl);

      const aRef = await page.$('a ::-p-text(Javascript back link visible when referrer is on the same domain example)');
      await aRef.click();
      await page.waitForNavigation();

      expect(await linkDisplayStyle()).not.toBe('none');
    });

    it('should be hidden when JS is disabled', async () => {
      await page.goto(backLinkExampleUrl('JavaScript-back-link-hidden-when-JS-disabled'));
      expect(await linkDisplayStyle()).toBe('none');
    });

    it('should be visible when JS is disabled but a fallback href is provided', async () => {
      await page.goto(baseUrl);

      const aRef = await page.$('a ::-p-text(Javascript back link visible when js disabled but with fallback href example)');
      await aRef.click();
      await page.waitForNavigation();

      expect(await linkDisplayStyle()).not.toBe('none');
    });
  });
});
