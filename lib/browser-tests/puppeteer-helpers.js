import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { version } from '../../package.json';

export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const pathToSinonjsBrowserPkgSrc = path.resolve(__dirname, '../../node_modules/sinon/pkg/sinon.js');

export async function useFakeTimers(page, config = {}) {
  await page.evaluateOnNewDocument(`
    if (!window.clock) {
      ${fs.readFileSync(pathToSinonjsBrowserPkgSrc, 'utf8')}
      window.clock = sinon.useFakeTimers(${JSON.stringify(config)})
    }
  `);
}

export async function clockTick(page, ms) {
  // eslint-disable-next-line no-shadow
  await page.evaluate((ms) => window.clock.tick(ms), ms);
}

export async function clockTickSeconds(page, s) {
  await clockTick(page, s * 1000);
}

const preloadGovukFonts = fs.readdirSync(
  path.join(__dirname, '../../node_modules/govuk-frontend/dist/govuk/assets/fonts'),
).map((font) => `
  <link rel="preload" href="/assets/govuk/fonts/${font}" as="font" type="font/${font.split('.').slice(-1)[0]}" crossorigin>
`).join('');

export function withHmrcStylesAndScripts(body) {
  return `
    <!DOCTYPE html>
    <html lang="en" class="govuk-template">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
      <link rel="stylesheet" href="/assets/hmrc-frontend-${version}.min.css">
      <link rel="stylesheet" href="/assets/accessible-autocomplete-${version}.css">
      ${preloadGovukFonts}
    </head>
    <body class="govuk-template__body">
      <script>
        document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '');
      </script>
        ${body}
        <script src="/assets/hmrc-frontend-${version}.min.js" type="module"></script>
        <script src="/assets/accessible-autocomplete-${version}.js" type="module"></script>
    </body>
    </html>
  `;
}

export async function render(page, body, options) {
  const temporaryPageUrl = `http://localhost:3000/${crypto.randomUUID()}`;
  await page.setRequestInterception(true);
  const serveTemporaryPage = async (req) => {
    if (req.isInterceptResolutionHandled()) return;

    if (req.url() === temporaryPageUrl) {
      await req.respond({ contentType: 'text/html', body });
    } else {
      // we need to fulfill requests for css and fonts
      // or our tests will hang and fail after 30 seconds
      // with a navigation timeout.
      await req.continue();
    }
  };
  page.on('request', serveTemporaryPage);
  await page.goto(temporaryPageUrl, options);
  await page.evaluateHandle('document.fonts.ready');
  await page.bringToFront();
  page.off('request', serveTemporaryPage);
  await page.setRequestInterception(false);
  return page;
}
