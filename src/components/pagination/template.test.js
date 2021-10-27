/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('pagination');

describe('Pagination', () => {
  describe('by default', () => {
    const $ = render('pagination', examples.default);
    const $pagination = $('.hmrc-pagination');

    it('passes accessibility tests', async () => {
      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('should not show pagination if there are no parameters given', () => {
      expect($pagination.length).toBe(0);
    });
  });

  describe('with one item', () => {
    const $ = render('pagination', examples['single-item']);
    const $pagination = $('ul.hmrc-pagination__list');
    const $listItems = $('span.hmrc-pagination__item');

    it('renders a pagination component with an unordered list', () => {
      expect($pagination.get(0).tagName).toEqual('ul');
    });

    it('has a list of only 1 item', () => {
      expect($listItems.length).toBe(1);
    });

    it('has the correct text', () => {
      expect($listItems.text()).toContain('1');
    });
  });

  describe('with two items', () => {
    const $ = render('pagination', examples['multiple-items']);
    const $listItemsLink = $('a.hmrc-pagination__link');
    const $listItemActive = $('span.hmrc-pagination__item--active');

    it('has a link with an href, and no more than 1 link for each item', () => {
      expect($listItemsLink.eq(1).attr('href')).toEqual('page-one');
      expect($listItemsLink.eq(1).length).toBe(1);
    });

    it('has an active item', () => {
      expect($listItemActive.eq(0).attr('class')).toContain('govuk-!-font-weight-bold');
      expect($listItemActive.eq(0).attr('href')).toBeUndefined();
    });
  });

  describe('first item active', () => {
    const $ = render('pagination', examples['first-item-active']);
    const $listItemPrev = $('span.hmrc-pagination__item--prev');

    it('does not have a previous button if the first page is active', () => {
      expect($listItemPrev.get(0)).toBeUndefined();
    });
  });

  describe('last item active', () => {
    const $ = render('pagination', examples['last-item-active']);
    const $listItemNext = $('span.hmrc-pagination__item--next');

    it('does not have a next button if the last page is active', () => {
      expect($listItemNext.get(0)).toBeUndefined();
    });
  });

  describe('when the amount of items is greater than the maximum length', () => {
    const $ = render('pagination', examples['multiple-items-truncated']);
    const $listItems = $('span.hmrc-pagination__page');
    const $listDots = $('span.hmrc-pagination__item--dots');

    it('should show the maximum number of items', () => {
      expect($listItems.length).toBe(11);
    });

    it('should have the active page in the centre', () => {
      expect($listItems.eq(1).text().trim()).toBe('8');
      expect($listItems.eq($listItems.length - 2).text().trim()).toBe('16');
      expect($listItems.eq(Math.floor($listItems.length / 2)).attr('class')).toContain('hmrc-pagination__item--active');
    });

    it('should be truncated on either side of the shown pages, and show the first and last page', () => {
      expect($listItems.eq(0).text().trim()).toBe('1');
      expect($listItems.eq(10).text().trim()).toBe('20');
      expect($listDots.length).toBe(2);
    });
  });

  describe('when the maximum number of items is odd', () => {
    const $ = render('pagination', examples['multiple-items-truncated']);
    const $listItems = $('span.hmrc-pagination__page');
    const $activeItem = $('.hmrc-pagination__item--active');

    it('should have the same amount of pages shown before and after the active page', () => {
      expect($listItems.index($activeItem)).toBe(5);
    });
  });

  describe('when the maximum number of items is even', () => {
    const $ = render('pagination', examples['even-maxLength']);
    const $listItems = $('span.hmrc-pagination__page');
    const $activeItem = $('.hmrc-pagination__item--active');

    it('should have one extra page ahead of the active page than before', () => {
      expect($listItems.index($activeItem)).toBe(3);
    });
  });

  describe('when the active page is near the start', () => {
    const $ = render('pagination', examples['active-near-beginning']);
    const $listItems = $('span.hmrc-pagination__page');
    const $listDots = $('span.hmrc-pagination__item--dots');

    it('should show the page number rather than the ellipses', () => {
      expect($listItems.eq(1).text().trim()).toBe('2');
      expect($listDots.length).toBe(1);
    });
  });

  describe('when the active page is near the end', () => {
    const $ = render('pagination', examples['active-near-end']);
    const $listItems = $('li.hmrc-pagination__page');
    const $listDots = $('li.hmrc-pagination__item--dots');

    it('should show the page number rather than the ellipses', () => {
      expect($listItems.eq(-2).text().trim()).toBe('9');
      expect($listDots.length).toBe(1);
    });
  });
});
