/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('header');

describe('header', () => {
  function withoutHmrcHeaderClasses(text) {
    return (text || '').trim().replace(/ hmrc-header__[a-z-]+/g, '');
  }

  it('should match the inner html output of govuk header when none of the hmrc specific params are passed', async () => {
    const params = examples['with params common to govuk header'];
    const hmrcHeaderHtml = render('header', params)('.govuk-header').html().trim();
    const govukHeaderHtml = render('govuk/components/header', params)('.govuk-header').html().trim();
    expect(withoutHmrcHeaderClasses(hmrcHeaderHtml)).toEqual(govukHeaderHtml);
  });

  it('renders headerAttributes correctly', () => {
    const $ = render('header', examples['with header attributes']);

    const $component = $('.govuk-template__header');
    expect($component.attr('data-test-header-attribute')).toEqual('value');
    expect($component.attr('data-test-header-attribute-2')).toEqual('value-2');
  });

  it('renders headerClasses correctly', () => {
    const $ = render('header', examples['with header classes']);

    const $component = $('.govuk-template__header');
    expect($component.hasClass('app-header-wrapper--custom-modifier')).toBeTruthy();
  });

  it('renders classes', () => {
    const $ = render('header', {
      classes: 'app-header--custom-modifier',
    });

    const $component = $('.govuk-header');
    expect($component.hasClass('app-header--custom-modifier')).toBeTruthy();
  });

  it('passes accessibility tests', async () => {
    const $ = render('header', examples.default);

    const results = await axe($.html());
    expect(results).toHaveNoViolations();
  });

  it('renders custom container classes', () => {
    const $ = render('header', {
      containerClasses: 'app-width-container',
    });

    const $component = $('.govuk-header');
    const $container = $component.find('.govuk-header__container');

    expect($container.hasClass('app-width-container')).toBeTruthy();
  });

  it('renders home page URL', () => {
    const $ = render('header', {
      homepageUrl: '/',
    });

    const $component = $('.govuk-header');
    const $homepageLink = $component.find('.govuk-header__homepage-link');
    expect($homepageLink.attr('href')).toEqual('/');
  });

  describe('with product name', () => {
    it('renders product name', () => {
      const $ = render('header', examples['full width']);

      const $component = $('.govuk-header');
      const $productName = $component.find('.govuk-header__product-name');
      expect($productName.text().trim()).toEqual('Product Name');
    });
  });

  // TODO add tests for sign-out-links

  describe('HMRC banner', () => {
    it('passes accessibility tests when including the banner', async () => {
      const $ = render('header', examples['with hmrc banner english']);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });
    it('should have English text by default', () => {
      const $ = render('banner', examples['with hmrc banner english']);
      expect($('.hmrc-banner > .hmrc-organisation-logo > p.govuk-body-s').text().trim()).toEqual('HM Revenue & Customs');
    });
    it('should have Welsh text when specified', () => {
      const $ = render('banner', examples['with hmrc banner welsh']);
      expect($('.hmrc-banner > .hmrc-organisation-logo > p.govuk-body-s').text().trim()).toEqual('Cyllid a Thollau EF');
    });
  });

  describe('additional banners block', () => {
    it('renders correctly in the right place when passed html', () => {
      const $ = render('header', examples['with additional banner']);
      expect($('header > :last-child').prop('outerHTML')).toEqual('<div class="custom-banner govuk-body">for example an attorney banner</div>');
    });
  });
});
