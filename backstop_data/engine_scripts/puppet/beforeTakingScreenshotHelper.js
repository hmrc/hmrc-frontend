module.exports = async (page, { beforeTakingScreenshot }) => {
  const allowedPageActions = {}

  allowedPageActions.click = async selector =>
    await page.click(selector);

  allowedPageActions.hover = async selector =>
    await page.hover(selector);

  allowedPageActions.focus = async selector =>
    await page.focus(selector);

  allowedPageActions.type = async ({ into, text }) =>
    await page.type(into, text);

  allowedPageActions.press = async key =>
    await page.press(key);

  allowedPageActions.waitFor = async selector =>
    await page.waitForSelector(selector);

  allowedPageActions.setRefererSameDomain = async refererIsSameDomain => {
    if(refererIsSameDomain) {
      const pageUrl = page.url();
      await page.goto(pageUrl, {
        referer: pageUrl,
        referrerPolicy: 'origin'
      });
    }
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
