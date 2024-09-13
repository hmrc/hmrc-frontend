import 'expect-puppeteer';

import { ports } from '../../../config/paths.json';

const baseUrl = `http://localhost:${ports.app}`;

describe('multiple tabs open with synchronise tabs feature switch enabled', () => {
  it('should keep other synchronised tabs alive when the user chooses to extend their session', async () => {
    const session = await browser.createIncognitoBrowserContext();

    const backgroundPage = await session.newPage();
    await backgroundPage.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);

    await expect(foregroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });
    await expect(backgroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });

    await expect(foregroundPage).toClick('button', { text: 'Stay signed in' });

    await expect(backgroundPage).not.toMatchTextContent('about to be signed out');

    await session.close();
  });

  it('should keep other synchronised tabs alive when the user navigates to a page on another tab', async () => {
    const session = await browser.createIncognitoBrowserContext();

    const backgroundPage = await session.newPage();
    await backgroundPage.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);
    await expect(backgroundPage).toMatchTextContent('about to be signed out', { timeout: 5000 });

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(`${baseUrl}/components/page-heading/default/preview`);

    await expect(backgroundPage).not.toMatchTextContent('about to be signed out');

    await session.close();
  });

  it('should not prevent other unsynchronised tabs from timing out', async () => {
    const session = await browser.createIncognitoBrowserContext();

    const backgroundPageWithUnsyncedWarnings = await session.newPage();
    await backgroundPageWithUnsyncedWarnings.goto(`${baseUrl}/components/timeout-dialog/timeout-warnings-not-synchronised/preview`);
    await expect(backgroundPageWithUnsyncedWarnings).toMatchTextContent('about to be signed out', { timeout: 5000 });

    const foregroundPage = await session.newPage();
    await foregroundPage.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);

    await expect(backgroundPageWithUnsyncedWarnings).toMatchTextContent('about to be signed out');

    await session.close();
  });
});
