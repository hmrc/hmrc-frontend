beforeEach(async () => {
  await jestPuppeteer.resetPage();
});

expect.extend({
  async toShowTimeoutDialog(page) {
    try {
      await page.waitForSelector('#hmrc-timeout-dialog', { timeout: 500 });
      return {
        message: () => 'expected page not to show timeout dialog',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => 'expected page to show timeout dialog',
        pass: false,
      };
    }
  },
});
