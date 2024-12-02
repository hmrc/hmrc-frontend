import { render, withHmrcStylesAndScripts } from '../../../lib/browser-tests/puppeteer-helpers';

const withRefererFromSameDomain = { referer: 'http://localhost:3000/' };

describe('/components/back-link-helper', () => {
  async function linkDisplayStyle() {
    return page.$eval('.govuk-back-link', (el) => window.getComputedStyle(el).display);
  }

  describe('When a JS-enabled back link is included on a page', () => {
    it('should be hidden when referrer is on a different domain', async () => {
      await render(page, withHmrcStylesAndScripts(`
        <a href="#" class="govuk-back-link" data-module="hmrc-back-link">back</a>
      `), {
        referer: 'http://somewhere-else.com',
      });
      expect(await linkDisplayStyle()).toBe('none');
    });

    it('should be shown when referrer is on a different domain, but the domain has been allowlisted', async () => {
      await render(page, withHmrcStylesAndScripts(`
        <a href="#" class="govuk-back-link" data-module="hmrc-back-link">back</a>
      `), {
        referer: 'http://account.hmrc.gov.uk',
      });
      expect(await linkDisplayStyle()).not.toBe('none');
    });

    it('should be hidden when referrer is empty', async () => {
      await render(page, withHmrcStylesAndScripts(`
        <a href="#" class="govuk-back-link" data-module="hmrc-back-link">back</a>
      `), {
        referer: '',
      });
      expect(await linkDisplayStyle()).toBe('none');
    });

    it('should be visible when JS is enabled and there is a referrer on same domain', async () => {
      await render(page, withHmrcStylesAndScripts(`
        <a href="#" class="govuk-back-link" data-module="hmrc-back-link">back</a>
      `), withRefererFromSameDomain);
      expect(await linkDisplayStyle()).not.toBe('none');
    });

    it('should be hidden when JS is disabled', async () => {
      await page.setJavaScriptEnabled(false);
      await render(page, withHmrcStylesAndScripts(`
        <a href="#" class="govuk-back-link" data-module="hmrc-back-link">back</a>
      `), withRefererFromSameDomain);
      expect(await linkDisplayStyle()).toBe('none');
    });

    it('should be visible when JS is disabled but a fallback href is provided', async () => {
      await page.setJavaScriptEnabled(false);
      await render(page, withHmrcStylesAndScripts(`
        <a href="/fallback" class="govuk-back-link" data-module="hmrc-back-link">back</a>
      `), withRefererFromSameDomain);
      expect(await linkDisplayStyle()).not.toBe('none');
    });
  });
});
