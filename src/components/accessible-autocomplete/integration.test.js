/**
 * @jest-environment ./lib/puppeteer/environment.js
 */

/* eslint-env jest */
import configPaths from '../../../config/paths.json';

let browser;
let page;

const PORT = configPaths.ports.test;

const baseUrl = `http://localhost:${PORT}`;

beforeAll(async () => {
  // eslint-disable-next-line no-underscore-dangle
  browser = global.__BROWSER__;
  page = await browser.newPage();
});

describe('enhanceSelectElement on the select element provided', () => {
  it('should transform select element into input with default values', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/default/preview`);

    const autocompleteWrapper = await page.$('.autocomplete__wrapper');
    const autocompleteAttr = await page.$('input[autocomplete="off"]');
    const showAllValuesClass = await page.$('.autocomplete__input--show-all-values');
    const selectDefaultValue = await page.evaluate(() => {
      const el = document.querySelector('.autocomplete__option');
      return el.textContent;
    });

    expect(autocompleteWrapper).toBeTruthy();
    expect(autocompleteAttr).toBeTruthy();
    expect(showAllValuesClass).toBeFalsy();
    expect(selectDefaultValue).toBe('France');
  });

  it('should transform select element into input with default values when no optional data attributes are provided', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/without-optional-data-attributes/preview`);

    const autocompleteWrapper = await page.$('.autocomplete__wrapper');
    const autocompleteAttr = await page.$('input[autocomplete="off"]');
    const showAllValuesClass = await page.$('.autocomplete__input--show-all-values');
    const selectDefaultValue = await page.evaluate(() => {
      const el = document.querySelector('.autocomplete__option');
      return el.textContent;
    });

    expect(autocompleteWrapper).toBeTruthy();
    expect(autocompleteAttr).toBeTruthy();
    expect(showAllValuesClass).toBeFalsy();
    expect(selectDefaultValue).toBe('France');
  });

  it('should have default value set to empty', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-empty-default-value/preview`);

    const selectDefaultValue = await page.$('.autocomplete__option');
    expect(selectDefaultValue).toBeFalsy();
  });

  it('should have set default value', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-default-value/preview`);

    const selectDefaultValue = await page.evaluate(() => document.querySelector('.autocomplete__option').textContent);
    expect(selectDefaultValue).toMatch('Germany');
  });

  it('should present all options when showAllValues is true', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-show-all-values/preview`);

    const input = await page.$('#location-picker');
    await input.click();

    const autocompleteList = await page.$('.autocomplete__menu--visible');
    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option'));

    expect(autocompleteList).toBeTruthy();
    expect(Object.keys(visibleElements).length).toEqual(3);
  });

  it('should present one option when showAllValues is false', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/default/preview`);

    const input = await page.$('#location-picker');
    await input.click();

    const autocompleteList = await page.$('.autocomplete__menu--visible');
    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option'));

    expect(autocompleteList).toBeTruthy();
    expect(Object.keys(visibleElements).length).toEqual(1);
  });

  it('should highlight first found option when autoselect is true', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-autoselect-on/preview`);

    const input = await page.$('#location-picker');
    await input.click();
    await page.waitForSelector('#location-picker');
    // eslint-disable-next-line no-param-reassign,no-return-assign
    await page.$eval('#location-picker', (el) => el.value = 'Fr');
    await input.click();

    const autocompleteFocused = await page.$('.autocomplete__menu--visible');
    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option--focused'));

    expect(autocompleteFocused).toBeTruthy();
    expect(Object.keys(visibleElements).length).toEqual(1);

    await page.keyboard.press('Enter');
    const selectedOption = await page.evaluate(() => document.querySelector('.autocomplete__option').textContent);

    expect(selectedOption).toBe('France');
  });

  it('should not highlight first found option when autoselect is false', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/default/preview`);

    const input = await page.$('#location-picker');
    await input.click();
    await page.waitForSelector('#location-picker');
    // eslint-disable-next-line no-param-reassign,no-return-assign
    await page.$eval('#location-picker', (el) => el.value = 'Fr');
    await input.click();

    const autocompleteFocused = await page.$('.autocomplete__menu--visible');
    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option--focused'));

    expect(autocompleteFocused).toBeTruthy();
    expect(Object.keys(visibleElements).length).toEqual(0);
  });
});
