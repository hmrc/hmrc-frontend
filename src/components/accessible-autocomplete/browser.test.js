import { examplePreview } from '../../../lib/url-helpers';

describe('enhanceSelectElement on the select element provided', () => {
  it('should transform select element into input with default values', async () => {
    await page.goto(examplePreview('accessible-autocomplete/default'));

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
    await page.goto(examplePreview('accessible-autocomplete/without-optional-data-attributes'));

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
    await page.goto(examplePreview('accessible-autocomplete/with-empty-default-value'));

    const selectDefaultValue = await page.$('.autocomplete__option');
    expect(selectDefaultValue).toBeFalsy();
  });

  it('should have set default value', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-default-value'));

    const selectDefaultValue = await page.evaluate(() => document.querySelector('.autocomplete__option').textContent);
    expect(selectDefaultValue).toMatch('Germany');
  });

  it('should present all options when showAllValues is true', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-show-all-values'));

    const input = await page.$('#location-picker');
    await input.click();

    const autocompleteList = await page.$('.autocomplete__menu--visible');
    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option'));

    expect(autocompleteList).toBeTruthy();
    expect(Object.keys(visibleElements).length).toEqual(3);
  });

  it('should not present empty values when showAllValues is true', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-show-all-values'));

    const input = await page.$('#location-picker');
    await input.click();

    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option'));

    expect(Object.keys(visibleElements).length).toEqual(3);
    expect(Array.from(visibleElements).every((e) => e.textContent.trim() !== '')).toBeTruthy();
  });

  it('should present one option when showAllValues is false', async () => {
    await page.goto(examplePreview('accessible-autocomplete/default'));

    const input = await page.$('#location-picker');
    await input.click();

    const autocompleteList = await page.$('.autocomplete__menu--visible');
    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option'));

    expect(autocompleteList).toBeTruthy();
    expect(Object.keys(visibleElements).length).toEqual(1);
  });

  it('should highlight first found option when autoselect is true', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-autoselect-on'));

    const input = await page.$('#location-picker');
    await input.click();
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
    await page.goto(examplePreview('accessible-autocomplete/with-autoselect-on'));

    const input = await page.$('#location-picker');
    await input.click();
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

  it('should allow trailing and leading whitespace in query', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-show-all-values'));

    const input = await page.$('#location-picker');
    await input.click();

    await input.type(' Fr ');
    await input.click();

    const autocompleteFocused = await page.$('.autocomplete__menu--visible');
    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option'));

    expect(autocompleteFocused).toBeTruthy();
    expect(Object.keys(visibleElements).length).toEqual(1);

    await page.keyboard.press('Enter');
    const selectedOption = await page.evaluate(() => document.querySelector('.autocomplete__option').textContent);

    expect(selectedOption).toBe('France');
  });

  it('should not highlight first found option when autoselect is false', async () => {
    await page.goto(examplePreview('accessible-autocomplete/default'));

    const input = await page.$('#location-picker');
    await input.click();
    // eslint-disable-next-line no-param-reassign,no-return-assign
    await page.$eval('#location-picker', (el) => el.value = 'Fr');
    await input.click();

    const autocompleteFocused = await page.$('.autocomplete__menu--visible');
    const visibleElements = await page.evaluate(() => document.querySelectorAll('.autocomplete__option--focused'));

    expect(autocompleteFocused).toBeTruthy();
    expect(Object.keys(visibleElements).length).toEqual(0);
  });

  it('should render assistive hint in Welsh when data-language is cy', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-welsh-language'));

    const assistiveHint = await page.evaluate(() => document.querySelector('#location-picker__assistiveHint').textContent);

    expect(assistiveHint.trim()).toEqual(
      'Pan fydd canlyniadau awtogwblhau ar gael, defnyddiwch y saethau i fyny ac i lawr i’w hadolygu a phwyswch'
      + ' y fysell ’enter’ i’w dewis. Gall defnyddwyr dyfeisiau cyffwrdd, archwilio drwy gyffwrdd â’r sgrin neu drwy sweipio.',
    );
  });

  // for some reason, there are 2 status elements, and content bounces between them as you type...
  const isAssistiveStatusHintPopulated = () => document.querySelector('#location-picker__status--A').textContent.length > 0
    || document.querySelector('#location-picker__status--B').textContent.length > 0;

  async function getStatusHint() {
    return page.evaluate(() => {
      const assistiveStatusHint = () => document.querySelector('#location-picker__status--A').textContent
        + document.querySelector('#location-picker__status--B').textContent;
      return assistiveStatusHint();
    });
  }

  it('should render minimum length hint in Welsh when minimum length is specified but not met', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-welsh-language-and-min-length'));

    const input = await page.$('#location-picker');
    await input.click();

    // eslint-disable-next-line no-param-reassign,no-return-assign
    await page.$eval('#location-picker', (el) => el.value = 'Un');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await getStatusHint();
    expect(statusHint.trim()).toEqual('Ysgrifennwch 3 neu fwy o gymeriadau am ganlyniadau');
  });

  it('should render status hint in Welsh when data-language is cy and there are multiple matching results', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-welsh-language'));

    const input = await page.$('#location-picker');
    await input.click();

    // eslint-disable-next-line no-param-reassign,no-return-assign
    await page.$eval('#location-picker', (el) => el.value = 'Un');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await getStatusHint();
    expect(statusHint.trim()).toEqual('2 o ganlyniadau ar gael.');
  });

  it('should render status hint in Welsh when data-language is cy and there is a single matching result', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-welsh-language'));

    const input = await page.$('#location-picker');
    await input.click();

    await page.keyboard.press('F');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await getStatusHint();
    expect(statusHint.trim()).toEqual('1 canlyniad ar gael.');
  });

  it('should render status hint in Welsh when data-language is cy and there are no matching results', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-welsh-language'));

    const input = await page.$('#location-picker');
    await input.click();

    await page.keyboard.press('Z');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await getStatusHint();
    expect(statusHint.trim()).toEqual('Dim canlyniadau chwilio');
  });

  it('should render "no results found" dropdown in Welsh when data-language is cy and there are no matching results', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-welsh-language'));

    const input = await page.$('#location-picker');
    await input.click();

    await page.keyboard.press('Z');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await page.evaluate(() => document.querySelector('#location-picker__listbox').textContent);
    expect(statusHint.trim()).toEqual('Dim canlyniadau wedi’u darganfod');
  });

  it('should render status hint in Welsh when data-language is cy and an item is selected', async () => {
    await page.goto(examplePreview('accessible-autocomplete/with-welsh-language-and-autoselect-on'));

    const input = await page.$('#location-picker');
    await input.click();

    // eslint-disable-next-line no-param-reassign,no-return-assign
    await page.$eval('#location-picker', (el) => el.value = 'Un');
    await page.waitForFunction(isAssistiveStatusHintPopulated);

    const statusHint = await getStatusHint();
    expect(statusHint.trim()).toEqual('2 o ganlyniadau ar gael. Mae United Kingdom 1 o 2 wedi’i amlygu');
  });
});
