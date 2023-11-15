/* eslint-env jest */

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
  });

  describe('with Welsh language specified', () => {
    it('should have the Welsh text', () => {
      const $ = render('internal-header', examples.welsh);
      const $logoLink = $('.hmrc-internal-header__logo-link');

      expect($logoLink.text().trim()).toEqual('Cyllid a Thollau EF');
    });
  });

  describe('With a Service Name', () => {
    it('renders a service name', () => {
      const $ = render('internal-header', examples['with-service-name']);
      const $serviceNameLink = $('.hmrc-internal-header__link');

      expect($serviceNameLink.text().trim()).toBe('Service Name');
      expect($serviceNameLink.attr('href')).toBe('/components/internal-header/with-service-name/preview');
    });
  });
});
