import 'expect-puppeteer';

import { examplePreview } from '../../../lib/url-helpers';

describe('multiple tabs open with synchronise tabs feature switch enabled', () => {
  it('should keep other synchronised tabs alive when the user chooses to extend their session', async () => {
    const session = await browser.createIncognitoBrowserContext();

    const backgroundPage = await session.newPage();
    await backgroundPage.goto(examplePreview('timeout-dialog/synchronise-tabs'));

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(examplePreview('timeout-dialog/synchronise-tabs'));

    await expect(foregroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });
    await expect(backgroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });

    await expect(foregroundPage).toClick('button', { text: 'Stay signed in' });

    await expect(backgroundPage).not.toMatchTextContent('about to be signed out');

    await session.close();
  });

  it('should keep other synchronised tabs alive when the user navigates to a page on another tab', async () => {
    const session = await browser.createIncognitoBrowserContext();

    const backgroundPage = await session.newPage();
    await backgroundPage.goto(examplePreview('timeout-dialog/synchronise-tabs'));
    await expect(backgroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(examplePreview('page-heading/default'));

    await expect(backgroundPage).not.toMatchTextContent('about to be signed out');

    await session.close();
  });

  it('should not prevent other unsynchronised tabs from timing out', async () => {
    const session = await browser.createIncognitoBrowserContext();

    const backgroundPageWithUnsyncedWarnings = await session.newPage();
    await backgroundPageWithUnsyncedWarnings.goto(examplePreview('timeout-dialog/timeout-warnings-not-synchronised'));
    await expect(backgroundPageWithUnsyncedWarnings).toMatchTextContent('about to be signed out', { timeout: 5000 });

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(examplePreview('timeout-dialog/synchronise-tabs'));

    await expect(backgroundPageWithUnsyncedWarnings).toMatchTextContent('about to be signed out');

    await session.close();
  });
});
