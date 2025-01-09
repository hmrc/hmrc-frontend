beforeEach(async () => {
  await jestPuppeteer.resetPage();
});

expect.extend({
  async toShowTimeoutDialog(page) {
    try {
      await page.waitForSelector('#hmrc-timeout-dialog', { timeout: 1000 });
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
  async toBeAccessibleAutocomplete(element) {
    const elementDetails = await element.evaluate((el) => ({
      tagName: el.tagName.toLowerCase(),
      role: el.getAttribute('role'),
      parent: el.parentElement.classList.toString(),
    }));

    const isAccessibleAutocomplete = elementDetails.tagName === 'input'
      && elementDetails.role === 'combobox'
      && elementDetails.parent === 'autocomplete__wrapper';

    return {
      message: () => 'expected element to be accessible autocomplete',
      pass: isAccessibleAutocomplete,
    };
  },
});
