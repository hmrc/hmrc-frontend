module.exports = async (page, { beforeTakingScreenshot }) => {
  const allowedPageActions = {}
  const postInteractionWait = 150 // ms, to reduce flakiness without having to modify old implementations

  allowedPageActions.click = async selector => {
    await page.waitForSelector(selector);
    await page.click(selector);
    await page.waitForTimeout(postInteractionWait);
  }

  allowedPageActions.hover = async selector => {
    await page.waitForSelector(selector);
    await page.hover(selector);
    await page.waitForTimeout(postInteractionWait);
  }

  allowedPageActions.focus = async selector => {
    await page.waitForSelector(selector);
    await page.focus(selector);
    await page.waitForTimeout(postInteractionWait);
  }

  allowedPageActions.type = async ({ into, text }) => {
    await page.waitForSelector(into);
    await page.type(into, text);
    await page.waitForTimeout(postInteractionWait);
  }

  allowedPageActions.waitFor = async selectorOrDuration => {
    const timeoutDuration = parseInt(selectorOrDuration)
    if (timeoutDuration > 0) {
      await page.waitForTimeout(timeoutDuration);
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
