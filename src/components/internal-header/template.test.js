/* eslint-env jest */

const { render, getExamples } = require('../../../lib/jest-helpers');

const examples = getExamples('internal-header');

describe('Internal Header', () => {
  describe('by default', () => {
    it('does not render a service name', () => {
      const $ = render('internal-header', examples.default);
      const $serviceName = $('.hmrc-internal-service-name');

      expect($serviceName.html()).toBeNull();
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
