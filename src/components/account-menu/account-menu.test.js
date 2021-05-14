/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */
import configPaths from '../../../config/paths.json';

const PORT = configPaths.ports.test;

let browser;
let page;
const baseUrl = `http://localhost:${PORT}`;

beforeAll(async () => {
  // eslint-disable-next-line no-underscore-dangle
  browser = global.__BROWSER__;
  page = await browser.newPage();
});

afterAll(async () => {
  await page.close();
});

describe('/components/account-menu', () => {
  const yourAccountLinkSelector = '#account-menu__main-2';

  const accountMenuUrl = `${baseUrl}/components/account-menu/default/preview`;

  describe('When a page with an account-menu is loaded', () => {
    it('should display with a closed subnav on the page when loaded', async () => {
      await page.goto(accountMenuUrl);

      const classList = await page.evaluate(() => document.getElementById('subnav-your-account').className);
      const ariaHidden = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));
      const ariaExpanded = await page.evaluate(() => document.getElementById('account-menu__main-2').getAttribute('aria-expanded'));

      expect(classList).not.toContain('hmrc-subnav-reveal');
      expect(ariaHidden).toBe('true');
      expect(ariaExpanded).toBe('false');
    });

    it('Should have all mobile elements hidden', async () => {
      await page.goto(accountMenuUrl);

      const classList = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].className);
      const ariaHidden = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].getAttribute('aria-hidden'));
      const ariaExpanded = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].getAttribute('aria-expanded'));

      expect(classList).toContain('js-hidden');
      expect(ariaHidden).toBe('true');
      expect(ariaExpanded).toBe('false');
    });

    it('Should have the mobile "back" menu item hidden', async () => {
      await page.goto(accountMenuUrl);

      const classList = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--back')[0].className);
      const ariaHidden = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--back')[0].getAttribute('aria-hidden'));

      expect(classList).toContain('hidden');
      expect(ariaHidden).toBe('true');
    });

    it('should not have an aria-expanded attribute on the sub nav', async () => {
      await page.goto(accountMenuUrl);

      const subNavAriaExpanded = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-expanded'));
      expect(subNavAriaExpanded).toBeNull();
    });
  });

  describe('When "Your account" link is clicked', () => {
    const clickYourAccountOnce = async () => {
      const yourAccountLink = await page.$(yourAccountLinkSelector);
      await yourAccountLink.click();
    };

    it('should reveal the subnav', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();

      const classList = await page.evaluate(() => document.getElementById('subnav-your-account').className);
      const ariaHidden = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));

      expect(classList).toContain('hmrc-subnav-reveal');
      expect(ariaHidden).toBe('false');
    });

    it('should not have an aria-hidden attribute on the Your Account link', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();

      const yourAccountAriaHidden = await page.$eval(yourAccountLinkSelector, (el) => el.getAttribute('aria-hidden'));
      expect(yourAccountAriaHidden).toBeNull();
    });

    it('should set aria-expanded to true on the Your Account link', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();

      const ariaExpanded = await page.evaluate(() => document.getElementById('account-menu__main-2').getAttribute('aria-expanded'));

      expect(ariaExpanded).toBe('true');
    });

    it('should not have an aria-expanded attribute on the sub nav', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();

      const subNavAriaExpanded = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-expanded'));
      expect(subNavAriaExpanded).toBeNull();
    });

    it('should add a bottom margin to the account wrapper equivalent to the height of the subnav', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();

      const accountWrapperMarginBottom = await page.evaluate(() => document.getElementById('secondary-nav').style.marginBottom);
      const subNavHeight = await page.evaluate(() => document.getElementById('subnav-your-account').offsetHeight);

      expect(accountWrapperMarginBottom).toBe(`${subNavHeight}px`);
    });

    it('the "Your account" link should continue to have the focus', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();

      const idOfFocusedElement = await page.evaluate(() => document.activeElement.id);

      expect(idOfFocusedElement).toBe('account-menu__main-2');
    });

    it('should hide the subnav when focus moves away', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();
      await page.click('.hmrc-subnav__paperless');

      const ariaHiddenBefore = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));
      expect(ariaHiddenBefore).toBe('false');

      await page.focus('.hmrc-account-menu__sign-out');

      const ariaHiddenAfter = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));
      expect(ariaHiddenAfter).toBe('true');
    });

    it('not should hide the subnav when tabbing between items in the subnav', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();
      await page.click('.hmrc-subnav__paperless');

      const ariaHiddenBefore = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));
      expect(ariaHiddenBefore).toBe('false');

      await page.click('.hmrc-subnav__personal');

      const ariaHiddenAfter = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));
      expect(ariaHiddenAfter).toBe('false');
    });

    it('should hide the subnav when clicking on the Your account link', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountOnce();
      await page.focus('.hmrc-subnav__paperless');

      const ariaHiddenBefore = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));
      expect(ariaHiddenBefore).toBe('false');

      await page.focus('#account-menu__main-2');
      await page.click('#account-menu__main-2');

      const ariaHiddenAfter = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));
      expect(ariaHiddenAfter).toBe('true');
    });
  });

  describe('When "Your account" link is clicked a second time', () => {
    const clickYourAccountTwice = async () => {
      const yourAccountLink = await page.$(yourAccountLinkSelector);
      await yourAccountLink.click();
      await yourAccountLink.click();
    };

    it('should close the subnav', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountTwice();

      const classList = await page.evaluate(() => document.getElementById('subnav-your-account').className);
      const ariaHidden = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'));

      expect(classList).not.toContain('hmrc-subnav-reveal');
      expect(ariaHidden).toBe('true');
    });

    it('should set aria-expanded to false on the Your Account link', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountTwice();

      const ariaExpanded = await page.evaluate(() => document.getElementById('account-menu__main-2').getAttribute('aria-expanded'));

      expect(ariaExpanded).toBe('false');
    });

    it('should not have an aria-hidden attribute on the Your Account link', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountTwice();

      const yourAccountAriaHidden = await page.$eval(yourAccountLinkSelector, (el) => el.getAttribute('aria-hidden'));
      expect(yourAccountAriaHidden).toBeNull();
    });

    it('should not have an aria-expanded attribute on the sub nav', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountTwice();

      const subNavAriaExpanded = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-expanded'));
      expect(subNavAriaExpanded).toBeNull();
    });

    it('should remove bottom margin on second click', async () => {
      await page.goto(accountMenuUrl);
      await clickYourAccountTwice();

      const accountWrapperMarginBottom = await page.evaluate(() => document.getElementById('secondary-nav').style.marginBottom);

      expect(accountWrapperMarginBottom).toBe('');
    });
  });
});
