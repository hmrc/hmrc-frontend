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
    const $svg = $('.govuk-header__link > svg');

    it('sets focusable="false" so that IE does not treat it as an interactive element', () => {
      expect($svg.attr('focusable')).toEqual('false');
    });

    describe('fallback PNG', () => {
      const $fallbackImage = $('.govuk-header__logotype-crown-fallback-image');

      it('is invisible to modern browsers', () => {
        expect($fallbackImage.length).toEqual(0);
      });
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
