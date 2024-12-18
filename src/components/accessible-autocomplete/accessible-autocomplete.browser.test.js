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
  return withHmrcStylesAndScripts(`<form>${// because adam's polyfill needs select to be in a form
    renderComponent('govuk/components/select', params)
  }</form>`);
}

describe('Patched accessible autocomplete', () => {
  describe('will announce hints and errors linked to the underlying select', () => {
    it('should have links to them prepended to its aria-describedby', async () => {
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
            value: 'choose',
            text: 'Choose location',
          },
          // omitted other options for brevity of test
        ],
      }));

      const element = await page.$('#location');
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
      const ariaDescribedBy = await element.evaluate((el) => el.getAttribute('aria-describedby'));

      expect(tagName).not.toBe('select'); // or select element was not enhanced to be an autocomplete component
      expect(ariaDescribedBy).toBe('location-hint location-error location__assistiveHint');
    });

    it('should not have duplicate links in its aria-describedby if the page is still using adams polyfill', async () => {
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
            value: 'choose',
            text: 'Choose location',
          },
          // omitted other options for brevity of test
        ],
      }));

      await page.evaluate(adamsPolyfill);
      await delay(100); // because it takes ~50ms for adam's polyfill to apply

      const element = await page.$('#location');
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
      const ariaDescribedBy = await element.evaluate((el) => el.getAttribute('aria-describedby'));

      expect(tagName).not.toBe('select'); // or select element was not enhanced to be an autocomplete component
      expect(ariaDescribedBy).toBe('location-hint location-error location__assistiveHint');
    });
  });

  describe('will inherit error state from the underlying select', () => {
    it('should have a red border', async () => {
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
            value: 'choose',
            text: 'Choose location',
          },
          // omitted other options for brevity of test
        ],
      }));

      const element = await page.$('#location');
      const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
      const borderColor = await element.evaluate((el) => getComputedStyle(el).getPropertyValue('border-color'));

      expect(tagName).not.toBe('select'); // or select element was not enhanced to be an autocomplete component
      expect(borderColor).toBe('rgb(212, 53, 28)');
    });
  });

  describe('will not retain the previous selection after the value has changed', () => {
    it('should clear the current value of the underlying select when input is changed', async () => {
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
            value: 'choose',
            text: 'Choose location',
          },
          {
            value: 'london',
            text: 'London',
          },
        ],
      }));

      await expect(page).toFill('#location', 'Lon');
      await page.$eval('#location + ul li:nth-child(1)', (firstAutocompleteSuggestion) => firstAutocompleteSuggestion.click());
      expect(await page.$eval('select', (select) => select.value)).toBe('london');
      await expect(page).toFill('#location', 'Bristol');
      await page.$eval('#location', (input) => input.blur()); // simulate clicking out of field
      expect(await page.$eval('select', (select) => select.value)).toBe('');
    });

    it('should select a matching option in the underlying select when input is changed if there is one', async () => {
      await render(page, withGovukSelect({
        id: 'location',
        name: 'location',
        attributes: {
          'data-module': 'hmrc-accessible-autocomplete',
          'data-auto-select': 'false',
          // onConfirm (which selects matching option) runs regardless of auto select by default
          // auto select would let you type a partial match and click out of the field as well
          // we're not changing the behaviour here, but because we're overriding onConfirm we've
          // got this to verify the pre-existing behaviour is maintained.
        },
        label: {
          text: 'Choose location',
        },
        items: [
          {
            value: 'choose',
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

      await expect(page).toFill('#location', 'Lon');
      await page.$eval('#location + ul li:nth-child(1)', (firstAutocompleteSuggestion) => firstAutocompleteSuggestion.click());
      expect(await page.$eval('select', (select) => select.value)).toBe('london');
      await expect(page).toFill('#location', 'South West');
      await page.$eval('#location', (input) => input.blur()); // simulate clicking out of field
      // await jestPuppeteer.debug();
      // TODO this does not seem to be working? I've confirmed that confirmOnBlur is on...
      // maybe it's blur on something else :hmm:
      expect(await page.$eval('select', (select) => select.value)).toBe('southwest');
    });
  });
});
