module.exports = async (page, { beforeTakingScreenshot }) => {
  const allowedPageActions = {};
  const postInteractionWait = 250; // ms

  allowedPageActions.click = async selector => {
    await page.locator(selector).click();
    await page.waitForTimeout(postInteractionWait);
  }

  allowedPageActions.hover = async selector => {
    await page.locator(selector).hover();
    await page.waitForTimeout(postInteractionWait);
  }

  allowedPageActions.focus = async selector => {
    await page.locator(selector).focus();
    await page.waitForTimeout(postInteractionWait);
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

  // must have backstopScenarioOptions: useFakeTimers: true
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
