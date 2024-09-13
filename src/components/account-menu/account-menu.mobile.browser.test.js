import configPaths from '../../../config/paths.json';

const PORT = configPaths.ports.app;

const baseUrl = `http://localhost:${PORT}`;

beforeEach(async () => {
  await page.setViewport({
    width: 640,
    height: 480,
    deviceScaleFactor: 1,
  });
});

describe('When the page is loaded on mobile', () => {
  const nav = '.hmrc-account-menu';
  const mobileMenuLink = '.hmrc-account-menu__link--menu';
  const mobileBack = '.hmrc-account-menu__link--back';
  const mobileBackLink = '.hmrc-account-menu__link--back a';

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

    const mobileBackIsHidden = await page.$eval(mobileBack, (el) => el.getAttribute('aria-hidden'));
    expect(mobileBackIsHidden).toBe('true');

    const mobileBackLinkIsFocussable = await page.$eval(mobileBackLink, (el) => !el.getAttribute('tabindex'));
    expect(mobileBackLinkIsFocussable).toBeFalsy();
  });
});
