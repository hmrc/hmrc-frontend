/* eslint-env jest */

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('add-to-a-list');

const getTableItems = ($) => {
  const $rows = $('.hmrc-list-with-actions');
  const $changeLinks = $('.govuk-summary-list__actions-list-item:first-of-type', $rows);
  const $removeLinks = $('.govuk-summary-list__actions-list-item:last-of-type', $rows);

  const listItems = {};
  listItems.identifiers = [];
  $('.govuk-summary-list__key', $rows).each((index, element) => {
    listItems.identifiers.push($(element).text().trim());
  });
  listItems.changeLinkText = $changeLinks.find('[aria-hidden="true"]').eq(0).text().trim();
  listItems.removeLinkText = $removeLinks.find('[aria-hidden="true"]').eq(0).text().trim();
  listItems.ariaChangeText = $changeLinks.find('.govuk-visually-hidden').eq(0).text().trim();
  listItems.ariaRemoveText = $removeLinks.find('.govuk-visually-hidden').eq(0).text().trim();

  return listItems;
};

describe('Add to a list', () => {
  it('should be rendered using a structure accessible for JAWS users', () => {
    // https://github.com/hmrc/design-patterns/issues/31#issuecomment-799628620

    const $ = render('add-to-a-list', examples['multiple-specific-items']);

    expect($('.hmrc-list-with-actions').first().html()).toMatchSnapshot();
  });

  describe('by default', () => {
    const $ = render('add-to-a-list', examples.default);
    const $heading = $('h1');
    const $legend = $('fieldset legend');

    it('Has the correct no-items form of heading', () => {
      expect($heading.text().trim()).toBe('You have not added any items');
    });

    it('has the default legend text', () => {
      expect($legend.text().trim()).toBe('Do you need to add another item?');
    });
  });

  describe('with an empty list in welsh', () => {
    const $ = render('add-to-a-list', examples['empty-list-welsh']);
    const $heading = $('h1');
    const $legend = $('fieldset legend');

    it('Has the correct no-items form of heading in welsh', () => {
      expect($heading.text().trim()).toBe('Nid ydych wedi ychwanegu unrhyw eitemau');
    });
    it('has the default legend text in welsh', () => {
      expect($legend.text().trim()).toBe('Oes angen i chi ychwanegu eitem arall?');
    });
  });

  describe('with one item', () => {
    const $ = render('add-to-a-list', examples['single-generic-item']);
    const $heading = $('h1');
    const $rows = $('.govuk-summary-list__row');

    it('has the correct text for 1 item', () => {
      expect($heading.text()).toBe('You have added 1 item');
    });

    it('Contains a list of 1 item', () => {
      const listItems = getTableItems($);

      expect($rows.length).toBe(1);
      expect(listItems.identifiers[0]).toBe('item one');
      expect(listItems.changeLinkText).toBe('Change');
      expect(listItems.removeLinkText).toBe('Remove');
      expect(listItems.ariaChangeText).toBe('Change item one');
      expect(listItems.ariaRemoveText).toBe('Remove item one from the list');
    });
  });

  describe('with one item in welsh', () => {
    const $ = render('add-to-a-list', examples['single-generic-welsh-item']);
    const $heading = $('h1');
    const $rows = $('.hmrc-list-with-actions');

    it('Has the correct singular welsh heading', () => {
      expect($heading.text()).toBe('Rydych wedi ychwanegu 1 eitem');
    });

    it('Contains a list of 1 item', () => {
      const listItems = getTableItems($);

      expect($rows.length).toBe(1);
      expect(listItems.identifiers[0]).toBe('item one');
      expect(listItems.changeLinkText).toBe('Newid');
      expect(listItems.removeLinkText).toBe('Dileu');
      expect(listItems.ariaChangeText).toBe('Newid item one');
      expect(listItems.ariaRemoveText).toBe('Dileu’r item one o’r rhestr');
    });
  });

  describe('with two named items', () => {
    const $ = render('add-to-a-list', examples['multiple-specific-items']);
    const $heading = $('h1');
    const $rows = $('.hmrc-list-with-actions');
    const $legend = $('fieldset legend');
    const $form = $('form');
    it('Uses "directors" as the plural item name', () => {
      expect($heading.text()).toContain('directors');
    });

    it('Uses "2" as the count value', () => {
      expect($heading.text()).toContain('2 directors');
    });

    it('Contains a list of 2 directors', () => {
      const $identifiers = $('.govuk-summary-list__key', $rows);
      const $changeLinks = $('.govuk-summary-list__actions-list-item:first-of-type .govuk-visually-hidden', $rows);
      const $removeLinks = $('.govuk-summary-list__actions-list-item:last-of-type .govuk-visually-hidden', $rows);

      expect($rows.children().length).toBe(2);
      expect($identifiers.eq(0).text()).toContain('Director One');
      expect($changeLinks.eq(0).text()).toContain('Change Director One');
      // TODO: add test for the change url
      expect($removeLinks.eq(0).text()).toContain('Remove Director One from the list');
      // TODO: add test for the remove url

      expect($identifiers.eq(1).text()).toContain('Director Two');
      expect($changeLinks.eq(1).text()).toContain('Change Director Two');
      expect($removeLinks.eq(1).text()).toContain('Remove Director Two from the list');
    });

    it('has the item type in the legend text', () => {
      expect($legend.text()).toContain('Do you need to add another director?');
    });

    it('has an action set on the form', () => {
      expect($form.attr('action')).toBe('#add-director');
    });
  });

  describe('with two unnamed items in Welsh', () => {
    const $ = render('add-to-a-list', examples['multiple-generic-welsh-items']);
    const $heading = $('h1');
    const $rows = $('.hmrc-list-with-actions');
    const $legend = $('fieldset legend');
    const $form = $('form');
    it('Uses "o eitemau" as the plural item name', () => {
      expect($heading.text()).toBe('Rydych wedi ychwanegu 2 o eitemau');
    });

    it('Uses "2" as the count value', () => {
      expect($heading.text()).toContain('2 o eitemau');
    });

    it('Contains a list of 2 items', () => {
      const $identifiers = $('.govuk-summary-list__key', $rows);
      const $changeLinks = $('.govuk-summary-list__actions-list-item:first-of-type .govuk-visually-hidden', $rows);
      const $removeLinks = $('.govuk-summary-list__actions-list-item:last-of-type .govuk-visually-hidden', $rows);

      expect($rows.children().length).toBe(2);
      expect($identifiers.eq(0).text()).toContain('Eitem un');
      expect($changeLinks.eq(0).text()).toContain('Newid Eitem un');
      // TODO: add test for the change url
      expect($removeLinks.eq(0).text()).toContain('Dileu’r Eitem un o’r rhestr');
      // TODO: add test for the remove url

      expect($identifiers.eq(1).text()).toContain('Eitem dau');
      expect($changeLinks.eq(1).text()).toContain('Newid Eitem dau');
      expect($removeLinks.eq(1).text()).toContain('Dileu’r Eitem dau o’r rhestr');
    });

    it('has the item type in the legend text', () => {
      expect($legend.text()).toContain('Oes angen i chi ychwanegu eitem arall?');
    });

    it('has an action set on the form', () => {
      expect($form.attr('action')).toBe('#addItem');
    });
  });

  describe('Empty, null and missing itemLists', () => {
    function overrideItemList(itemList) {
      const params = { ...examples.default };
      params.itemList = itemList;
      return params;
    }

    it('should have the same output for all versions of no items being provided', () => {
      const outputs = [undefined, null, []].map((itemList) => render('add-to-a-list', overrideItemList(itemList)).html());

      expect(outputs[0]).toEqual(outputs[1]);
      expect(outputs[0]).toEqual(outputs[2]);
    });
  });
});
