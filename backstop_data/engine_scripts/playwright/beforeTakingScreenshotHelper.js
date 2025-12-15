module.exports = async (page, { beforeTakingScreenshot }) => {
  const allowedPageActions = {}

  allowedPageActions.click = async selector => {
    await page.waitForSelector(selector);
    await page.click(selector);
  }

  allowedPageActions.hover = async selector => {
    await page.waitForSelector(selector);
    await page.hover(selector);
  }

  allowedPageActions.focus = async selector => {
    await page.waitForSelector(selector);
    await page.focus(selector);
  }

  allowedPageActions.type = async ({ into, text }) => {
    await page.waitForSelector(into);
    await page.type(into, text);
  }

  allowedPageActions.waitFor = async selectorOrDuration => {
    if (parseInt(selectorOrDuration) > 0) {
      await page.waitForTimeout(selectorOrDuration)
    } else {
      await page.waitForSelector(selectorOrDuration);
    }
  }

  allowedPageActions.zoom = async zoom => {
    await page.evaluate((zoom) => {
      document.body.style.zoom = zoom
    }, zoom);
  }

  allowedPageActions.increaseFontSizes = async fontSize => {
    await page.evaluate((fontSize) => {
      document.documentElement.style.fontSize = fontSize
    }, fontSize);
  }

  if (beforeTakingScreenshot) {
    for (const step of beforeTakingScreenshot) {
      const [action, params] = Object.entries(step)[0];
      await allowedPageActions[action](params);
    }
  }
};
