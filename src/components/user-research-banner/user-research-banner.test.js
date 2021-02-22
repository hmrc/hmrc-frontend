/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../../config/paths.json');

describe('/components/user-research-banner', () => {
  let page;
  const url = `http://localhost:${configPaths.ports.test}/components/user-research-banner/default/preview`;
  const dayInSeconds = 24 * 60 * 60;
  const expiryTimeInSeconds = 28 * dayInSeconds;

  const getExpectedExpiry = () => Math.trunc(
    (new Date().getTime() + (expiryTimeInSeconds * 1000)) / 1000,
  );

  beforeAll(async () => {
    // eslint-disable-next-line no-underscore-dangle
    page = await global.__BROWSER__.newPage();
  });

  beforeEach(async () => {
    await page.goto(url);
  });

  afterEach(async () => {
    await page.deleteCookie({ name: 'mdtpurr' });
  });

  afterAll(async () => {
    await page.close();
  });

  describe('When a page with the user research banner is loaded', () => {
    it('should display', async () => {
      await page.waitForSelector('.hmrc-user-research-banner', {
        visible: true,
      });
    });

    it('should close when No thanks is clicked', async () => {
      await page.waitForSelector('.hmrc-user-research-banner', {
        visible: true,
      });

      const closeLink = await page.$('.hmrc-user-research-banner__close');
      await closeLink.click();

      await page.waitForSelector('.hmrc-user-research-banner', {
        hidden: true,
      });
    });

    it('should set the mdtpurr cookie with the correct properties when No thanks is clicked', async () => {
      expect(await page.cookies()).toHaveLength(0);

      const closeLink = await page.$('.hmrc-user-research-banner__close');

      const earliestExpectedExpiry = getExpectedExpiry();
      await closeLink.click();
      const latestExpectedExpiry = getExpectedExpiry();

      const cookies = await page.cookies();
      expect(cookies).toHaveLength(1);
      expect(cookies[0].name).toEqual('mdtpurr');
      expect(cookies[0].value).toEqual('suppress_for_all_services');
      expect(cookies[0].expires).toBeGreaterThanOrEqual(earliestExpectedExpiry);
      expect(cookies[0].expires).toBeGreaterThanOrEqual(latestExpectedExpiry);
    });
  });
});
