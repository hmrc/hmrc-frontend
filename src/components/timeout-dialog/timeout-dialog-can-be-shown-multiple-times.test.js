/**
 * @jest-environment ./lib/puppeteer/environment.js
 */

/* eslint-env jest */
/* eslint-disable no-underscore-dangle */

import { installFakeTimersOnLoad, serveFakePage } from './test-helpers/browser-tests';

import { version } from '../../../package.json';

describe('timeout dialog with a single page open', () => {
  it('should allow you to choose to continue your session more than once on the same page', async () => {
    const page = await global.__BROWSER__.newPage();

    await serveFakePage(page, 'http://localhost:8888/', `
      <meta name="hmrc-timeout-dialog"
        content="hmrc-timeout-dialog"
        data-timeout="60"
        data-countdown="50"
        data-keep-alive-url="?keepalive"
        data-sign-out-url="/timeout-reached"
        data-synchronise-tabs="true"/>
      <link rel="stylesheet" href="/assets/hmrc-frontend-${version}.min.css">
      <script src="/assets/hmrc-frontend-${version}.min.js"></script>
    `);

    const advanceClock = await installFakeTimersOnLoad(page);

    await page.goto('http://localhost:8888/');
    expect(await page.$('#hmrc-timeout-dialog')).toBeNull();

    // First timeout warning
    await advanceClock(10);
    expect(await page.$eval('.hmrc-timeout-dialog__message', (el) => el.textContent))
      .toBe('For your security, we will sign you out in 50 seconds.');
    await page.click('#hmrc-timeout-keep-signin-btn');
    expect(await page.$('#hmrc-timeout-dialog')).toBeNull();

    // Second timeout warning
    await advanceClock(10);
    expect(await page.$eval('.hmrc-timeout-dialog__message', (el) => el.textContent))
      .toBe('For your security, we will sign you out in 50 seconds.');
    await page.click('#hmrc-timeout-keep-signin-btn');
    expect(await page.$('#hmrc-timeout-dialog')).toBeNull();

    // Third timeout warning
    await advanceClock(55); // enough so timeout from second warning would have triggered
    await page.waitForNetworkIdle();
    expect(page.url()).toBe('http://localhost:8888/');
    expect(await page.$eval('.hmrc-timeout-dialog__message', (el) => el.textContent))
      .toBe('For your security, we will sign you out in 5 seconds.');
    await page.click('#hmrc-timeout-keep-signin-btn');
    expect(await page.$('#hmrc-timeout-dialog')).toBeNull();
  });
});

describe('timeout dialog with multiple pages open', () => {
  it('should allow you to choose to continue your session more than once on the same page', async () => {
    const page1 = await global.__BROWSER__.newPage();
    const page2 = await global.__BROWSER__.newPage();

    [page1, page2].forEach(async (page) => {
      await serveFakePage(page, 'http://localhost:8888/', `
        <meta name="hmrc-timeout-dialog"
          content="hmrc-timeout-dialog"
          data-timeout="60"
          data-countdown="50"
          data-keep-alive-url="?keepalive"
          data-sign-out-url="/timeout-reached"
          data-synchronise-tabs="true"/>
        <link rel="stylesheet" href="/assets/hmrc-frontend-${version}.min.css">
        <script src="/assets/hmrc-frontend-${version}.min.js"></script>
      `);
    });

    const advanceClockOnFirstPage = await installFakeTimersOnLoad(page1);

    await page1.goto('http://localhost:8888/');
    expect(await page1.$('#hmrc-timeout-dialog')).toBeNull();

    // Verify opening second page after 5 seconds resets timeout warning countdown timer for page 1
    await advanceClockOnFirstPage(5);
    await installFakeTimersOnLoad(page2, 5);
    await page2.goto('http://localhost:8888/');
    await advanceClockOnFirstPage(5); // if it hadn't been reset we'd see the timeout warning now
    expect(await page1.$('#hmrc-timeout-dialog')).toBeNull();

    // First timeout warning
    await advanceClockOnFirstPage(5);
    expect(await page1.$eval('.hmrc-timeout-dialog__message', (el) => el.textContent))
      .toBe('For your security, we will sign you out in 50 seconds.');
    await page1.click('#hmrc-timeout-keep-signin-btn');
    expect(await page1.$('#hmrc-timeout-dialog')).toBeNull();

    // Second timeout warning
    await advanceClockOnFirstPage(55); // enough so timeout from first warning would have triggered
    await page1.waitForNetworkIdle();
    expect(page1.url()).toBe('http://localhost:8888/');
    expect(await page1.$eval('.hmrc-timeout-dialog__message', (el) => el.textContent))
      .toBe('For your security, we will sign you out in 5 seconds.');
    await page1.click('#hmrc-timeout-keep-signin-btn');
    expect(await page1.$('#hmrc-timeout-dialog')).toBeNull();
  });
});
