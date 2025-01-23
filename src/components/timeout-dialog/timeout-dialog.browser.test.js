// TODO rewrite other browser tests for timeout dialog using them as well

import {
  delay,
  clockTickSeconds,
  render,
  useFakeTimers,
  withHmrcStylesAndScripts, clockTick,
} from '../../../lib/browser-tests/puppeteer-helpers';

async function renderTimeoutDialog(page, attrs) {
  await useFakeTimers(page);
  await render(page, withHmrcStylesAndScripts(`
    <meta name="hmrc-timeout-dialog" content="hmrc-timeout-dialog" ${attrs} />
  `));
}

const visualCountdownSelector = '.hmrc-timeout-dialog__message';
function visualCountdownFrom(page) {
  return page.$eval(visualCountdownSelector, (element) => element.textContent);
}

const audibleCountdownSelector = '#hmrc-timeout-message';
function audibleCountdownFrom(page) {
  return page.$eval(audibleCountdownSelector, (element) => element.textContent);
}

describe('/components/timeout-dialog', () => {
  it('should display when time remaining has reached the countdown', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 799);
    await expect(page).not.toShowTimeoutDialog();
    await clockTickSeconds(page, 1);
    await expect(page).toShowTimeoutDialog();
  });

  it('should display the time remaining', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 800);
    await expect(page).toMatchTextContent('For your security, we will sign you out in 2 minutes.');
  });

  it('should let you keep signed in', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 800);
    const keepAliveRequest = page.waitForRequest((req) => (
      req.url().endsWith('?keepalive')
      && req.method() === 'GET'
      && req.resourceType() === 'xhr'
    ), { timeout: 1000 });
    await expect(page).toClick('button', { text: 'Stay signed in' });
    await expect(keepAliveRequest).resolves.toBeDefined();
    await expect(page).not.toShowTimeoutDialog();
  });

  it('should sign you out when the countdown is reached', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 900);
    await page.waitForNavigation({ timeout: 1000 });
    await expect(page.url()).toMatch('/timeout-reached');
  });

  it('should not sign you out when the countdown runs out if you chose to stay signed in', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 899);
    await expect(page).toClick('button', { text: 'Stay signed in' });
    await clockTickSeconds(page, 1);
    await delay(500);
    await expect(page.url()).not.toMatch('/timeout-reached');
    await expect(page).not.toShowTimeoutDialog();
  });

  it('should display the timeout warning again after previously choosing to stay signed in', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 800);
    await expect(page).toClick('button', { text: 'Stay signed in' });
    await expect(page).not.toShowTimeoutDialog();
    await clockTickSeconds(page, 799);
    await expect(page).not.toShowTimeoutDialog();
    await clockTickSeconds(page, 1);
    await expect(page).toShowTimeoutDialog();
  });

  it('should time you out if you reach the timeout after having previously extended your session', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 800);
    await expect(page).toClick('button', { text: 'Stay signed in' });
    await clockTickSeconds(page, 900);
    await page.waitForNavigation({ timeout: 1000 });
    await expect(page.url()).toMatch('/timeout-reached');
  });

  it('should let you extend your session repeatedly', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 800);
    await expect(page).toClick('button', { text: 'Stay signed in' });
    await clockTickSeconds(page, 800);
    await expect(page).toClick('button', { text: 'Stay signed in' });
    await clockTickSeconds(page, 100);
    await delay(500);
    await expect(page.url()).not.toMatch('/timeout-reached');
    await clockTickSeconds(page, 900);
    await page.waitForNavigation({ timeout: 1000 });
    await expect(page.url()).toMatch('/timeout-reached');
  });

  it('should let you sign out early', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTickSeconds(page, 800);
    await expect(page).toClick('a', { text: 'Sign out' });
    await page.waitForNavigation({ timeout: 1000 });
    await expect(page.url()).toMatch('/timeout-reached');
  });

  it('should let you specify a separate timeout url', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-timeout-url="/timeout-reached"
      data-sign-out-url="/signed-out-early"
    `);
    await clockTickSeconds(page, 900);
    await page.waitForNavigation({ timeout: 1000 });
    await expect(page.url()).toMatch('/timeout-reached');
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-timeout-url="/timeout-reached"
      data-sign-out-url="/signed-out-early"
    `);
    await clockTickSeconds(page, 800);
    await expect(page).toClick('a', { text: 'Sign out' });
    await page.waitForNavigation({ timeout: 1000 });
    await expect(page.url()).toMatch('/signed-out-early');
  });

  // TODO at the moment it doesn't, should we change test or implementation?
  // we do stop counting down when you timeout at the moment but not vice-versa
  it.skip('should stop timeout countdown when you sign out early', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="900"
      data-countdown="100"
      data-keep-alive-url="?keepalive"
      data-timeout-url="/timeout-reached"
      data-sign-out-url="/signed-out-early"
    `);
    await clockTickSeconds(page, 899);
    await page.setRequestInterception(true);
    page.once('request', async (req) => {
      await delay(2000);
      await req.respond({
        contentType: 'text/plain',
        body: 'simulate slow response to signing out',
      });
      await page.setRequestInterception(false);
    });
    await page.evaluate(() => {
      document.getElementById('hmrc-timeout-sign-out-link').click();
      window.clock.tick(1000); // to reach timeout while sign out page is still loading
    });
    await page.waitForNavigation({ timeout: 1000 });
    await expect(page.url()).toMatch('/signed-out-early');
  });

  function takeTextContentEachSecondForAMinute(page, selector) {
    // eslint-disable-next-line no-shadow
    return page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return Array.from({ length: 60 }, () => {
        window.clock.tick(1000);
        return element.textContent;
      });
    }, selector);
  }

  describe('with under a minute remaining', () => {
    it('should update the visual time remaining every second', async () => {
      await renderTimeoutDialog(page, `
        data-timeout="120"
        data-countdown="62"
        data-keep-alive-url="?keepalive"
        data-timeout-url="/timeout-reached"
        data-sign-out-url="/signed-out-early"
      `);

      await clockTickSeconds(page, 59);

      const visibleCountdownWithMoreThanAMinuteRemaining = await page.$eval('#hmrc-timeout-countdown', (element) => element.textContent);

      const visibleCountdownDuringLastMinute = await takeTextContentEachSecondForAMinute(page, '#hmrc-timeout-countdown');

      expect(visibleCountdownWithMoreThanAMinuteRemaining).toBe('2 minutes');

      expect(visibleCountdownDuringLastMinute.slice(0, 5)).toStrictEqual([
        '1 minute',
        '59 seconds',
        '58 seconds',
        '57 seconds',
        '56 seconds',
      ]);

      expect(visibleCountdownDuringLastMinute.slice(-5)).toStrictEqual([
        '5 seconds',
        '4 seconds',
        '3 seconds',
        '2 seconds',
        '1 second',
      ]);
      // sometimes we have already reached timeout page
      // so we can discard exceptions after this point
      await clockTickSeconds(page, 1).catch(() => {});
      await page.waitForNavigation({ timeout: 1000 }).catch(() => {});
      await expect(page.url()).toMatch('/timeout-reached');
    });

    function nineteenTimes(value) { return Array.from({ length: 19 }, () => value); }

    it('should update the audible time remaining every 20 seconds', async () => {
      await renderTimeoutDialog(page, `
        data-timeout="120"
        data-countdown="62"
        data-keep-alive-url="?keepalive"
        data-timeout-url="/timeout-reached"
        data-sign-out-url="/signed-out-early"
      `);

      await clockTickSeconds(page, 59);

      const audibleMessageWithMoreThanAMinuteRemaining = await audibleCountdownFrom(page);

      const allAudibleMessagesDuringLastMinute = await takeTextContentEachSecondForAMinute(page, '#hmrc-timeout-message');

      expect(audibleMessageWithMoreThanAMinuteRemaining)
        .toBe('For your security, we will sign you out in 2 minutes.');

      expect(allAudibleMessagesDuringLastMinute.slice(0, 19)).toStrictEqual(
        nineteenTimes('For your security, we will sign you out in 1 minute.'),
      );

      expect(allAudibleMessagesDuringLastMinute.slice(20, 39)).toStrictEqual(
        nineteenTimes('For your security, we will sign you out in 40 seconds.'),
      );

      expect(allAudibleMessagesDuringLastMinute.slice(40, 59)).toStrictEqual(
        nineteenTimes('For your security, we will sign you out in 20 seconds.'),
      );

      await clockTickSeconds(page, 1);
      await page.waitForNavigation({ timeout: 1000 });
      await expect(page.url()).toMatch('/timeout-reached');
    });
  });

  it('should not keep counting down after timeout is reached if the timeout page is slow', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="20"
      data-countdown="10"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    let completeSlowTimeoutRequest;
    const slowTimeout = new Promise((resolve) => { completeSlowTimeoutRequest = resolve; });
    await page.setRequestInterception(true);
    page.once('request', (req) => {
      slowTimeout.then(() => {
        req.respond({
          contentType: 'text/plain',
          body: 'timeout page reached',
        });
        page.setRequestInterception(false);
      });
    });
    const [visibleMessage, audibleMessage] = await page.evaluate(() => {
      window.clock.tick(10000); // bring up warning
      window.clock.tick(30000); // overrun timeout by 20s, the redirect will hang until resolved
      return [
        document.querySelector('.hmrc-timeout-dialog__message').textContent,
        document.querySelector('#hmrc-timeout-message').textContent,
      ];
    });
    expect(visibleMessage).toBe('For your security, we will sign you out in 0 seconds.');
    expect(audibleMessage).toBe('For your security, we will sign you out in 20 seconds.');
    completeSlowTimeoutRequest();
    await page.waitForNavigation({ timeout: 1000 });
    await expect(page).toMatchTextContent('timeout page reached');
  });

  it('should display the time remaining as a whole number of seconds', async () => {
    await renderTimeoutDialog(page, `
      data-timeout="20"
      data-countdown="10"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
    `);
    await clockTick(page, 13140);
    await expect(page).toMatchTextContent('For your security, we will sign you out in 7 seconds.');
    await clockTick(page, 2700);
    await expect(page).toMatchTextContent('For your security, we will sign you out in 5 seconds.');
    await clockTick(page, 160);
    await expect(page).toMatchTextContent('For your security, we will sign you out in 4 seconds.');
    await clockTickSeconds(page, 3);
    await expect(page).toMatchTextContent('For your security, we will sign you out in 1 second.');
  });

  it('should incorporate a delay receiving session activity into new timeout countdown', async () => {
    const session = await browser.createBrowserContext();
    const background = await session.newPage();
    await renderTimeoutDialog(background, `
      data-timeout="20"
      data-countdown="10"
      data-keep-alive-url="?keepalive"
      data-sign-out-url="/timeout-reached"
      data-synchronise-tabs="true"
    `);
    await clockTickSeconds(background, 15);
    const foreground = await session.newPage();
    await expect(background).toShowTimeoutDialog();
    expect(await visualCountdownFrom(background))
      .toBe('For your security, we will sign you out in 5 seconds.');
    await useFakeTimers(foreground, { now: 10000 });
    // by opening the new page with a clock initialized 5s in the past, we can fake that
    // the session activity msg it broadcasts was received delayed by the bg tab, as if
    // 5s passed since the fg page was opened, and test that the delay is incorporated in
    // the calculation of time remaining in session by the bg page.
    await render(foreground, withHmrcStylesAndScripts('so that we broadcast session activity'));
    await background.bringToFront();
    await expect(background).not.toShowTimeoutDialog();
    await clockTickSeconds(background, 10);
    await expect(background).toShowTimeoutDialog();
    expect(await visualCountdownFrom(background))
      .toBe('For your security, we will sign you out in 5 seconds.');
    await session.close();
  });

  // TODO because currently it would actually log you out straight away, this is an edge case
  it.skip('should keep using the current time remaining when it is greater than that calculated from received session activity', async () => {
    const session = await browser.createBrowserContext();
    const background = await session.newPage();
    await useFakeTimers(background, 25000);
    await render(background, withHmrcStylesAndScripts(`
      <meta name="hmrc-timeout-dialog"
        content="hmrc-timeout-dialog"
        data-timeout="20"
        data-countdown="10"
        data-keep-alive-url="?keepalive"
        data-sign-out-url="/timeout-reached"
        data-synchronise-tabs="true" />
    `));
    const foreground = await session.newPage();
    await useFakeTimers(foreground, { now: 0 });
    // simulate that since the broadcast session activity occurred the session would have timed out
    // while the current tab that receives the broadcast has still got 20s remaining until timeout
    await render(foreground, withHmrcStylesAndScripts('so that we broadcast session activity'));
    await background.bringToFront();
    await clockTickSeconds(background, 1);
    await background.waitForNetworkIdle();
    await expect(background.url()).not.toMatch('/timeout-reached');
    await clockTickSeconds(background, 9);
    await expect(background).toShowTimeoutDialog();
    expect(await visualCountdownFrom(background))
      .toBe('For your security, we will sign you out in 10 seconds.');
  });
});
