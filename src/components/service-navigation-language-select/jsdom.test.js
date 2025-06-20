/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('service-navigation-language-select');

describe('Service Navigation Language Select', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('service-navigation-language-select', examples.default);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders an English element as text and Welsh as a link', () => {
      const $ = render('service-navigation-language-select', examples.default);

      const $component = $('.govuk-link');
      expect($component.length).toEqual(1);
      expect($component.get(0).tagName).toEqual('a');
      expect($component.attr('target')).toEqual(undefined);
      expect($component.attr('hreflang')).toEqual('cy');
      expect($component.attr('lang')).toEqual('cy');
      expect($component.attr('href')).toEqual(examples.default.cy.href);
      expect($component.data('journeyClick')).toEqual('link - click:lang-select:Cymraeg');

      expect($component.find('.govuk-visually-hidden').eq(0).text()).toEqual('Newid yr iaith ir Gymraeg');
      expect($component.find('[aria-hidden="true"]').eq(0).text()).toEqual('CYM');
      expect($.text().trim().replace(/[\s,\n]+/g, ' ')).toEqual('ENG Newid yr iaith ir Gymraeg CYM');

      expect($('.hmrc-service-navigation-language-select__list-item').find('[aria-current="true"]').eq(0).text()).toEqual('ENG');
    });

    it('renders a Welsh element as text and English as a link', () => {
      const $ = render('service-navigation-language-select', examples.welsh);

      const $component = $('.govuk-link');
      expect($component.length).toEqual(1);
      expect($component.get(0).tagName).toEqual('a');
      expect($component.attr('target')).toEqual(undefined);
      expect($component.attr('hreflang')).toEqual('en');
      expect($component.attr('lang')).toEqual('en');
      expect($component.attr('href')).toEqual(examples.welsh.en.href);
      expect($component.data('journeyClick')).toEqual('link - click:lang-select:English');

      expect($component.find('.govuk-visually-hidden').eq(0).text()).toEqual('Change the language to English');
      expect($component.find('[aria-hidden="true"]').eq(0).text()).toEqual('ENG');
      expect($.text().trim().replace(/[\s,\n]+/g, ' ')).toEqual('Change the language to English ENG CYM');

      expect($('.hmrc-service-navigation-language-select__list-item').find('[aria-current="true"]').eq(0).text()).toEqual('CYM');
    });
  });
});
