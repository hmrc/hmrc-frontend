import { examplePreview } from '../../../lib/url-helpers';

describe('open print dialog', () => {
  it('should display print dialog when link is clicked', async () => {
    await page.goto(examplePreview('hmrc-print-link/default'));
    await page.evaluate(() => {
      window.print = () => {
        window.printDialogOpened = true;
      };
    });
    await page.click('a[data-module="hmrc-print-link"]');
    const printDialogOpened = await page.evaluate(() => window.printDialogOpened);
    expect(printDialogOpened).toBe(true);
  });
});
