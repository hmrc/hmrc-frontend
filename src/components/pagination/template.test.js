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
    const $listItemActive = $('li.hmrc-pagination__item--active');

    it('renders a pagination component with an unordered list', () => {
      expect($pagination.get(0).tagName).toEqual('ul');
    });

    it('has a list of 1 item', () => {
      expect($listItemActive.length).toBe(1);
    });

    it('has the correct text', () => {
      expect($listItemActive.text()).toContain('1');
    });
  });

  describe('with two items', () => {
    const $ = render('pagination', examples['multiple-items']);
    const $listItemsLink = $('a.hmrc-pagination__link');
    const $listItemActive = $('li.hmrc-pagination__item--active')

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
    const $listItemPrev = $('li.hmrc-pagination__item--prev');

    it('does not have a previous button if the first page is active', () => {
      expect($listItemPrev.get(0)).toBeUndefined();
    });
  });

  describe('last item active', () => {
    const $ = render('pagination', examples['last-item-active']);
    const $listItemNext = $('li.hmrc-pagination__item--next');

    it('does not have a next button if the last page is active', () => {
      expect($listItemNext.get(0)).toBeUndefined(); 
    });
  });

  describe('when the amount of items is greater than the maximum length', () => {
    const $ = render('pagination', examples['multiple-items-truncated']);
    const $listItems = $('li.hmrc-pagination__page');

    it('should show the maximum number of items', () => {
      expect($listItems.length).toBe(9); //this is hardcoded so will fail
    });
  });

  describe('the active page is shown in the centre of pagination', () => {
    const $ = render('pagination', examples['multiple-items-truncated']);
    const $listItems = $('li.hmrc-pagination__page');
    const $listDots = $('li.hmrc-pagination__item--dots');

    it('should have the active page in the centre', () => {
      expect(parseInt($listItems.eq(1).text())).toBe(6); //these were hardcoded so will fail
      expect(parseInt($listItems.eq(7).text())).toBe(12);
      expect($listItems.eq(4).attr('class')).toContain('hmrc-pagination__item--active');
    });

    it('should be truncated on either side of the shown pages, and show the first and last page', () => {
      expect(parseInt($listItems.eq(0).text())).toBe(1); //these were hardcoded so will fail
      expect(parseInt($listItems.eq(9).text())).toBe(20);
      expect($listDots.length).toBe(2);
    });

    it('should have more pages ahead of the active page than before if the total number of pages is odd', () => {
      expect(($listItems.length - 2) % 2).toBe(1); //used -2 to exclude the first and last pages
      expect();
    });
  });


});