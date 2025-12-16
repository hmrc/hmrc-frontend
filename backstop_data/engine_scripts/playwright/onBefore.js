const path = require('path');
const fs = require('fs');
const pathToSinonjsBrowserPkgSrc = path.resolve(__dirname, '../../../node_modules/sinon/pkg/sinon.js');

module.exports = async (page, { useFakeTimers }, viewport, isReference, browserContext) => {
  if (useFakeTimers) {
    await page.addInitScript({
      content: `
        if (!window.clock) {
          ${fs.readFileSync(pathToSinonjsBrowserPkgSrc, 'utf8')}
          window.clock = sinon.useFakeTimers(${
            (useFakeTimers === true)
              ? ''
              : JSON.stringify(useFakeTimers)
          })
        }
      `
    });
  }
};
