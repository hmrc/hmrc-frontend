/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('header');

describe('header', () => {
  it('passes accessibility tests', async () => {
    const $ = render('header', examples.default);

    const results = await axe($.html());
    expect(results).toHaveNoViolations();
  });

  it('has a role of `banner`', () => {
    const $ = render('header', {});

    const $component = $('header');
    expect($component.attr('role')).toEqual('banner');
  });

  it('renders attributes correctly', () => {
    const $ = render('header', {
      attributes: {
        'data-test-attribute': 'value',
        'data-test-attribute-2': 'value-2',
      },
    });

    const $component = $('.govuk-header');
    expect($component.attr('data-test-attribute')).toEqual('value');
    expect($component.attr('data-test-attribute-2')).toEqual('value-2');
  });

  it('renders classes', () => {
    const $ = render('header', {
      classes: 'app-header--custom-modifier',
    });

    const $component = $('.govuk-header');
    expect($component.hasClass('app-header--custom-modifier')).toBeTruthy();
  });

  it('renders custom container classes', () => {
    const $ = render('header', {
      containerClasses: 'app-width-container',
    });

    const $component = $('.govuk-header');
    const $container = $component.find('.govuk-header__container');

    expect($container.hasClass('app-width-container')).toBeTruthy();
  });

  it('button for showing and hiding menu should contain hidden attribute', () => {
    const $ = render('header', examples['navigation item with html']);

    const $component = $('.govuk-header__menu-button');

    expect($component.attr('hidden')).toBeTruthy();
  });

  it('renders home page URL', () => {
    const $ = render('header', {
      homepageUrl: '/',
    });

    const $component = $('.govuk-header');
    const $homepageLink = $component.find('.govuk-header__link--homepage');
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

  describe('with service name', () => {
    it('renders service name', () => {
      const $ = render('header', examples['with service name']);

      const $component = $('.govuk-header');
      const $serviceName = $component.find('.hmrc-header__service-name');
      expect($serviceName.hasClass('hmrc-header__service-name--linked')).toBeTruthy();
      expect($serviceName.text().trim()).toEqual('Service Name');
    });

    it('renders service name as a span when no url is specified', () => {
      const $ = render('header', examples['with service name but no service link']);

      const $component = $('.govuk-header');
      const $serviceName = $component.find('.hmrc-header__service-name');
      expect($serviceName[0].tagName).toEqual('span');
    });

    it('renders service name without the linked modifier when no url is specified', () => {
      const $ = render('header', examples['with service name but no service link']);

      const $component = $('.govuk-header');
      const $serviceName = $component.find('.hmrc-header__service-name');
      expect($serviceName.hasClass('hmrc-header__service-name--linked')).toBeFalsy();
    });
  });

  describe('with navigation', () => {
    it('passes accessibility tests', async () => {
      const $ = render('header', examples['with navigation']);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders navigation', () => {
      const $ = render('header', examples['with navigation']);

      const $component = $('.govuk-header');
      const $list = $component.find('ul.govuk-header__navigation-list');
      const $items = $list.find('li.govuk-header__navigation-item');
      const $firstItem = $items.find('a.govuk-header__link:first-child');
      expect($items.length).toEqual(4);
      expect($firstItem.attr('href')).toEqual('#1');
      expect($firstItem.text()).toContain('Navigation item 1');
    });

    it('renders navigation item with html', () => {
      const $ = render('header', {
        navigation: [
          {
            href: '#1',
            html: '<em>Nav item</em>',
          },
        ],
      });

      const $navigationLink = $('.govuk-header__navigation-item a');
      expect($navigationLink.html()).toContain('<em>Nav item</em>');
    });

    it('renders navigation item with text without a link', () => {
      const $ = render('header', examples['navigation item with text without link']);

      const $navigationItem = $('.govuk-header__navigation-item');
      expect($navigationItem.html().trim()).toEqual('Navigation item 1');
    });

    it('renders navigation item with html without a link', () => {
      const $ = render('header', examples['navigation item with html without link']);

      const $navigationItem = $('.govuk-header__navigation-item');
      expect($navigationItem.html()).toContain('<em>Navigation item 1</em>');
    });

    it('renders navigation item anchor with attributes', () => {
      const $ = render('header', {
        navigation: [
          {
            text: 'Item',
            href: '/link',
            attributes: {
              'data-attribute': 'my-attribute',
              'data-attribute-2': 'my-attribute-2',
            },
          },
        ],
      });

      const $navigationLink = $('.govuk-header__navigation-item a');
      expect($navigationLink.attr('data-attribute')).toEqual('my-attribute');
      expect($navigationLink.attr('data-attribute-2')).toEqual('my-attribute-2');
    });

    it('renders navigation the same with different empty values', () => {
      function overrideItemList(navigation) {
        const params = { ...examples.default };
        params.navigation = navigation;
        return params;
      }

      const outputs = [undefined, null, []].map((itemList) => render('header', overrideItemList(itemList)).html());

      expect(outputs[0]).toEqual(outputs[1]);
      expect(outputs[0]).toEqual(outputs[2]);
    });

    it('renders navigation with aria-label in English if passed no language', () => {
      const $ = render('header', examples['with navigation']);

      const $navigation = $('.govuk-header__navigation');
      expect($navigation.attr('aria-label')).toEqual('Top Level Menu');
    });

    it('renders navigation with aria-label in Welsh when specified', () => {
      const $ = render('header', examples['with navigation welsh']);

      const $navigation = $('.govuk-header__navigation');
      expect($navigation.attr('aria-label')).toEqual('Dewislen Lefel Uchaf');
    });

    describe('menu button', () => {
      it('has an explicit type="button" so it does not act as a submit button', () => {
        const $ = render('header', examples['with navigation']);

        const $button = $('.govuk-header__menu-button');

        expect($button.attr('type')).toEqual('button');
      });
    });

    it('should have English text as default', () => {
      const $ = render('header', examples['with navigation']);

      const $button = $('.govuk-header__menu-button');
      expect($button.text()).toEqual('Menu');
    });

    it('should have Welsh text when specified', () => {
      const $ = render('header', examples['with navigation welsh']);

      const $button = $('.govuk-header__menu-button');
      expect($button.text()).toEqual('Dewislen');
    });

    it('should have aria-label in English if passed no language', () => {
      const $ = render('header', examples['with navigation']);

      const $button = $('.govuk-header__menu-button');
      expect($button.attr('aria-label')).toEqual('Show or hide Top Level Menu');
    });

    it('should have aria-label in Welsh when specified', () => {
      const $ = render('header', examples['with navigation welsh']);

      const $button = $('.govuk-header__menu-button');
      expect($button.attr('aria-label')).toEqual('Dangos neu guddio’r Ddewislen Lefel Uchaf');
    });
  });

  describe('SVG logo', () => {
    const $ = render('header', {});
    const $svg = $('.govuk-header__logotype-crown');

    it('sets focusable="false" so that IE does not treat it as an interactive element', () => {
      expect($svg.attr('focusable')).toEqual('false');
    });

    it('sets aria-hidden="true" so that it is ignored by assistive technologies', () => {
      expect($svg.attr('aria-hidden')).toEqual('true');
    });

    it('should have St Edwards Crown logo by default', () => {
      expect($svg.html().trim()).toContain('<path fill="currentColor" fill-rule="evenodd" d="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z"></path>');
    });

    describe('fallback PNG', () => {
      const $fallbackImage = $('.govuk-header__logotype-crown-fallback-image');

      it('is invisible to modern browsers', () => {
        expect($fallbackImage.length).toEqual(0);
      });
    });
  });

  describe('Tudor Crown SVG logo', () => {
    const $ = render('header', examples['with tudor crown']);
    const $svg = $('.govuk-header__logotype-crown');

    it('should have Tudor Crown logo when specified', () => {
      expect($svg.html().trim()).toContain('<path fill="currentColor" fill-rule="evenodd" d="M22.6 10.4c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m-5.9 6.7c-.9.4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4m10.8-3.7c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s0 2-1 2.4m3.3 4.8c-1 .4-2-.1-2.4-1-.4-.9.1-2 1-2.4.9-.4 2 .1 2.4 1s-.1 2-1 2.4M17 4.7l2.3 1.2V2.5l-2.3.7-.2-.2.9-3h-3.4l.9 3-.2.2c-.1.1-2.3-.7-2.3-.7v3.4L15 4.7c.1.1.1.2.2.2l-1.3 4c-.1.2-.1.4-.1.6 0 1.1.8 2 1.9 2.2h.7c1-.2 1.9-1.1 1.9-2.1 0-.2 0-.4-.1-.6l-1.3-4c-.1-.2 0-.2.1-.3m-7.6 5.7c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m-5 3c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s.1 2 1 2.4m-3.2 4.8c.9.4 2-.1 2.4-1 .4-.9-.1-2-1-2.4-.9-.4-2 .1-2.4 1s0 2 1 2.4m14.8 11c4.4 0 8.6.3 12.3.8 1.1-4.5 2.4-7 3.7-8.8l-2.5-.9c.2 1.3.3 1.9 0 2.7-.4-.4-.8-1.1-1.1-2.3l-1.2 4c.7-.5 1.3-.8 2-.9-1.1 2.5-2.6 3.1-3.5 3-1.1-.2-1.7-1.2-1.5-2.1.3-1.2 1.5-1.5 2.1-.1 1.1-2.3-.8-3-2-2.3 1.9-1.9 2.1-3.5.6-5.6-2.1 1.6-2.1 3.2-1.2 5.5-1.2-1.4-3.2-.6-2.5 1.6.9-1.4 2.1-.5 1.9.8-.2 1.1-1.7 2.1-3.5 1.9-2.7-.2-2.9-2.1-2.9-3.6.7-.1 1.9.5 2.9 1.9l.4-4.3c-1.1 1.1-2.1 1.4-3.2 1.4.4-1.2 2.1-3 2.1-3h-5.4s1.7 1.9 2.1 3c-1.1 0-2.1-.2-3.2-1.4l.4 4.3c1-1.4 2.2-2 2.9-1.9-.1 1.5-.2 3.4-2.9 3.6-1.9.2-3.4-.8-3.5-1.9-.2-1.3 1-2.2 1.9-.8.7-2.3-1.2-3-2.5-1.6.9-2.2.9-3.9-1.2-5.5-1.5 2-1.3 3.7.6 5.6-1.2-.7-3.1 0-2 2.3.6-1.4 1.8-1.1 2.1.1.2.9-.3 1.9-1.5 2.1-.9.2-2.4-.5-3.5-3 .6 0 1.2.3 2 .9l-1.2-4c-.3 1.1-.7 1.9-1.1 2.3-.3-.8-.2-1.4 0-2.7l-2.9.9C1.3 23 2.6 25.5 3.7 30c3.7-.5 7.9-.8 12.3-.8"></path>');
    });
  });

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
