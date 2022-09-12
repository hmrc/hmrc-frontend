/**
 * @jest-environment ./lib/puppeteer/environment.js
 */

/* eslint-env jest */
import configPaths from '../../../config/paths.json';

const PORT = configPaths.ports.test;

let browser;
let page1;
let page2;
let page3;

const baseUrl = `http://localhost:${PORT}`;

beforeAll(async () => {
  // eslint-disable-next-line no-underscore-dangle
  browser = global.__BROWSER__;

  page1 = await browser.newPage();
  page2 = await browser.newPage();
  page3 = await browser.newPage();
});

describe('multiple tabs open with synchronise tabs feature switch enabled', () => {
  it('should keep other tabs alive when the user chooses to extend their session', async () => {
    // open 2 pages with the timeout dialog component
    await page1.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);
    await page2.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);

    // ensure the timeout dialog is displaying on both pages
    await page1.waitForSelector('.hmrc-timeout-dialog__countdown');
    await page2.waitForSelector('.hmrc-timeout-dialog__countdown');

    // on page1 click the keep me signed in button
    await page1.click('#hmrc-timeout-keep-signin-btn');

    // ensure page2 no longer displays the timeout dialog as the session has been extended
    const timeoutDialog = await page2.evaluate(() => document.querySelector('#hmrc-timeout-dialog'));
    expect(timeoutDialog).toBeFalsy();
  });

  it('should keep other tabs alive when the user navigates to a page on another tab', async () => {
    // open 2 pages with the timeout dialog component
    await page1.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);
    await page2.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);

    // ensure the timeout dialog is displaying on both pages
    await page1.waitForSelector('.hmrc-timeout-dialog__countdown');
    await page2.waitForSelector('.hmrc-timeout-dialog__countdown');

    // navigate to some other page on the same domain
    await page3.goto(`${baseUrl}/components/page-heading/default/preview`);

    // ensure page1 no longer displays the timeout dialog as the session has been extended
    const timeoutDialogPage1 = await page1.evaluate(() => document.querySelector('#hmrc-timeout-dialog'));
    expect(timeoutDialogPage1).toBeFalsy();

    // ensure page2 no longer displays the timeout dialog as the session has been extended
    const timeoutDialogPage2 = await page2.evaluate(() => document.querySelector('#hmrc-timeout-dialog'));
    expect(timeoutDialogPage2).toBeFalsy();
  });

  it('should not prevent other tabs from timing out if they do not have the feature flag enabled', async () => {
    // open page with the timeout dialog component with feature flag enabled
    await page1.goto(`${baseUrl}/components/timeout-dialog/synchronise-tabs/preview`);
    // open page with the timeout dialog component and feature flag disabled
    await page2.goto(`${baseUrl}/components/timeout-dialog/welsh-language/preview`);

    // ensure the timeout dialog is displaying on both pages
    await page1.waitForSelector('.hmrc-timeout-dialog__countdown');
    await page2.waitForSelector('.hmrc-timeout-dialog__countdown');

    // on page1 click the keep me signed in button
    await page1.click('#hmrc-timeout-keep-signin-btn');

    // ensure page2 displays the timeout dialog as the session has not been extended
    const timeoutDialog = await page2.evaluate(() => document.querySelector('#hmrc-timeout-dialog'));
    expect(timeoutDialog).toBeTruthy();
  });
});
