/* eslint-env jest */

const axe = require('../../../lib/axe-helper');

const { render, getExamples } = require('../../../lib/jest-helpers');

const examples = getExamples('language-select');

describe('New Tab Link', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('language-select', examples.default);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders an English element as text and Welsh as a link', () => {
      const $ = render('language-select', examples.default);

      const $component = $('.govuk-link');
      expect($component.length).toEqual(1);
      expect($component.get(0).tagName).toEqual('a');
      expect($component.attr('target')).toEqual(undefined);
      expect($component.attr('hreflang')).toEqual('cy');
      expect($component.attr('lang')).toEqual('cy');
      expect($component.attr('href')).toEqual(examples.default.cy.href);
      expect($component.data('journeyClick')).toEqual('link - click:lang-select:Cymraeg');

      expect($component.find('.govuk-visually-hidden').eq(0).text()).toEqual('Newid yr iaith ir Gymraeg');
      expect($component.find('[aria-hidden="true"]').eq(0).text()).toEqual('Cymraeg');
      expect($.text().trim().replace(/[\s,\n]+/g, ' ')).toEqual('English Newid yr iaith ir Gymraeg Cymraeg');

      expect($('.hmrc-language-select__list-item').find('[aria-current="true"]').eq(0).text()).toEqual('English');
    });

    it('renders a Welsh element as text and English as a link', () => {
      const $ = render('language-select', examples.welsh);

      const $component = $('.govuk-link');
      expect($component.length).toEqual(1);
      expect($component.get(0).tagName).toEqual('a');
      expect($component.attr('target')).toEqual(undefined);
      expect($component.attr('hreflang')).toEqual('en');
      expect($component.attr('lang')).toEqual('en');
      expect($component.attr('href')).toEqual(examples.welsh.en.href);
      expect($component.data('journeyClick')).toEqual('link - click:lang-select:English');

      expect($component.find('.govuk-visually-hidden').eq(0).text()).toEqual('Change the language to English');
      expect($component.find('[aria-hidden="true"]').eq(0).text()).toEqual('English');
      expect($.text().trim().replace(/[\s,\n]+/g, ' ')).toEqual('Change the language to English English Cymraeg');

      expect($('.hmrc-language-select__list-item').find('[aria-current="true"]').eq(0).text()).toEqual('Cymraeg');
    });
  });
});
