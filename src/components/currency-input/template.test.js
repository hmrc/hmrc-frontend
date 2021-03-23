/* eslint-env jest */

import axe from '../../../lib/axe-helper';
import { render, getExamples, htmlWithClassName } from '../../../lib/jest-helpers';

const examples = getExamples('currency-input');

const WORD_BOUND = '\\b';
const WHITESPACE = '\\s';

describe('Currency input', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('currency-input', examples.default);

      const results = await axe($.html(), {
        rules: {
          region: { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('renders with classes', () => {
      const $ = render('currency-input', {
        classes: 'app-input--custom-modifier',
      });

      const $component = $('.govuk-input');
      expect($component.hasClass('app-input--custom-modifier')).toBeTruthy();
    });

    it('renders with id', () => {
      const $ = render('currency-input', {
        id: 'my-input-id',
      });

      const $component = $('.govuk-input');
      expect($component.attr('id')).toEqual('my-input-id');
    });

    it('renders with name', () => {
      const $ = render('currency-input', {
        name: 'my-input-name',
      });

      const $component = $('.govuk-input');
      expect($component.attr('name')).toEqual('my-input-name');
    });

    it('renders with value', () => {
      const $ = render('currency-input', {
        value: '10.21',
      });

      const $component = $('.govuk-input');
      expect($component.val()).toEqual('10.21');
    });

    it('renders with aria-describedby', () => {
      const describedById = 'some-id';

      const $ = render('currency-input', {
        describedBy: describedById,
      });

      const $component = $('.govuk-input');
      expect($component.attr('aria-describedby')).toMatch(describedById);
    });

    it('renders with attributes', () => {
      const $ = render('currency-input', {
        attributes: {
          'data-attribute': 'my data value',
        },
      });

      const $component = $('.govuk-input');
      expect($component.attr('data-attribute')).toEqual('my data value');
    });

    it('renders with a form group wrapper', () => {
      const $ = render('currency-input', examples.default);

      const $formGroup = $('.govuk-form-group');
      expect($formGroup.length).toBeTruthy();
    });

    it('renders with a form group wrapper that has extra classes', () => {
      const $ = render('currency-input', {
        formGroup: {
          classes: 'extra-class',
        },
      });

      const $formGroup = $('.govuk-form-group');
      expect($formGroup.hasClass('extra-class')).toBeTruthy();
    });
  });

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('currency-input', {
        id: 'input-with-hint',
        hint: {
          text: 'Enter the amount in pounds and pence, for example £30.00 or £50.99',
        },
      });

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot();
    });

    it('associates the input as "described by" the hint', () => {
      const $ = render('currency-input', {
        id: 'input-with-hint',
        hint: {
          text: 'Enter the amount in pounds and pence, for example £30.00 or £50.99',
        },
      });

      const $input = $('.govuk-input');
      const $hint = $('.govuk-hint');

      const hintId = new RegExp(
        WORD_BOUND + $hint.attr('id') + WORD_BOUND,
      );

      expect($input.attr('aria-describedby')).toMatch(hintId);
    });

    it('associates the input as "described by" the hint and parent fieldset', () => {
      const describedById = 'some-id';

      const $ = render('currency-input', {
        id: 'input-with-hint',
        describedBy: describedById,
        hint: {
          text: 'Enter the amount in pounds and pence, for example £30.00 or £50.99',
        },
      });

      const $input = $('.govuk-input');
      const $hint = $('.govuk-hint');

      const hintId = new RegExp(
        WORD_BOUND + describedById + WHITESPACE + $hint.attr('id') + WORD_BOUND,
      );

      expect($input.attr('aria-describedby')).toMatch(hintId);
    });
  });

  describe('when it includes an error message', () => {
    it('renders the error message', () => {
      const $ = render('currency-input', {
        id: 'input-with-error',
        errorMessage: {
          text: 'Error message',
        },
      });

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot();
    });

    it('associates the input as "described by" the error message', () => {
      const $ = render('currency-input', {
        id: 'input-with-error',
        errorMessage: {
          text: 'Error message',
        },
      });

      const $input = $('.govuk-input');
      const $errorMessage = $('.govuk-error-message');

      const errorMessageId = new RegExp(
        WORD_BOUND + $errorMessage.attr('id') + WORD_BOUND,
      );

      expect($input.attr('aria-describedby')).toMatch(errorMessageId);
    });

    it('associates the input as "described by" the error message and parent fieldset', () => {
      const describedById = 'some-id';

      const $ = render('currency-input', {
        id: 'input-with-error',
        describedBy: describedById,
        errorMessage: {
          text: 'Error message',
        },
      });

      const $input = $('.govuk-input');
      const $errorMessage = $('.govuk-error-message');

      const errorMessageId = new RegExp(
        WORD_BOUND + describedById + WHITESPACE + $errorMessage.attr('id') + WORD_BOUND,
      );

      expect($input.attr('aria-describedby')).toMatch(errorMessageId);
    });

    it('includes the error class on the input', () => {
      const $ = render('currency-input', {
        errorMessage: {
          text: 'Error message',
        },
      });

      const $component = $('.govuk-input');
      expect($component.hasClass('govuk-input--error')).toBeTruthy();
    });

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('currency-input', {
        errorMessage: {
          text: 'Error message',
        },
      });

      const $formGroup = $('.govuk-form-group');
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy();
    });
  });

  describe('when it includes both a hint and an error message', () => {
    it('associates the input as described by both the hint and the error message', () => {
      const $ = render('currency-input', {
        errorMessage: {
          text: 'Error message',
        },
        hint: {
          text: 'Hint',
        },
      });

      const $component = $('.govuk-input');
      const errorMessageId = $('.govuk-error-message').attr('id');
      const hintId = $('.govuk-hint').attr('id');

      const combinedIds = new RegExp(
        WORD_BOUND + hintId + WHITESPACE + errorMessageId + WORD_BOUND,
      );

      expect($component.attr('aria-describedby')).toMatch(combinedIds);
    });

    it('associates the input as described by the hint, error message and parent fieldset', () => {
      const describedById = 'some-id';

      const $ = render('currency-input', {
        describedBy: describedById,
        errorMessage: {
          text: 'Error message',
        },
        hint: {
          text: 'Hint',
        },
      });

      const $component = $('.govuk-input');
      const errorMessageId = $('.govuk-error-message').attr('id');
      const hintId = $('.govuk-hint').attr('id');

      const combinedIds = new RegExp(
        WORD_BOUND + describedById + WHITESPACE
        + hintId + WHITESPACE + errorMessageId + WORD_BOUND,
      );

      expect($component.attr('aria-describedby')).toMatch(combinedIds);
    });
  });

  describe('with dependant components', () => {
    it('have correct nesting order', () => {
      const $ = render('currency-input', {
        id: 'my-input',
        label: {
          text: 'National Insurance number',
        },
      });

      const $component = $('.govuk-form-group > .hmrc-currency-input__wrapper > .govuk-input');
      expect($component.length).toBeTruthy();
    });

    it('renders with label', () => {
      const $ = render('currency-input', {
        id: 'my-input',
        label: {
          text: 'National Insurance number',
        },
      });

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot();
    });

    it('renders label with "for" attribute reffering the input "id"', () => {
      const $ = render('currency-input', {
        id: 'my-input',
        label: {
          text: 'National Insurance number',
        },
      });

      const $label = $('.govuk-label');
      expect($label.attr('for')).toEqual('my-input');
    });
  });

  describe('when it includes an autocomplete attribute', () => {
    it('renders the autocomplete attribute', () => {
      const $ = render('currency-input', {
        id: 'input-with-autocomplete',
        autocomplete: 'transaction-amount',
      });

      const $component = $('.govuk-input');
      expect($component.attr('autocomplete')).toEqual('transaction-amount');
    });
  });
});
