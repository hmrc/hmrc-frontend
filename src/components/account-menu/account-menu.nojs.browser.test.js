import { examplePreview } from '../../../lib/url-helpers';

describe('/components/account-menu', () => {
  const defaultAccountMenu = examplePreview('account-menu/default');

  async function displayStyle(selector) {
    return page.$eval(selector, (el) => window.getComputedStyle(el).display);
  }

  describe('When the account menu is included on a page and JS is enabled', () => {
    it('should hide the Account Menu button on desktop', async () => {
      await page.goto(defaultAccountMenu);
      expect(await displayStyle('.hmrc-account-menu__link--menu')).toBe('none');
    });

    it('should show the individual menu buttons on desktop', async () => {
      await page.goto(defaultAccountMenu);
      expect(await displayStyle('.hmrc-account-menu__main')).not.toBe('none');
    });

    it('should show the Account Menu button on mobile', async () => {
      await page.setViewport({ width: 375, height: 812 });
      await page.goto(defaultAccountMenu);
      expect(await displayStyle('.hmrc-account-menu__link--menu')).not.toBe('none');
    });

    it('should hide the individual menu buttons on mobile', async () => {
      await page.setViewport({ width: 375, height: 812 });
      await page.goto(defaultAccountMenu);
      expect(await displayStyle('.hmrc-account-menu__main')).toBe('none');
    });
  });

  describe('When the account menu is included on a page but JS is disabled', () => {
    it('should hide the Account Menu button on desktop', async () => {
      await page.setJavaScriptEnabled(false);
      await page.goto(defaultAccountMenu);
      expect(await displayStyle('.hmrc-account-menu__link--menu')).toBe('none');
    });

    it('should show the individual menu buttons on desktop', async () => {
      await page.setJavaScriptEnabled(false);
      await page.goto(defaultAccountMenu);
      expect(await displayStyle('.hmrc-account-menu__main')).not.toBe('none');
    });

    it('should hide the Account Menu button on mobile', async () => {
      await page.setViewport({ width: 375, height: 812 });
      await page.setJavaScriptEnabled(false);
      await page.goto(defaultAccountMenu);
      expect(await displayStyle('.hmrc-account-menu__link--menu')).toBe('none');
    });

    it('should show the individual menu buttons on mobile', async () => {
      await page.setViewport({ width: 375, height: 812 });
      await page.setJavaScriptEnabled(false);
      await page.goto(defaultAccountMenu);
      expect(await displayStyle('.hmrc-account-menu__main')).not.toBe('none');
    });
  });
});
