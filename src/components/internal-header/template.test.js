/* eslint-env jest */

/* eslint-disable max-len */

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('internal-header');

describe('Internal Header', () => {
  describe('by default', () => {
    it('does not render a service name', () => {
      const $ = render('internal-header', examples.default);
      const $serviceName = $('.hmrc-internal-service-name');

      expect($serviceName.html()).toBeNull();
    });

    it('should have the English text', () => {
      const $ = render('internal-header', examples.default);
      const $logoLink = $('.hmrc-internal-header__logo-link');

      expect($logoLink.text().trim()).toEqual('HM Revenue & Customs');
    });

    it('should have Tudor Crown logo ', () => {
      const $ = render('internal-header', examples.default);

      expect($('.hmrc-internal-header__logo-link > svg').html().trim()).toContain('<path class="cls-1" d="m28.5,16.6c');
    });

    it('renders custom container classes', () => {
      const $ = render('internal-header', {
        containerClasses: 'app-width-container',
      });

      const $component = $('.hmrc-internal-header');
      const $container = $component.find('.govuk-width-container');

      expect($container.hasClass('app-width-container')).toBeTruthy();
    });
  });

  describe('with Welsh language specified', () => {
    it('should have the Welsh text', () => {
      const $ = render('internal-header', examples.welsh);
      const $logoLink = $('.hmrc-internal-header__logo-link');

      expect($logoLink.text().trim()).toEqual('Cyllid a Thollau EF');
    });
  });

  describe('with St Edwards Crown logo specified', () => {
    it('should have the correct SVG', () => {
      const $ = render('internal-header', examples['with-st-edwards-crown']);

      expect($('.hmrc-internal-header__logo-link > svg').html().trim()).toContain('<path d="M104.32,73.72,101,73.29c');
    });
  });

  describe('With a Service Name and service URL', () => {
    it('renders a service name with a link', () => {
      const $ = render('internal-header', examples['with-service-name']);
      const $serviceNameLink = $('.hmrc-internal-header__service-name a');

      expect($serviceNameLink.text().trim()).toBe('Service Name');
      expect($serviceNameLink.attr('href')).toBe('/components/internal-header/with-service-name/preview');
    });
  });

  describe('With a Service Name and no service URL', () => {
    it('renders a service name without a link', () => {
      const $ = render('internal-header', examples['with-service-name-and-no-service-url']);
      const $serviceName = $('.hmrc-internal-header__service-name');

      expect($serviceName.text().trim()).toBe('Service Name');
      expect($serviceName.find('a').length).toBe(0);
    });
  });
});
