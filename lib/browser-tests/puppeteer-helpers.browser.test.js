import {
  delay,
  useFakeTimers,
  clockTick,
  render,
  withHmrcStylesAndScripts,
} from './puppeteer-helpers';

describe('puppeteer-helpers', () => {
  it('should allow us to render html without a server and fake browser timers', async () => {
    await useFakeTimers(page);
    await render(page, `
      <div id="target">counting down</div>
      <script>window.setTimeout(function() {
        document.getElementById("target").innerText = "timeout reached"
      }, 500)</script>
    `);
    await expect(page).toMatchElement('#target', { text: 'counting down' });
    await delay(1000);
    await expect(page).toMatchElement('#target', { text: 'counting down' });
    await clockTick(page, 1000);
    await expect(page).toMatchElement('#target', { text: 'timeout reached' });
  });

  it('should make it easy to render html with the hmrc styles and scripts', async () => {
    await useFakeTimers(page);
    await render(page, withHmrcStylesAndScripts(`
      <meta name="hmrc-timeout-dialog"
        content="hmrc-timeout-dialog"
        data-timeout="60"
        data-countdown="55"
        data-keep-alive-url="?keepalive"
        data-sign-out-url="/timeout-reached"
        data-synchronise-tabs="true"/>
    `));
    await clockTick(page, 6000);
    await expect(page).toMatchTextContent('about to be signed out');
    const fontFamily = await page.evaluate(() => window.getComputedStyle(
      document.querySelector('#hmrc-timeout-heading'),
    ).fontFamily);
    expect(fontFamily).toMatch('GDS Transport');
  });
});
