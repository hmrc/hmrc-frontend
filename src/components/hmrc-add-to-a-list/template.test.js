/* eslint-env jest */

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('add-to-a-list')

const getTableItems = ($) => {
  const $rows = $('.hmrc-add-to-a-list__contents')
  const $changeLinks = $('span.hmrc-add-to-a-list__change', $rows)
  const $removeLinks = $('span.hmrc-add-to-a-list__remove', $rows)

  const listItems = {}
  listItems.identifiers = []
  $('span.hmrc-add-to-a-list__identifier', $rows).each((index, element) => {
    listItems.identifiers.push($(element).text().trim())
  })
  console.log(listItems.identifiers)
  listItems.changeLinkText = $changeLinks.find('[aria-hidden="true"]').eq(0).text().trim()
  listItems.removeLinkText = $removeLinks.find('[aria-hidden="true"]').eq(0).text().trim()
  listItems.ariaChangeText = $changeLinks.find('.govuk-visually-hidden').eq(0).text().trim()
  listItems.ariaRemoveText = $removeLinks.find('.govuk-visually-hidden').eq(0).text().trim()

  return listItems
}

describe('Add to a list', () => {
  describe('by default', () => {
    const $ = render('add-to-a-list', examples['default'])
    const $heading = $('h1')
    const $legend = $('fieldset legend')

    it('Has the correct no-items form of heading', () => {
      expect($heading.text().trim()).toBe('You have added no items')
    })

    it('has the default legend text', () => {
      expect($legend.text().trim()).toBe('Do you need to add another item?')
    })
  })

  describe('with one item', () => {
    const $ = render('add-to-a-list', examples['single-generic-item'])
    const $heading = $('h1')
    const $rows = $('.hmrc-add-to-a-list__contents')

    it('has the correct text for 1 item', () => {
      expect($heading.text()).toBe('You have added 1 item')
    })

    it('Contains a list of 1 item', () => {
      const listItems = getTableItems($)

      expect($rows.length).toBe(1)
      expect(listItems.identifiers[0]).toBe('item one')
      expect(listItems.changeLinkText).toBe('Change')
      expect(listItems.removeLinkText).toBe('Remove')
      expect(listItems.ariaChangeText).toBe('Change item one')
      expect(listItems.ariaRemoveText).toBe('Remove item one from the list')
    })
  })

  describe('with one item in welsh', () => {
    const $ = render('add-to-a-list', examples['single-generic-welsh-item'])
    const $heading = $('h1')
    const $rows = $('.hmrc-add-to-a-list__contents')

    it('Has the correct singular welsh heading', () => {
      expect($heading.text()).toBe('You have added - cy 1 item-cy')
    })

    it('Contains a list of 1 item', () => {
      const listItems = getTableItems($)

      expect($rows.length).toBe(1)
      expect(listItems.identifiers[0]).toBe('item one')
      expect(listItems.changeLinkText).toBe('Change-cy')
      expect(listItems.removeLinkText).toBe('Remove-cy')
      expect(listItems.ariaChangeText).toBe('Change-cy item one')
      expect(listItems.ariaRemoveText).toBe('Remove-cy item one from the list')
    })
  })

  describe('with two named items', () => {
    const $ = render('add-to-a-list', examples['multiple-specific-items'])
    const $heading = $('h1')
    const $rows = $('.hmrc-add-to-a-list__contents')
    const $legend = $('fieldset legend')
    const $form = $('form')
    it('Uses "directors" as the plural item name', () => {
      expect($heading.text()).toContain('directors')
    })

    it('Uses "2" as the count value', () => {
      expect($heading.text()).toContain('2 directors')
    })

    it('Contains a list of 2 directors', () => {
      const $identifiers = $('span.hmrc-add-to-a-list__identifier', $rows)
      const $changeLinks = $('span.hmrc-add-to-a-list__change .govuk-visually-hidden', $rows)
      const $removeLinks = $('span.hmrc-add-to-a-list__remove .govuk-visually-hidden', $rows)

      expect($rows.length).toBe(2)
      expect($identifiers.eq(0).text()).toContain('Director One')
      expect($changeLinks.eq(0).text()).toContain('Change Director One')
      // TODO: add test for the change url
      expect($removeLinks.eq(0).text()).toContain('Remove Director One from the list')
      // TODO: add test for the remove url

      expect($identifiers.eq(1).text()).toContain('Director Two')
      expect($changeLinks.eq(1).text()).toContain('Change Director Two')
      expect($removeLinks.eq(1).text()).toContain('Remove Director Two from the list')
    })

    it('has the item type in the legend text', () => {
      expect($legend.text()).toContain('Do you need to add another director?')
    })

    it('has an action set on the form', () => {
      expect($form.attr('action')).toBe('#add-director')
    })
  })
})
