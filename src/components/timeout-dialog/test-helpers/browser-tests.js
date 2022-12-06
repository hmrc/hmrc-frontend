import path from 'path';
import browserify from 'browserify';

function packageScriptForBrowser(script) {
  return new Promise((resolve, reject) => {
    browserify(script).bundle((err, src) => {
      if (err) {
        reject(err);
      } else {
        resolve(src.toString('utf8'));
      }
    });
  });
}

export async function installFakeTimersOnLoad(page, initialSecondsOffset) {
  await page.evaluateOnNewDocument(
    await packageScriptForBrowser(path.join(__dirname, 'install-fake-timers.js')),
  );
  if (initialSecondsOffset) {
    await page.evaluateOnNewDocument(
      (ms) => window.clock.tick(ms),
      initialSecondsOffset * 1000,
    );
  }
  return async function advanceClock(seconds) {
    await page.evaluate(
      (ms) => window.clock.tick(ms),
      seconds * 1000,
    );
  };
}

export async function serveFakePage(page, url, body) {
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.url() === url) {
      req.respond({
        contentType: 'text/html',
        body,
      });
    } else {
      req.continue();
    }
  });
}
