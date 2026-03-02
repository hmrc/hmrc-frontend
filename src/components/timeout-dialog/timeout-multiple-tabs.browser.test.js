import 'expect-puppeteer';

import {
  clockTickSeconds,
  useFakeTimers,
} from '../../../lib/browser-tests/puppeteer-helpers';

import { examplePreview } from '../../../lib/url-helpers';

async function navigateToPage(session, url, advance = 10) {
  const page = await session.newPage();
  await useFakeTimers(page);
  await page.goto(examplePreview(url));
  await clockTickSeconds(page, advance);
  return page;
}

describe('multiple tabs open with synchronise tabs feature switch enabled', () => {
  it('should keep other synchronised tabs alive when the user chooses to extend their session', async () => {
    const session = await browser.createBrowserContext();

    const backgroundPage = await session.newPage();
    await backgroundPage.goto(examplePreview('timeout-dialog/synchronise-tabs'));

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(examplePreview('timeout-dialog/synchronise-tabs'));

    await expect(foregroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });
    await expect(backgroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });

    await expect(foregroundPage).toClick('button', { text: 'Stay signed in' });

    await expect(backgroundPage).not.toMatchTextContent('about to be signed out', { timeout: 5000 });

    await session.close();
  });

  it('should keep other synchronised tabs alive when the user navigates to a page on another tab', async () => {
    const session = await browser.createBrowserContext();

    const backgroundPage = await session.newPage();
    await backgroundPage.goto(examplePreview('timeout-dialog/synchronise-tabs'));
    await expect(backgroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(examplePreview('page-heading/default'));

    await expect(backgroundPage).not.toMatchTextContent('about to be signed out', { timeout: 5000 });

    await session.close();
  });

  it('should not prevent other unsynchronised tabs from timing out', async () => {
    const session = await browser.createBrowserContext();

    const backgroundPageWithUnsyncedWarnings = await session.newPage();
    await backgroundPageWithUnsyncedWarnings.goto(examplePreview('timeout-dialog/timeout-warnings-not-synchronised'));
    await expect(backgroundPageWithUnsyncedWarnings).toMatchTextContent('about to be signed out', { timeout: 5000 });

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(examplePreview('timeout-dialog/synchronise-tabs'));

    await expect(backgroundPageWithUnsyncedWarnings).toMatchTextContent('about to be signed out', { timeout: 5000 });

    await session.close();
  });

  it('should sign out of all synchronised tabs when the user chooses to sign out early', async () => {
    const synchronisedTabsSignoutUrl = 'timeout-dialog/synchronise-tabs-signout';
    const synchronisedTabsUrl = 'timeout-dialog/synchronise-tabs';
    const unsynchronisedTabsSignoutUrl = 'timeout-dialog/timeout-warnings-not-synchronised';
    const signoutUrl = '?ghi=jkl';

    const session = await browser.createBrowserContext();

    const nonSynchronisedPage = await navigateToPage(session, unsynchronisedTabsSignoutUrl);
    const synchronisedNoSignoutPage = await navigateToPage(
      session,
      synchronisedTabsUrl,
    );
    const backgroundPage = await navigateToPage(session, synchronisedTabsSignoutUrl);
    const foregroundPage = await navigateToPage(session, synchronisedTabsSignoutUrl);

    await expect(foregroundPage).toClick('a', { text: 'Sign out' });

    // foregorund should be signed out
    await foregroundPage.waitForNavigation({ timeout: 2000 });
    await expect(foregroundPage.url()).toMatch(signoutUrl);
    // background should be signed out
    await backgroundPage.waitForNavigation({ timeout: 5000 });
    await expect(backgroundPage.url()).toMatch(signoutUrl);
    // but non-synchronised and synchronised without signout pages should still be signed in
    await expect(nonSynchronisedPage.url()).toMatch(unsynchronisedTabsSignoutUrl);
    await expect(synchronisedNoSignoutPage.url()).toMatch(synchronisedTabsUrl);

    await session.close();
  });
});
