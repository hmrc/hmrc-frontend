/* eslint-env jest */

import axe from '../../../lib/axe-helper';
import { render, getExamples, htmlWithClassName } from '../../../lib/jest-helpers';

const examples = getExamples('accessible-autocomplete');

describe('Accessible autocomplete', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('accessible-autocomplete', examples.default);

      const results = await axe($.html(), {
        rules: {
          region: { enabled: false },
        },
      });
      expect(results)
        .toHaveNoViolations();
    });

    it('renders with id', () => {
      const $ = render('accessible-autocomplete', examples.default);

      const $component = $('select');
      expect($component.attr('id')).toEqual('location-picker');
    });

    it('renders with all required data attributes', () => {
      const $ = render('accessible-autocomplete', examples.default);

      const $component = $('select');
      expect($component.attr('data-module')).toEqual('hmrc-accessible-autocomplete');
      expect($component.attr('data-default-value')).toEqual('');
      expect($component.attr('data-auto-select')).toEqual('false');
      expect($component.attr('data-show-all-values')).toEqual('false');
      expect($component.attr('data-show-all-values')).toBeTruthy();
    });

    it('renders with a form group wrapper', () => {
      const $ = render('accessible-autocomplete', examples.default);

      const $formGroup = $('.govuk-form-group');
      expect($formGroup.length).toBeTruthy();
    });
  });

  describe('when it includes a hint', () => {
    it('renders the hint', () => {
      const $ = render('accessible-autocomplete', examples['with-label-and-hint']);

      expect(htmlWithClassName($, '.govuk-hint')).toMatchSnapshot();
    });
  });

  describe('when it includes an error message', () => {
    it('renders the error message', () => {
      const $ = render('accessible-autocomplete', examples['with-label-and-hint-and-error']);

      expect(htmlWithClassName($, '.govuk-error-message')).toMatchSnapshot();
    });

    it('renders with a form group wrapper that has an error state', () => {
      const $ = render('accessible-autocomplete', examples['with-label-and-hint-and-error']);

      const $formGroup = $('.govuk-form-group');
      expect($formGroup.hasClass('govuk-form-group--error')).toBeTruthy();
    });
  });

  describe('with dependant components', () => {
    it('renders with label', () => {
      const $ = render('accessible-autocomplete', examples['with-label-and-hint']);

      expect(htmlWithClassName($, '.govuk-label')).toMatchSnapshot();
    });
  });
});
