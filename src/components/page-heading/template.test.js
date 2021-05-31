/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('page-heading');

describe('Page Heading', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-heading', examples.default);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders a header element with a single heading', () => {
      const $ = render('page-heading', examples.default);

      const $component = $('.hmrc-page-heading');

      expect($component.get(0).tagName).toEqual('header');
      expect($component.children().length).toEqual(1);
      expect($component.children().get(0).tagName).toEqual('h1');
      expect($component.find('h1').text().trim()).toEqual(examples.default.text);
    });
  });

  describe('with legend as heading', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-heading', examples.default);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders a header element with a legend as page heading', () => {
      const $ = render('page-heading', examples['legend-as-heading']);

      const $component = $('.hmrc-page-heading');

      expect($component.get(0).tagName).toEqual('header');
      expect($component.children().length).toEqual(1);
      expect($component.children().get(0).tagName).toEqual('legend');
      expect($component.find('legend').children().get(0).tagName).toEqual('h1');
      expect($component.find('legend').text().trim()).toEqual(examples['legend-as-heading'].text);
    });
  });

  describe('with label as heading', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-heading', examples.default);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders a header element with a label as page heading', () => {
      const $ = render('page-heading', examples['label-as-heading']);

      const $component = $('.hmrc-page-heading');

      expect($component.get(0).tagName).toEqual('header');
      expect($component.children().length).toEqual(1);
      expect($component.children().get(0).tagName).toEqual('h1');
      expect($component.find('h1').children().get(0).tagName).toEqual('label');
      expect($component.find('label').text().trim()).toEqual(examples['label-as-heading'].label.text);
    });
  });

  describe('with section', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-heading', examples['with-section']);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders a header with a section subheading', () => {
      const $ = render('page-heading', examples['with-section']);

      const $component = $('.hmrc-page-heading');

      expect($component.children().length).toEqual(2);
      expect($component.children().get(1).tagName).toEqual('p');
      expect($component.find('span[aria-hidden="true"]').text()).toEqual(examples['with-section'].section);
      expect($component.find('span.govuk-visually-hidden').text()).toEqual(examples['with-section'].context);
    });
  });

  describe('with section and legend or label', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-heading', examples['with-section-and-legend']);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders a header with a single heading and a section subheading', () => {
      const $ = render('page-heading', examples['with-section-and-legend']);

      const $component = $('.hmrc-page-heading');

      expect($component.children().length).toEqual(2);
      expect($component.children().get(1).tagName).toEqual('p');
      expect($component.find('span[aria-hidden="true"]').text()).toEqual(examples['with-section-and-legend'].section);
      expect($component.find('span.govuk-visually-hidden').text()).toEqual(examples['with-section-and-legend'].context);
    });
  });
});
