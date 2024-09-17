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

    it('renders a header element with custom classes', () => {
      const $ = render('page-heading', examples['header-with-custom-css']);

      const $component = $('.hmrc-page-heading');

      expect($component.get(0).tagName).toEqual('header');
      expect($component.hasClass('hmrc-page-heading--with-margin')).toBeTruthy();
    });

    it('renders a header element with a single heading and custom headingClasses', () => {
      const $ = render('page-heading', examples['with-custom-heading-css']);

      const $component = $('.hmrc-page-heading');

      expect($component.get(0).tagName).toEqual('header');
      expect($component.children().length).toEqual(1);
      expect($component.children().get(0).tagName).toEqual('h1');
      expect($component.find('h1').text().trim()).toEqual(examples['with-custom-heading-css'].text);
      expect($component.find('h1').hasClass('custom-heading-css')).toBeTruthy();
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
      expect($component.find('p').text().trim()).toEqual('This section is Personal details');
      expect($component.find('span.govuk-visually-hidden').text()).toEqual('This section is ');
    });

    it('renders a header with a section subheading in welsh', () => {
      const $ = render('page-heading', examples['with-section-welsh']);

      const $component = $('.hmrc-page-heading');

      expect($component.children().length).toEqual(2);
      expect($component.children().get(1).tagName).toEqual('p');
      expect($component.find('p').text().trim()).toEqual('Teitl yr adran hon yw Manylion personol');
      expect($component.find('span.govuk-visually-hidden').text()).toEqual('Teitl yr adran hon yw ');
    });

    it('renders a header with section subheading and custom captionClasses', () => {
      const $ = render('page-heading', examples['with-section-and-custom-caption-css']);

      const $component = $('.hmrc-page-heading');

      expect($component.children().length).toEqual(2);
      expect($component.children().get(1).tagName).toEqual('p');
      expect($component.find('p').text().trim()).toEqual('This section is Personal details');
      expect($component.find('p').hasClass('custom-caption-css')).toBeTruthy();
      expect($component.find('span.govuk-visually-hidden').text()).toEqual('This section is ');
    });
  });
});
