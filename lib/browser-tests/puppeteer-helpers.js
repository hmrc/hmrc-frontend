import path from 'path';
import fs from 'fs';
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
  await page.setRequestInterception(true);
  const interceptPageRender = (req) => {
    if (req.url() === 'http://localhost:3000/') {
      return req.respond({ contentType: 'text/html', body });
    }
    return Promise.resolve().then(() => req.continue()).catch(() => {});
  };
  page.on('request', interceptPageRender);
  try {
    await page.goto('http://localhost:3000/', options); // if ever flaky, waitUntil networkidle0 (js loaded)
    await page.bringToFront();
  } finally {
    page.off('request', interceptPageRender);
    await page.setRequestInterception(false);
  }
  return page;
}
