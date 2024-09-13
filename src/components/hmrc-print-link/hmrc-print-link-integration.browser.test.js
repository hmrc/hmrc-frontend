import configPaths from '../../../config/paths.json';

const PORT = configPaths.ports.app;

const baseUrl = `http://localhost:${PORT}`;

describe('open print dialog', () => {
  it('should display print dialog when link is clicked', async () => {
    await page.goto(`${baseUrl}/components/hmrc-print-link/default/preview`);
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
