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
  const checkProgress = '.hmrc-account-menu__check-progress';
  const messages = '.hmrc-account-menu__messages';
  const signOut = '.hmrc-account-menu__sign-out';

  const yourAccountLink = '#account-menu__main-2';

  it('should show the mobile version of the navigation', async () => {
    await page.goto(`${baseUrl}/components/account-menu/default/preview`);

    const navClasses = await page.$eval(nav, (el) => el.className);
    expect(navClasses).toContain('is-smaller');

    const mobileMenuLinkIsHidden = await page.$eval(mobileMenuLink, (el) => el.hasAttribute('hidden'));
    expect(mobileMenuLinkIsHidden).toEqual(false);

    const mobileBackIsHidden = await page.$eval(mobileBack, (el) => el.hasAttribute('hidden'));
    expect(mobileBackIsHidden).toEqual(true);
  });

  describe('When the "Account menu" link is clicked', () => {
    it('should show the menu', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const navClasses = await page.$eval(nav, (el) => el.className);
      expect(navClasses).toContain('main-nav-is-open');
    });

    it('should maintain focus on the "Account menu" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const classOfFocusedElement = await page.evaluate(() => document.activeElement.className);

      expect(classOfFocusedElement).toContain('hmrc-account-menu__link--menu');
    });

    it('should not add a hidden attribute to the "Your Account" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);

      const yourAccountAriaHidden = await page.$eval(yourAccountLink, (el) => el.hasAttribute('hidden'));
      expect(yourAccountAriaHidden).toEqual(false);
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

      const mobileBackIsHidden = await page.$eval(mobileBack, (el) => el.hasAttribute('hidden'));
      expect(mobileBackIsHidden).toEqual(false);
    });

    it('should hide the other navigation items', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);

      const messagesIsHidden = await page.$eval(messages, (el) => el.hasAttribute('hidden'));
      expect(messagesIsHidden).toEqual(true);
      const checkProgressIsHidden = await page.$eval(checkProgress, (el) => el.hasAttribute('hidden'));
      expect(checkProgressIsHidden).toEqual(true);
      const signOutIsHidden = await page.$eval(signOut, (el) => el.hasAttribute('hidden'));
      expect(signOutIsHidden).toEqual(true);
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
      expect(navClasses).toContain('main-nav-is-open');
      expect(navClasses).not.toContain('hmrc-subnav-is-open');
    });

    it('should hide the "Back" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);
      await page.click(`${mobileBack} a`);

      const mobileBackHidden = await page.$eval(mobileBack, (el) => el.hasAttribute('hidden'));
      expect(mobileBackHidden).toEqual(true);
    });

    it('should show the other navigation items', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);
      await page.click(`${mobileBack} a`);

      const messagesIsHidden = await page.$eval(messages, (el) => el.hasAttribute('hidden'));
      expect(messagesIsHidden).toEqual(false);
      const checkProgressIsHidden = await page.$eval(checkProgress, (el) => el.hasAttribute('hidden'));
      expect(checkProgressIsHidden).toEqual(false);
      const signOutIsHidden = await page.$eval(signOut, (el) => el.hasAttribute('hidden'));
      expect(signOutIsHidden).toEqual(false);
    });

    it('should not add hidden to the "Your Account" link', async () => {
      await page.goto(accountMenuUrl);
      await page.click(mobileMenuLink);
      await page.click(yourAccountLink);
      await page.click(`${mobileBack} a`);

      const yourAccountHidden = await page.$eval(yourAccountLink, (el) => el.hasAttribute('hidden'));
      expect(yourAccountHidden).toEqual(false);
    });
  });

  describe('When the window is resized after opening the menu', () => {
    it('should close the "Your Account" navigation when window resize crosses a breakpoint', async () => {
      await page.goto(accountMenuUrl);

      await page.click(mobileMenuLink);
      // Set width to > tablet breakpoint
      const { height } = await page.viewport();
      await page.setViewport({ height, width: 643 });

      const navClasses = await page.$eval(nav, (el) => el.className);
      expect(navClasses).not.toContain('main-nav-is-open');
    });

    it('should NOT close the Your Account navigation when window resizes without crossing a breakpoint', async () => {
      await page.goto(accountMenuUrl);

      await page.click(mobileMenuLink);
      // Set width to different mobile width
      const { height, width } = await page.viewport();
      await page.setViewport({ height, width: width + 10 });

      const navClasses = await page.$eval(nav, (el) => el.className);
      expect(navClasses).toContain('main-nav-is-open');
    });

    it('should NOT close the Your Account navigation when window resizes vertically', async () => {
      await page.goto(accountMenuUrl);

      await page.click(mobileMenuLink);
      // Change height
      const { height, width } = await page.viewport();
      await page.setViewport({ height: height + 10, width });

      const navClasses = await page.$eval(nav, (el) => el.className);
      expect(navClasses).toContain('main-nav-is-open');
    });
  });
});
