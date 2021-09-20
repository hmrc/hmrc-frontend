/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import { render, getExamples } from '../../../lib/jest-helpers';

const axe = require('../../../lib/axe-helper');

const examples = getExamples('list-with-actions');

describe('List with actions', () => {
  describe('default example', () => {
    it('passes accessibility tests', async () => {
      const $ = render('list-with-actions', examples.default);

      const results = await axe($.html(), {
        rules: {
          region: { enabled: false },
          // In newer versions of the HTML specification wrapper
          // <div>s are allowed in a definition list
          dlitem: { enabled: false },
          'definition-list': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe('custom options', () => {
    it('renders classes', async () => {
      const $ = render('list-with-actions', examples['custom class']);

      const $component = $('.hmrc-list-with-actions');
      expect($component.hasClass('app-custom-class')).toBeTruthy();
    });

    it('renders with attributes', () => {
      const $ = render('list-with-actions', examples.attributes);

      const $component = $('.hmrc-list-with-actions');
      expect($component.attr('data-attribute-1')).toEqual('value-1');
      expect($component.attr('data-attribute-2')).toEqual('value-2');
    });
  });

  describe('items', () => {
    describe('name', () => {
      it('renders text', async () => {
        const $ = render('list-with-actions', examples.default);

        const $component = $('.hmrc-list-with-actions');
        const $name = $component.find('.hmrc-list-with-actions__item:first-child .hmrc-list-with-actions__name');

        expect($name.html().trim()).toBe('Sydney Russell');
      });

      it('renders html', async () => {
        const $ = render('list-with-actions', examples['name with html']);

        const $component = $('.hmrc-list-with-actions');
        const $name = $component.find('dt.hmrc-list-with-actions__name');

        expect($name.html().trim()).toBe('<span>email@email.com</span>');
      });
    });

    describe('actions', () => {
      it('renders href', async () => {
        const $ = render('list-with-actions', examples['actions href']);

        const $component = $('.hmrc-list-with-actions');
        const $actionLink = $component.find('.hmrc-list-with-actions__action > a');

        expect($actionLink.attr('href')).toBe('https://www.gov.uk');
      });

      it('renders text', async () => {
        const $ = render('list-with-actions', examples['with actions']);

        const $component = $('.hmrc-list-with-actions');
        const $actionLink = $component.find('.hmrc-list-with-actions__item:last-child .hmrc-list-with-actions__action:last-child span[aria-hidden]');

        expect($actionLink.text().trim()).toBe('Change');
      });

      it('renders html', async () => {
        const $ = render('list-with-actions', examples['actions with html']);

        const $component = $('.hmrc-list-with-actions');
        const $actionLink = $component.find('.hmrc-list-with-actions__action > a');

        expect($actionLink.html().trim()).toBe('Edit<span class="visually-hidden"> name</span>');
      });

      it('renders custom accessible name', async () => {
        const $ = render('list-with-actions', examples['with actions']);

        const $component = $('.hmrc-list-with-actions');
        const $actionLink = $component.find('.hmrc-list-with-actions__item:last-child .hmrc-list-with-actions__action:last-child span.govuk-visually-hidden');
        expect($actionLink.text().trim()).toBe('Change Pears');
      });

      it('renders attributes', async () => {
        const $ = render('list-with-actions', examples['actions with attributes']);

        const $component = $('.hmrc-list-with-actions');
        const $actionLink = $component.find('.hmrc-list-with-actions__action > a');

        expect($actionLink.attr('data-test-attribute')).toEqual('value');
        expect($actionLink.attr('data-test-attribute-2')).toEqual('value-2');
      });

      it('renders classes', async () => {
        const $ = render('list-with-actions', examples['actions with classes']);

        const $component = $('.hmrc-list-with-actions');
        const $action = $component.find('.hmrc-list-with-actions__action > a');

        expect($action.hasClass('govuk-link--no-visited-state')).toBeTruthy();
      });

      it('renders multiple', async () => {
        const $ = render('list-with-actions', examples.default);

        const $component = $('.hmrc-list-with-actions');
        const $item = $component.find('.hmrc-list-with-actions__item:last-child');
        const $actions = $item.find('.hmrc-list-with-actions__action > a > span[aria-hidden]');

        expect($actions.length).toBe(2);
        expect($actions.eq(0).text()).toBe('Change');
        expect($actions.eq(1).text()).toBe('Remove');
      });
    });
  });

  describe('empty list', () => {
    it('renders no content', async () => {
      const $ = render('list-with-actions', examples['empty list']);

      const $component = $('.hmrc-list-with-actions');

      expect($component).toHaveLength(0);
    });
  });
});
