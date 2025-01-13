import { readFileSync } from 'fs';
import path from 'path';
import {
  delay,
  render,
  withHmrcStylesAndScripts,
} from '../../../lib/browser-tests/puppeteer-helpers';

import { renderString as renderComponent } from '../../../lib/jest-helpers';

const adamsPolyfill = readFileSync(path.join(__dirname, '__tests__', '2024-12-adams-polyfill.js.txt'), 'utf8');

function withGovukSelect(params) {
  return withHmrcStylesAndScripts(`<form method="post"><button type="submit">Submit</button>${
    // wrapped in form because adam's polyfill needs select to be in a form
    // submit button precedes select because when it follows it, trying to
    // click it when suggestions are showing causes it to move when they
    // collapse and that then makes the click miss the button
    renderComponent('govuk/components/select', params)
  }</form>`);
}

function acceptFirstSuggestionFor(autocompleteSelector) {
  return page.$eval(`${autocompleteSelector} ~ ul[role="listbox"] li:nth-child(1)`, (firstSuggestion) => firstSuggestion.click());
}

async function interceptNextFormPost(page) {
  let completePostedFormData;
  const postedFormData = (
    new Promise((resolve) => { completePostedFormData = resolve; })
  ).finally(async () => {
    await page.setRequestInterception(false);
  });
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.method() === 'POST') {
      completePostedFormData(request.postData());
      return request.respond({ status: 200 });
    }
    return request.continue();
  });
  return {
    postedFormData,
  };
}

