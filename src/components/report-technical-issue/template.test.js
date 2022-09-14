/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('report-technical-issue');

describe('Report Technical Issue', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('report-technical-issue', examples.default);

      const results = await axe($.html(), {
        rules: {
          region: { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('renders a link element', () => {
      const $ = render('report-technical-issue', examples.default);

      const $component = $('.govuk-link');
      expect($component.get(0).tagName).toEqual('a');
      expect($component.attr('target')).toEqual('_blank');
      expect($component.attr('hreflang')).toEqual('en');
      expect($component.attr('lang')).toEqual('en');
      expect($component.attr('href')).toEqual('/contact/report-technical-problem?newTab=true&service=the-url-safe-service-id');
      expect($component.text()).toEqual('Is this page not working properly? (opens in new tab)');
    });
  });

  it('renders a link element when nothing is provided', () => {
    const $ = render('report-technical-issue', {});

    const $component = $('.govuk-link');
    expect($component.get(0).tagName).toEqual('a');
    expect($component.attr('target')).toEqual('_blank');
    expect($component.attr('hreflang')).toEqual('en');
    expect($component.attr('lang')).toEqual('en');
    expect($component.attr('href')).toEqual('/contact/report-technical-problem?newTab=true');
    expect($component.text()).toEqual('Is this page not working properly? (opens in new tab)');
  });

  it('supports the deprecated serviceCode parameter', () => {
    const $ = render('report-technical-issue', examples['with-deprecated-service-code']);

    const $component = $('.govuk-link');
    expect($component.attr('href')).toEqual('/contact/report-technical-problem?newTab=true&service=the-url-safe-service-code');
  });

  it('uses the serviceId if serviceId and serviceCode are supplied', () => {
    const $ = render('report-technical-issue', examples['with-service-id-and-service-code']);

    const $component = $('.govuk-link');
    expect($component.attr('href')).toEqual('/contact/report-technical-problem?newTab=true&service=the-url-safe-service-id');
  });

  it('renders link with custom classes', () => {
    const $ = render('report-technical-issue', examples['with-classes']);

    const $component = $('.govuk-link');

    expect($component.attr('class')).toEqual('govuk-link hmrc-report-technical-issue govuk-!-font-weight-bold my-custom-class');
  });

  it('should display in welsh', () => {
    const $ = render('report-technical-issue', examples.welsh);

    const $component = $('.govuk-link');

    expect($component.attr('hreflang')).toEqual('cy');
    expect($component.attr('lang')).toEqual('cy');
    expect($component.text()).toEqual('A yw’r dudalen hon yn gweithio’n iawn? (yn agor mewn tab newydd)');
  });

  it('should default to no Base URL', () => {
    const $ = render('report-technical-issue', examples['with-local-base-url']);

    expect($('.govuk-link').attr('href')).toEqual('http://localhost:9250/contact/report-technical-problem?newTab=true&service=my-local-service');
  });

  it('should default to no Base URL', () => {
    const $ = render('report-technical-issue', examples['with-production-base-url']);

    expect($('.govuk-link').attr('href')).toEqual('https://www.tax.service.gov.uk/contact/report-technical-problem?newTab=true&service=my-production-service');
  });

  it('should default to no Base URL', () => {
    const $ = render('report-technical-issue', examples['with-no-base-url']);

    expect($('.govuk-link').attr('href')).toEqual('/contact/report-technical-problem?newTab=true&service=my-generic-service');
  });

  it('should URL encode the service identifier', () => {
    const $ = render('report-technical-issue', examples['with-non-url-safe-service-id']);

    expect($('.govuk-link').attr('href')).toEqual('/contact/report-technical-problem?newTab=true&service=Build%20%26%20Deploy');
  });

  it('should URL encode the referrer url', () => {
    const $ = render('report-technical-issue', examples['with-referrer-url']);

    expect($('.govuk-link').attr('href')).toEqual('/contact/report-technical-problem?newTab=true&service=pay&referrerUrl=https%3A%2F%2Fwww.tax.service.gov.uk%2Fpay%3Fabc%3Ddef');
  });

  it('should URL encode the local referrer url', () => {
    const $ = render('report-technical-issue', examples['with-local-referrer-url']);

    expect($('.govuk-link').attr('href')).toEqual('/contact/report-technical-problem?newTab=true&service=pay&referrerUrl=http%3A%2F%2Flocalhost%3A9123%2Fmy-service');
  });

  it('should include a rel="noreferrer noopener" attribute if the referrerUrl is explicitly passed', () => {
    const $ = render('report-technical-issue', examples['with-local-referrer-url']);

    const $component = $('.govuk-link');
    expect($component.attr('rel')).toEqual('noreferrer noopener');
  });

  it('should not include a rel="noreferrer noopener" attribute if the referrerUrl is not explicitly passed', () => {
    const $ = render('report-technical-issue', examples.default);

    const $component = $('.govuk-link');
    expect($component.attr('rel')).toBeFalsy();
  });
});
