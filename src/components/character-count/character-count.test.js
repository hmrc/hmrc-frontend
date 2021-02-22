/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */
import configPaths from '../../../config/paths.json';

const PORT = configPaths.ports.test;

let browser;
let page;
const baseUrl = `http://localhost:${PORT}`;

const goToExample = (exampleName = false) => {
  const url = exampleName
    ? `${baseUrl}/components/character-count/${exampleName}/preview`
    : `${baseUrl}/components/character-count/preview`;

  return page.goto(url, { waitUntil: 'load' });
};

describe('Character count', () => {
  describe('when JavaScript is unavailable or fails', () => {
    beforeAll(async () => {
      // eslint-disable-next-line no-underscore-dangle
      browser = global.__BROWSER__;
      page = await browser.newPage();
      await page.setJavaScriptEnabled(false);
    });

    afterAll(async () => {
      await page.setJavaScriptEnabled(true);
      await page.close();
    });

    it('shows the static message', async () => {
      await goToExample();
      const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

      expect(message).toEqual('You can enter up to 10 characters');
    });

    it('shows the Welsh static message', async () => {
      await goToExample('default-welsh');
      const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

      expect(message).toEqual('Gallwch nodi hyd at 10 o gymeriadau');
    });
  });

  describe('when JavaScript is available', () => {
    beforeAll(async () => {
      // eslint-disable-next-line no-underscore-dangle
      browser = global.__BROWSER__;
      page = await browser.newPage();
    });

    afterAll(async () => {
      await page.close();
    });

    describe('when counting characters', () => {
      it('shows the dynamic message', async () => {
        await goToExample();

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('You have 10 characters remaining');
      });

      it('shows the dynamic message in Welsh', async () => {
        await goToExample('default-welsh');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('Mae gennych 10 o gymeriadau yn weddill');
      });

      it('shows the characters remaining if the field is pre-filled', async () => {
        await goToExample('with-default-value');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('You have 67 characters remaining');
      });

      it('shows the characters remaining in Welsh if the field is pre-filled', async () => {
        await goToExample('with-default-value-welsh');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('Mae gennych 67 o gymeriadau yn weddill');
      });

      it('counts down to the character limit', async () => {
        await goToExample();
        await page.type('.hmrc-js-character-count', 'A');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('You have 9 characters remaining');
      });

      it('counts down to the character limit in Welsh', async () => {
        await goToExample('default-welsh');
        await page.type('.hmrc-js-character-count', 'A');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('Mae gennych 9 o gymeriadau yn weddill');
      });

      it('uses the singular when there is only one character remaining', async () => {
        await goToExample();
        await page.type('.hmrc-js-character-count', 'A'.repeat(9));

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('You have 1 character remaining');
      });

      it('uses the singular in Welsh when there is only one character remaining', async () => {
        await goToExample('default-welsh');
        await page.type('.hmrc-js-character-count', 'A'.repeat(9));

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('Mae gennych 1 cymeriad yn weddill');
      });

      describe('when the character limit is exceeded', () => {
        beforeAll(async () => {
          // eslint-disable-next-line no-underscore-dangle
          browser = global.__BROWSER__;
          page = await browser.newPage();
        });

        afterAll(async () => {
          await page.close();
        });

        it('shows the number of characters over the limit', async () => {
          await goToExample();
          await page.type('.hmrc-js-character-count', 'A'.repeat(11));
          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('You have 1 character too many');
        });

        it('shows the number of characters over the limit in Welsh', async () => {
          await goToExample('default-welsh');
          await page.type('.hmrc-js-character-count', 'A'.repeat(11));
          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('Mae gennych 1 cymeriad yn ormod');
        });

        it('uses the plural when the limit is exceeded by 2 or more', async () => {
          await goToExample();
          await page.type('.hmrc-js-character-count', 'A'.repeat(11));
          await page.type('.hmrc-js-character-count', 'A');

          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('You have 2 characters too many');
        });

        it('uses the plural in Welsh when the limit is exceeded by 2 or more', async () => {
          await goToExample('default-welsh');
          await page.type('.hmrc-js-character-count', 'A'.repeat(11));
          await page.type('.hmrc-js-character-count', 'A');

          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('Mae gennych 2 o gymeriadau yn ormod');
        });

        it('adds error styles to the textarea', async () => {
          await goToExample();
          await page.type('.hmrc-js-character-count', 'A'.repeat(11));
          const textareaClasses = await page.$eval('.hmrc-js-character-count', (el) => el.className);
          expect(textareaClasses).toContain('govuk-textarea--error');
        });

        it('adds error styles to the count message', async () => {
          await goToExample();
          await page.type('.hmrc-js-character-count', 'A'.repeat(11));
          const messageClasses = await page.$eval('.hmrc-character-count__message', (el) => el.className);
          expect(messageClasses).toContain('govuk-error-message');
        });
      });

      describe('when the character limit is exceeded on page load', () => {
        beforeAll(async () => {
          // eslint-disable-next-line no-underscore-dangle
          browser = global.__BROWSER__;
          page = await browser.newPage();
        });

        afterAll(async () => {
          await page.close();
        });

        it('shows the number of characters over the limit', async () => {
          await goToExample('with-default-value-exceeding-limit');
          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('You have 23 characters too many');
        });

        it('shows the number of characters over the limit in Welsh', async () => {
          await goToExample('with-default-value-exceeding-limit-welsh');
          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('Mae gennych 23 o gymeriadau yn ormod');
        });

        it('adds error styles to the textarea', async () => {
          await goToExample('with-default-value-exceeding-limit');
          const textareaClasses = await page.$eval('.hmrc-js-character-count', (el) => el.className);
          expect(textareaClasses).toContain('govuk-textarea--error');
        });

        it('adds error styles to the count message', async () => {
          await goToExample('with-default-value-exceeding-limit');
          const messageClasses = await page.$eval('.hmrc-character-count__message', (el) => el.className);
          expect(messageClasses).toContain('govuk-error-message');
        });
      });

      describe('when a threshold is set', () => {
        beforeAll(async () => {
          // eslint-disable-next-line no-underscore-dangle
          browser = global.__BROWSER__;
          page = await browser.newPage();
          await goToExample('with-threshold');
        });

        afterAll(async () => {
          await page.close();
        });

        it('does not show the limit until the threshold is reached', async () => {
          const visibility = await page.$eval('.hmrc-character-count__message', (el) => window.getComputedStyle(el).visibility);
          expect(visibility).toEqual('hidden');

          // Ensure threshold is hidden for users of assistive technologies
          const ariaHidden = await page.$eval('.hmrc-character-count__message', (el) => el.getAttribute('aria-hidden'));
          expect(ariaHidden).toEqual('true');
        });

        it('becomes visible once the threshold is reached', async () => {
          await page.type('.hmrc-js-character-count', 'A'.repeat(8));

          const visibility = await page.$eval('.hmrc-character-count__message', (el) => window.getComputedStyle(el).visibility);
          expect(visibility).toEqual('visible');

          // Ensure threshold is visible for users of assistive technologies
          const ariaHidden = await page.$eval('.hmrc-character-count__message', (el) => el.getAttribute('aria-hidden'));
          expect(ariaHidden).toBeFalsy();
        });
      });

      describe('when the ID starts with a number', () => {
        beforeAll(async () => {
          // eslint-disable-next-line no-underscore-dangle
          browser = global.__BROWSER__;
          page = await browser.newPage();
        });

        afterAll(async () => {
          await page.close();
        });

        it('still works correctly', async () => {
          await goToExample('with-id-starting-with-number');

          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

          expect(message).toEqual('You have 10 characters remaining');
        });
      });
    });

    describe('when counting words', () => {
      beforeAll(async () => {
        // eslint-disable-next-line no-underscore-dangle
        browser = global.__BROWSER__;
        page = await browser.newPage();
      });

      afterAll(async () => {
        await page.close();
      });

      it('shows the dynamic message', async () => {
        await goToExample('with-word-count');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('You have 10 words remaining');
      });

      it('shows the dynamic message in Welsh', async () => {
        await goToExample('welsh-with-word-count');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('Mae gennych 10 o eiriau yn weddill');
      });

      it('counts down to the word limit', async () => {
        await goToExample('with-word-count');
        await page.type('.hmrc-js-character-count', 'Hello world');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('You have 8 words remaining');
      });

      it('counts down to the word limit in Welsh', async () => {
        await goToExample('welsh-with-word-count');
        await page.type('.hmrc-js-character-count', 'Hello world');

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('Mae gennych 8 o eiriau yn weddill');
      });

      it('uses the singular when there is only one word remaining', async () => {
        await goToExample('with-word-count');
        await page.type('.hmrc-js-character-count', 'Hello '.repeat(9));

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('You have 1 word remaining');
      });

      it('uses the singular in Welsh when there is only one word remaining', async () => {
        await goToExample('welsh-with-word-count');
        await page.type('.hmrc-js-character-count', 'Hello '.repeat(9));

        const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());

        expect(message).toEqual('Mae gennych 1 gair yn weddill');
      });

      describe('when the word limit is exceeded', () => {
        beforeAll(async () => {
          // eslint-disable-next-line no-underscore-dangle
          browser = global.__BROWSER__;
          page = await browser.newPage();
        });

        afterAll(async () => {
          await page.close();
        });

        it('shows the number of words over the limit', async () => {
          await goToExample('with-word-count');
          await page.type('.hmrc-js-character-count', 'Hello '.repeat(11));
          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('You have 1 word too many');
        });

        it('shows the number of words over the limit in Welsh', async () => {
          await goToExample('welsh-with-word-count');
          await page.type('.hmrc-js-character-count', 'Hello '.repeat(11));
          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('Mae gennych 1 gair yn ormod');
        });

        it('uses the plural when the limit is exceeded by 2 or more', async () => {
          await goToExample('with-word-count');
          await page.type('.hmrc-js-character-count', 'Hello '.repeat(11));
          await page.type('.hmrc-js-character-count', 'World');

          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('You have 2 words too many');
        });

        it('uses the plural in Welsh when the limit is exceeded by 2 or more', async () => {
          await goToExample('welsh-with-word-count');
          await page.type('.hmrc-js-character-count', 'Hello '.repeat(11));
          await page.type('.hmrc-js-character-count', 'World');

          const message = await page.$eval('.hmrc-character-count__message', (el) => el.innerHTML.trim());
          expect(message).toEqual('Mae gennych 2 o eiriau yn ormod');
        });

        it('adds error styles to the textarea', async () => {
          await goToExample('with-word-count');
          await page.type('.hmrc-js-character-count', 'Hello '.repeat(11));
          const textareaClasses = await page.$eval('.hmrc-js-character-count', (el) => el.className);
          expect(textareaClasses).toContain('govuk-textarea--error');
        });

        it('adds error styles to the count message', async () => {
          await goToExample('with-word-count');
          await page.type('.hmrc-js-character-count', 'Hello '.repeat(11));
          const messageClasses = await page.$eval('.hmrc-character-count__message', (el) => el.className);
          expect(messageClasses).toContain('govuk-error-message');
        });
      });
    });
  });
});
