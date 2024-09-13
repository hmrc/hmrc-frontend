import configPaths from '../../../config/paths.json';

const PORT = configPaths.ports.app;

const baseUrl = `http://localhost:${PORT}`;

describe('/components/account-menu', () => {
  const accountMenuUrl = `${baseUrl}/components/account-menu/default/preview`;

  // Default appearance of Account menu when a page is loaded
  describe('When a page with an account-menu is loaded', () => {
    it('Should have all mobile elements hidden', async () => {
      await page.goto(accountMenuUrl);

      const classList = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].className);
      const ariaHidden = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].getAttribute('aria-hidden'));
      const ariaExpanded = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].getAttribute('aria-expanded'));

      expect(classList).toContain('js-hidden');
      expect(ariaHidden).toBe('true');
      expect(ariaExpanded).toBe('false');
    });

    it('Should have the mobile \'back\' menu item hidden', async () => {
      await page.goto(accountMenuUrl);

      const classList = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--back')[0].className);
      const ariaHidden = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--back')[0].getAttribute('aria-hidden'));

      expect(classList).toContain('hidden');
      expect(ariaHidden).toBe('true');
    });
  });
});