describe('Patched accessible autocomplete', () => {
  /**
   * We don't need to explicitly check there are no javascript errors
   * in the browser because we use jestPuppeteer to exitOnPageError
   * which does it for us.
   */

  it('should announce the hints and error message linked to the underlying select', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
      },
      label: {
        text: 'Choose location',
      },
      errorMessage: {
        text: 'You must choose a location',
      },
      hint: {
        text: 'This can be different to where you went before',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        // omitted other options for brevity of test
      ],
    }));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    const ariaDescribedBy = await element.evaluate((el) => el.getAttribute('aria-describedby'));
    expect(ariaDescribedBy).toBe('location-hint location-error location__assistiveHint');
  });

  // This wasn't something covered by the original polyfill we based our
  // patches on, so we've checked this should be the behaviour with
  // HMRC's Digital Inclusion and Accessibility Standards team (DIAS).
  it('should still announce the hints and error message linked to the underlying select after interaction with field', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
      },
      label: {
        text: 'Choose location',
      },
      errorMessage: {
        text: 'You must choose a location',
      },
      hint: {
        text: 'This can be different to where you went before',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        // omitted other options for brevity of test
      ],
    }));

    const currentAriaDescribedByFrom = (element) => element.evaluate((el) => el.getAttribute('aria-describedby'));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    await expect(page).toFill('#location', 'London');
    await element.evaluate((input) => input.blur());
    expect(await currentAriaDescribedByFrom(element)).toBe('location-hint location-error ');
    await expect(page).toFill('#location', '');
    // following shows that hint is retained if input is empty, and updates immediately
    expect(await currentAriaDescribedByFrom(element)).toBe('location-hint location-error location__assistiveHint');
  });

  it('should still announce the assistiveHint correctly if there is no hint or error on the select', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
      },
      label: {
        text: 'Choose location',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        // omitted other options for brevity of test
      ],
    }));

    const currentAriaDescribedByFrom = (element) => element.evaluate((el) => el.getAttribute('aria-describedby'));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    expect(await currentAriaDescribedByFrom(element)).toBe('location__assistiveHint');
    await expect(page).toFill('#location', 'London');
    await element.evaluate((input) => input.blur());
    expect(await currentAriaDescribedByFrom(element)).toBe(null);
    await expect(page).toFill('#location', '');
    // following shows that hint is retained if input is empty, and updates immediately
    expect(await currentAriaDescribedByFrom(element)).toBe('location__assistiveHint');
  });

  it('should inherit the error state of the underlying select', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
      },
      label: {
        text: 'Choose location',
      },
      errorMessage: {
        text: 'You must choose a location',
      },
      hint: {
        text: 'This can be different to where you went before',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        // omitted other options for brevity of test
      ],
    }));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    const borderColor = await element.evaluate((el) => getComputedStyle(el).getPropertyValue('border-color'));
    expect(borderColor).toBe('rgb(212, 53, 28)');
  });

  it('should not retain the previous selection if an invalid option is entered', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
        'data-auto-select': 'false',
        // this is the default, but included to be explicit with test state
        // auto select would mean that you don't have to enter exactly matching
        // text to select on blur
      },
      label: {
        text: 'Choose location',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        {
          value: 'london',
          text: 'London',
        },
        {
          value: 'southwest',
          text: 'South West',
        },
      ],
    }));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    await expect(page).toFill('#location', 'Lon');
    await acceptFirstSuggestionFor('#location');
    expect(await page.$eval('select', (select) => select.value)).toBe('london');
    await expect(page).toFill('#location', 'South');
    await page.$eval('#location', (input) => input.blur());
    expect(await page.$eval('select', (select) => select.value)).toBe('');
  });

  it('should post nothing if user input does not exactly match any option and form is immediately submitted', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
        'data-auto-select': 'false',
        // this is the default, but included to be explicit with test state
        // auto select would mean that you don't have to enter exactly matching
        // text to select on blur
      },
      label: {
        text: 'Choose location',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        {
          value: 'london',
          text: 'London',
        },
        {
          value: 'southwest',
          text: 'South West',
        },
      ],
    }));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    await expect(page).toFill('#location', 'London');
    await element.evaluate((input) => input.blur());
    expect(await page.$eval('select', (select) => select.value)).toBe('london');
    const { postedFormData } = await interceptNextFormPost(page);
    await element.click();
    await element.type('South');
    await page.click('button[type="submit"]');
    await expect(postedFormData).resolves.toBe(undefined);
  });

  it('should post matching value if user input exactly matches an option and form is immediately submitted', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
        'data-auto-select': 'false',
        // this is the default, but included to be explicit with test state
        // auto select would mean that you don't have to enter exactly matching
        // text to select on blur
      },
      label: {
        text: 'Choose location',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        {
          value: 'london',
          text: 'London',
        },
        {
          value: 'southwest',
          text: 'South West',
        },
      ],
    }));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    await expect(page).toFill('#location', 'London');
    await element.evaluate((input) => input.blur());
    expect(await page.$eval('select', (select) => select.value)).toBe('london');
    const { postedFormData } = await interceptNextFormPost(page);
    await element.click();
    await element.type('South West');
    await page.click('button[type="submit"]');
    await expect(postedFormData).resolves.toBe('location=southwest');
  });

  it('should select any option with exactly matching text on blur, even if it was not chosen from the suggestions', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
        'data-auto-select': 'false',
        // this is the default, but included to be explicit with test state
        // auto select would mean that you don't have to enter exactly matching
        // text to select on blur
      },
      label: {
        text: 'Choose location',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        {
          value: 'london',
          text: 'London',
        },
        {
          value: 'southwest',
          text: 'South West',
        },
      ],
    }));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    await expect(page).toFill('#location', 'Lon');
    await acceptFirstSuggestionFor('#location');
    expect(await page.$eval('select', (select) => select.value)).toBe('london');
    await expect(page).toFill('#location', 'South West');
    await element.evaluate((input) => input.blur());
    expect(await page.$eval('select', (select) => select.value)).toBe('southwest');
  });

  it('should select the currently highlighted option on blur if interacting using keyboard', async () => {
    await render(page, withGovukSelect({
      id: 'location',
      name: 'location',
      attributes: {
        'data-module': 'hmrc-accessible-autocomplete',
        'data-auto-select': 'false',
      },
      label: {
        text: 'Choose location',
      },
      items: [
        {
          value: ' ',
          text: 'Choose location',
        },
        {
          value: 'london',
          text: 'London',
        },
        {
          value: 'southeast',
          text: 'South East',
        },
        {
          value: 'southwest',
          text: 'South West',
        },
      ],
    }));

    const element = await page.$('#location');
    await expect(element).toBeAccessibleAutocomplete();
    await expect(page).toFill('#location', 'Lon');
    await acceptFirstSuggestionFor('#location');
    expect(await page.$eval('select', (select) => select.value)).toBe('london');
    await expect(page).toFill('#location', 'South');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    expect(await page.$eval('select', (select) => select.value)).toBe('southwest');
  });

  describe('when page is still using adams polyfill', () => {
    it('should not have duplicated the links to the hint and error message of the underlying select', async () => {
      await render(page, withGovukSelect({
        id: 'location',
        name: 'location',
        attributes: {
          'data-module': 'hmrc-accessible-autocomplete',
        },
        label: {
          text: 'Choose location',
        },
        errorMessage: {
          text: 'You must choose a location',
        },
        hint: {
          text: 'This can be different to where you went before',
        },
        items: [
          {
            value: ' ',
            text: 'Choose location',
          },
          // omitted other options for brevity of test
        ],
      }));

      await page.evaluate(adamsPolyfill);
      await delay(100); // because it takes ~50ms for adam's polyfill to apply

      const element = await page.$('#location');
      await expect(element).toBeAccessibleAutocomplete();
      const ariaDescribedBy = await element.evaluate((el) => el.getAttribute('aria-describedby'));
      expect(ariaDescribedBy).toBe('location-hint location-error location__assistiveHint');
    });

    it('should not prevent form data being submitted', async () => {
      await render(page, withGovukSelect({
        id: 'location',
        name: 'location',
        attributes: {
          'data-module': 'hmrc-accessible-autocomplete',
        },
        label: {
          text: 'Choose location',
        },
        errorMessage: {
          text: 'You must choose a location',
        },
        hint: {
          text: 'This can be different to where you went before',
        },
        items: [
          {
            value: ' ',
            text: 'Choose location',
          },
          {
            value: 'london',
            text: 'London',
          },
        ],
      }));

      await page.evaluate(adamsPolyfill);
      await delay(100); // because it takes ~50ms for adam's polyfill to apply

      const element = await page.$('#location');
      await expect(element).toBeAccessibleAutocomplete();
      await expect(page).toFill('#location', 'Lon');
      await acceptFirstSuggestionFor('#location');
      const { postedFormData } = await interceptNextFormPost(page);
      await page.click('button[type="submit"]');
      await expect(postedFormData).resolves.toBe('location=london');
    });

    it('should still not retain previous selection when an invalid option is entered', async () => {
      await render(page, withGovukSelect({
        id: 'location',
        name: 'location',
        attributes: {
          'data-module': 'hmrc-accessible-autocomplete',
        },
        label: {
          text: 'Choose location',
        },
        errorMessage: {
          text: 'You must choose a location',
        },
        hint: {
          text: 'This can be different to where you went before',
        },
        items: [
          {
            value: ' ',
            text: 'Choose location',
          },
          {
            value: 'london',
            text: 'London',
          },
        ],
      }));

      await page.evaluate(adamsPolyfill);
      await delay(100); // because it takes ~50ms for adam's polyfill to apply

      const element = await page.$('#location');
      await expect(element).toBeAccessibleAutocomplete();
      await expect(page).toFill('#location', 'Lon');
      await acceptFirstSuggestionFor('#location');
      const { postedFormData } = await interceptNextFormPost(page);
      await expect(page).toFill('#location', 'South');
      await page.click('button[type="submit"]');
      await expect(postedFormData).resolves.toBe(undefined);
    });
  });
});
