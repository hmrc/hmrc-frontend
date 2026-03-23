/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('caseworker-banner');

describe('caseworker-banner', () => {
  describe('by default', () => {
    const params = examples.default;

    it('passes accessibility tests', async () => {
      const $ = render('caseworker-banner', params);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('should have the caseworker banner class', async () => {
      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner').hasClass('hmrc-caseworker-banner')).toBeTruthy();
    });

    it('should disable auto focus', async () => {
      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner').attr('data-disable-auto-focus')).toEqual('true');
    });

    it('should have a heading level 2', async () => {
      const $ = render('caseworker-banner', params);

      expect($('#govuk-notification-banner-title').get(0).tagName).toBe('h2');
    });

    it('should have the English title text', async () => {
      const $ = render('caseworker-banner', params);

      expect($('#govuk-notification-banner-title').text().trim()).toBe('Caseworker guidance');
    });
  });

  describe('with Welsh language', () => {
    it('shows the Welsh title', async () => {
      const params = examples.welsh;
      const hmrcCaseworkerBannerHtml = render('caseworker-banner', params)('.govuk-notification-banner__title').html().trim();

      expect(hmrcCaseworkerBannerHtml).toBe('Arweiniad Gweithiwr Achos');
    });
  });

  describe('with custom options', () => {
    it('has custom attributes', async () => {
      const params = examples.attributes;

      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner').attr('my-attribute')).toEqual('my-value');
    });

    it('has custom classes', async () => {
      const params = examples.classes;

      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner').hasClass('my-class')).toBeTruthy();
    });

    it('should have the caseworker banner class', async () => {
      const params = examples.classes;

      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner').hasClass('hmrc-caseworker-banner')).toBeTruthy();
    });

    it('renders content as escaped html when passed in as text', () => {
      const params = examples['html-as-text'];

      const $ = render('caseworker-banner', params);
      const $content = $('.govuk-notification-banner__content');

      expect($content.html().trim()).toEqual('<p class="govuk-body">&lt;span&gt;Some escaped content&lt;/span&gt;</p>');
    });

    it('has custom title id', async () => {
      const params = examples['title-id'];

      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner__title').attr('id')).toEqual('myId');
    });
  });

  describe('with non-overridable parameters', () => {
    const params = examples['non-overridable-params'];

    it('should disable auto focus', async () => {
      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner').attr('data-disable-auto-focus')).toEqual('true');
    });

    it('should have a set role attribute', async () => {
      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner').attr('role')).toBe('region');
    });

    it('should have a heading level 2', async () => {
      const $ = render('caseworker-banner', params);

      expect($('#govuk-notification-banner-title').get(0).tagName).toBe('h2');
    });

    it('should have the English title text', async () => {
      const $ = render('caseworker-banner', params);

      expect($('#govuk-notification-banner-title').text().trim()).toBe('Caseworker guidance');
    });

    it('should not have a success type class', async () => {
      const $ = render('caseworker-banner', params);

      expect($('.govuk-notification-banner').hasClass('govuk-notification-banner--success')).toBeFalsy();
    });
  });
});
