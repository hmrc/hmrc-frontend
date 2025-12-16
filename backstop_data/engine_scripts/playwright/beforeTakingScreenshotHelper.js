module.exports = async (page, { beforeTakingScreenshot }) => {
  const allowedPageActions = {}

  allowedPageActions.click = async selector => {
    await page.locator(selector).click();
  }

  allowedPageActions.hover = async selector => {
    await page.locator(selector).hover();
  }

  allowedPageActions.focus = async selector => {
    await page.locator(selector).focus();
  }

  allowedPageActions.type = async ({ into, text }) => {
    await page.locator(into).fill(text);
  }

  allowedPageActions.waitFor = async selectorOrDuration => {
    const timeoutDuration = parseInt(selectorOrDuration)
    if (timeoutDuration > 0) {
      await page.waitForTimeout(timeoutDuration);
    } else {
      await page.locator(selectorOrDuration).waitFor();
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

  // must have useFakeTimers:
  allowedPageActions.advanceClockInSeconds = async seconds => {
    await page.evaluate((ms) => {
      window.clock.tick(ms)
    }, seconds * 1000);
  }

  if (beforeTakingScreenshot) {
    for (const step of beforeTakingScreenshot) {
      const [action, params] = Object.entries(step)[0];
      await allowedPageActions[action](params);
    }
  }
};
