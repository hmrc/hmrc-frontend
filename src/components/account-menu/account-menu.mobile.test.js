/**
 * @jest-environment ./lib/puppeteer/environment.js
 */

/* eslint-env jest */
import devices from 'puppeteer/DeviceDescriptors';
import configPaths from '../../../config/paths.json';

const iPhone = devices['iPhone 6'];

const PORT = configPaths.ports.test;

let browser;
let page;
const baseUrl = `http://localhost:${PORT}`;

beforeAll(async () => {
  // eslint-disable-next-line no-underscore-dangle
  browser = global.__BROWSER__;
  page = await browser.newPage();
  await page.emulate(iPhone);
});

afterAll(async () => {
  await page.close();
});

describe('When the page is loaded on mobile', () => {
  const accountMenuUrl = `${baseUrl}/components/account-menu/default/preview`;
  const nav = '.hmrc-account-menu';
  const mobileMenuLink = '.hmrc-account-menu__link--menu';
  const mobileSubMenu = '.hmrc-account-menu__main';
  const mobileBack = '.hmrc-account-menu__link--back';
  const mobileBackLink = '.hmrc-account-menu__link--back a';
  const yourAccountLink = '#account-menu__main-2';
  const subnavItems = '.hmrc-account-menu__main .hmrc-account-menu__link';

  it('should show the mobile version of the navigation', async () => {
    await page.goto(`${baseUrl}/components/account-menu/default/preview`);

    const navClasses = await page.$eval(nav, (el) => el.className);
    expect(navClasses).toContain('is-smaller');

    const mobileMenuLinkIsHidden = await page.$eval(mobileMenuLink, (el) => el.getAttribute('aria-hidden'));
    expect(mobileMenuLinkIsHidden).toBe('false');

    const mobileMenuLinkIsFocusable = await page.$eval(mobileMenuLink, (el) => !el.getAttribute('tabindex'));
    expect(mobileMenuLinkIsFocusable).toBeTruthy();

    const mobileMenuLinkClasses = await page.$eval(mobileMenuLink, (el) => el.className);
    expect(mobileMenuLinkClasses).toContain('js-visible');
    expect(mobileMenuLinkClasses).not.toContain('js-hidden');

    const mobileSubMenuClasses = await page.$eval(mobileSubMenu, (el) => el.className);
    expect(mobileSubMenuClasses).toContain('js-hidden');

    const mobileBackIsHidden = await page.$eval(mobileBack, (el) => el.getAttribute('aria-hidden'));
    expect(mobileBackIsHidden).toBe('true');

    const mobileBackLinkIsFocussable = await page.$eval(mobileBackLink, (el) => !el.getAttribute('tabindex'));
    expect(mobileBackLinkIsFocussable).toBeFalsy();
  });

  describe('When the "Account menu" link is clicked', () => {
    it('should show the menu', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const mobileMenuLinkClasses = await page.$eval(mobileMenuLink, (el) => el.className);
      expect(mobileMenuLinkClasses).toContain('account-home--account--is-open');

      const mobileSubMenuClasses = await page.$eval(mobileSubMenu, (el) => el.className);
      expect(mobileSubMenuClasses).toContain('main-nav-is-open');
    });

    it('should maintain focus on the "Account menu" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const classOfFocusedElement = await page.evaluate(() => document.activeElement.className);

      expect(classOfFocusedElement).toContain('hmrc-account-menu__link--menu');
    });

    it('should not add an aria-hidden attribute to the "Your Account" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const yourAccountAriaHidden = await page.$eval(yourAccountLink, (el) => el.getAttribute('aria-hidden'));
      expect(yourAccountAriaHidden).toBeNull();
    });

    it('should set aria-expanded to true on the "Account menu" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const mobileMenuLinkIsExpanded = await page.$eval(mobileMenuLink, (el) => el.getAttribute('aria-expanded'));
      expect(mobileMenuLinkIsExpanded).toBe('true');
    });

    it('should not set aria-expanded on the menu itself', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const mobileSubMenuIsExpanded = await page.$eval(mobileSubMenu, (el) => el.getAttribute('aria-expanded'));
      expect(mobileSubMenuIsExpanded).toBeNull();
    });

    it('should have aria-expanded equal to false on the "Your account" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const yourAccountLinkIsExpanded = await page.$eval(yourAccountLink, (el) => el.getAttribute('aria-expanded'));
      expect(yourAccountLinkIsExpanded).toBe('false');
    });
  });

  describe('When the "Your account" link is clicked', () => {
    it('should reveal the "Your Account" sub nav', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);

      const navClasses = await page.$eval(nav, (el) => el.className);
      expect(navClasses).toContain('subnav-is-open');

      const mobileSubMenuClasses = await page.$eval(mobileSubMenu, (el) => el.className);
      expect(mobileSubMenuClasses).toContain('subnav-is-open');

      const yourAccountLinkParentClasses = await page
        .$eval(yourAccountLink, (el) => el.parentElement.className);
      expect(yourAccountLinkParentClasses).toContain('active-subnav-parent');

      const mobileBackClasses = await page.$eval(mobileBack, (el) => el.className);
      expect(mobileBackClasses).not.toContain('hidden');

      const mobileBackIsHidden = await page.$eval(mobileBack, (el) => el.getAttribute('aria-hidden'));
      expect(mobileBackIsHidden).toBe('false');

      const mobileBackLinkIsFocussable = await page.$eval(mobileBackLink, (el) => !el.getAttribute('tabindex'));
      expect(mobileBackLinkIsFocussable).toBeTruthy();

      const subnavItemsParentsClasses = await page
        .$$eval(subnavItems, (els) => els.map((el) => el.parentElement.className));
      subnavItemsParentsClasses.forEach((subnavItemsParentClasses) => {
        if ([mobileBack.substr(1), 'active-subnav-parent'].includes(subnavItemsParentClasses)) {
          expect(subnavItemsParentClasses).not.toContain('hidden');
        } else {
          expect(subnavItemsParentClasses).toContain('hidden');
        }
      });
    });

    it('should set aria-expanded to true on the "Your account" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);

      const yourAccountLinkIsExpanded = await page.$eval(yourAccountLink, (el) => el.getAttribute('aria-expanded'));
      expect(yourAccountLinkIsExpanded).toBe('true');
    });

    it('should not set the aria-expanded attribute on the "Your account" sub nav itself', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);

      const subNavAriaExpanded = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-expanded'));
      expect(subNavAriaExpanded).toBeNull();
    });
  });

  describe('When the Back link is clicked', () => {
    it('should close the "Your Account" sub nav', async () => {
      await page.goto(accountMenuUrl);

      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);
      await page.click(`${mobileBack} a`);

      const navClasses = await page.$eval(nav, (el) => el.className);
      expect(navClasses).not.toContain('hmrc-subnav-is-open');

      const mobileSubMenuClasses = await page.$eval(mobileSubMenu, (el) => el.className);
      expect(mobileSubMenuClasses).toContain('main-nav-is-open');
      expect(mobileSubMenuClasses).not.toContain('hmrc-subnav-is-open');

      const mobileBackClasses = await page.$eval(mobileBack, (el) => el.className);
      expect(mobileBackClasses).toContain('hidden');

      const mobileBackIsHidden = await page.$eval(mobileBack, (el) => el.getAttribute('aria-hidden'));
      expect(mobileBackIsHidden).toBe('true');

      const mobileBackLinkIsFocussable = await page.$eval(mobileBackLink, (el) => !el.getAttribute('tabindex'));
      expect(mobileBackLinkIsFocussable).toBeFalsy();

      const subnavItemsHidden = await page.$$eval(subnavItems, (els) => els.filter((el) => el.parentElement.className === 'hidden').length);
      expect(subnavItemsHidden).toBe(0);
    });

    it('should not add aria-hidden to the "Your Account" link', async () => {
      await page.goto(accountMenuUrl);

      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);
      await page.click(`${mobileBack} a`);

      const yourAccountAriaHidden = await page.$eval(yourAccountLink, (el) => el.getAttribute('aria-hidden'));
      expect(yourAccountAriaHidden).toBeNull();
    });
  });

  describe('When the window is resized after opening the menu', () => {
    it('should close the "Your Account" navigation when window resize crosses a breakpoint', async () => {
      await page.goto(accountMenuUrl);

      await page.click(mobileMenuLink);
      // Set width to > tablet breakpoint
      const { height } = await page.viewport();
      await page.setViewport({ height, width: 643 });

      const mobileSubMenuClasses = await page.$eval(mobileSubMenu, (el) => el.className);
      expect(mobileSubMenuClasses).not.toContain('main-nav-is-open');
    });

    it('should NOT close the Your Account navigation when window resizes without crossing a breakpoint', async () => {
      await page.goto(accountMenuUrl);

      await page.click(mobileMenuLink);
      // Set width to different mobile width
      const { height, width } = await page.viewport();
      await page.setViewport({ height, width: width + 10 });

      const mobileSubMenuClasses = await page.$eval(mobileSubMenu, (el) => el.className);
      expect(mobileSubMenuClasses).toContain('main-nav-is-open');
    });

    it('should NOT close the Your Account navigation when window resizes vertically', async () => {
      await page.goto(accountMenuUrl);

      await page.click(mobileMenuLink);
      // Change height
      const { height, width } = await page.viewport();
      await page.setViewport({ height: height + 10, width });

      const mobileSubMenuClasses = await page.$eval(mobileSubMenu, (el) => el.className);
      expect(mobileSubMenuClasses).toContain('main-nav-is-open');
    });
  });
});
