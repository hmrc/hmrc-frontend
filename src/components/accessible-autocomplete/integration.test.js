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

  it('should display hint text in correct font family when autoselect is on and user has partially inputted a matched item', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-autoselect-on/preview`);

    const input = await page.$('#location-picker');
    await input.click();
    await page.waitForSelector('#location-picker');
    // eslint-disable-next-line no-param-reassign,no-return-assign
    await page.$eval('#location-picker', (el) => el.value = 'Fr');
    await page.waitForSelector('.autocomplete__hint');
    const { hintFontFamily, hintValue } = await page.evaluate(() => {
      const fontFamily = window.getComputedStyle(document.querySelector('input')).font;
      const { value } = document.querySelector('.autocomplete__hint');
      return { hintFontFamily: fontFamily, hintValue: value };
    });
    expect(hintFontFamily).toContain('GDS Transport');
    expect(hintValue).toEqual('France');
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

  it('should render assistive hint in Welsh when data-language is cy', async () => {
    // await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);

    const assistiveHint = await page.evaluate(() => document.querySelector('#location-picker__assistiveHint').textContent);

    expect(assistiveHint.trim()).toEqual(
      'Pan fydd canlyniadau awtogwblhau ar gael, defnyddiwch y saethau i fyny ac i lawr i’w hadolygu a phwyswch'
      + ' y fysell ’enter’ i’w dewis. Gall defnyddwyr dyfeisiau cyffwrdd, archwilio drwy gyffwrdd â’r sgrin neu drwy sweipio.',
    );
  });

  // for some reason, there are 2 status elements, and content bounces between them as you type...
  const isAssistiveStatusHintPopulated = () => document.querySelector('#location-picker__status--A').textContent.length > 0
    || document.querySelector('#location-picker__status--B').textContent.length > 0;

  it('should render minimum length hint in Welsh when minimum length is specified but not met', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language-and-min-length/preview`);

    const input = await page.$('#location-picker');
    await input.click();

    await page.keyboard.press('U');
    await page.keyboard.press('n');

    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await page.evaluate(() => {
      // TODO DRY this up
      const assistiveStatusHint = () => document.querySelector('#location-picker__status--A').textContent
        + document.querySelector('#location-picker__status--B').textContent;
      return assistiveStatusHint();
    });

    expect(statusHint.trim()).toEqual('Ysgrifennwch 3 neu fwy o gymeriadau am ganlyniadau');
  });

  it('should render status hint in Welsh when data-language is cy and there are multiple matching results', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);

    const input = await page.$('#location-picker');
    await input.click();

    await page.keyboard.press('U');
    await page.keyboard.press('n');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await page.evaluate(() => {
      // TODO DRY this up
      const assistiveStatusHint = () => document.querySelector('#location-picker__status--A').textContent
        + document.querySelector('#location-picker__status--B').textContent;
      return assistiveStatusHint();
    });

    expect(statusHint.trim()).toEqual('2 o ganlyniad ar gael.');
  });

  it('should render status hint in Welsh when data-language is cy and there is a single matching result', async () => {
    // await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);

    const input = await page.$('#location-picker');
    await input.click();

    await page.keyboard.press('F');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await page.evaluate(() => {
      // TODO DRY this up
      const assistiveStatusHint = () => document.querySelector('#location-picker__status--A').textContent
        + document.querySelector('#location-picker__status--B').textContent;
      return assistiveStatusHint();
    });

    expect(statusHint.trim()).toEqual('1 canlyniad ar gael.');
  });

  it('should render status hint in Welsh when data-language is cy and there are no matching results', async () => {
    // await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);

    const input = await page.$('#location-picker');
    await input.click();

    await page.keyboard.press('Z');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await page.evaluate(() => {
      // TODO DRY this up
      const assistiveStatusHint = () => document.querySelector('#location-picker__status--A').textContent
        + document.querySelector('#location-picker__status--B').textContent;
      return assistiveStatusHint();
    });

    expect(statusHint.trim()).toEqual('Dim canlyniadau chwilio');
  });

  it('should render "no results found" dropdown in Welsh when data-language is cy and there are no matching results', async () => {
    // await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language/preview`);

    const input = await page.$('#location-picker');
    await input.click();

    await page.keyboard.press('Z');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await page.evaluate(() => document.querySelector('#location-picker__listbox').textContent);

    expect(statusHint.trim()).toEqual('Dim canlyniadau wedi’u darganfod');
  });

  it('should render status hint in Welsh when data-language is cy and an item is selected', async () => {
    await page.goto(`${baseUrl}/components/accessible-autocomplete/with-welsh-language-and-autoselect-on/preview`);

    const input = await page.$('#location-picker');
    await input.click();
    await page.waitForSelector('#location-picker');
    // eslint-disable-next-line no-param-reassign,no-return-assign
    await page.$eval('#location-picker', (el) => el.value = 'Un');

    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await page.evaluate(() => {
      // TODO DRY this up
      const assistiveStatusHint = () => document.querySelector('#location-picker__status--A').textContent
        + document.querySelector('#location-picker__status--B').textContent;
      return assistiveStatusHint();
    });

    expect(statusHint.trim()).toEqual('2 o ganlyniad ar gael. Mae United Kingdom 1 o 2 wedi’i amlygu');
  });
});
