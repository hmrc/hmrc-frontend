/* eslint-env jest */

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('add-to-a-list')

describe('Add to a list', () => {
  describe('by default', () => {
    const $ = render('add-to-a-list', examples['default'])
    const $heading = $('h1')
    const $legend = $('fieldset legend')

    it('Uses "items" as the plural item name', () => {
      expect($heading.text()).toContain('items')
    })

    it('Uses "no" as the count value', () => {
      expect($heading.text()).toContain('no items')
    })

    it('has the default legend text', () => {
      expect($legend.text()).toContain('Do you need to add another item?')
    })
  })

  describe('with one item', () => {
    const $ = render('add-to-a-list', examples['single-generic-item'])
    const $heading = $('h1')
    const $rows = $('.hmrc-add-to-a-list__contents')

    it('Uses "item" as the singular item name', () => {
      expect($heading.text()).toContain('item')
    })

    it('Uses "1" as the count value', () => {
      expect($heading.text()).toContain('1 item')
    })

    it('Contains a list of 1 item', () => {
      const $identifiers = $('span.hmrc-add-to-a-list__identifier', $rows)
      const $changeLinks = $('span.hmrc-add-to-a-list__change', $rows)
      const $removeLinks = $('span.hmrc-add-to-a-list__remove', $rows)

      expect($rows.length).toBe(1)
      expect($identifiers.text()).toContain('item one')
      expect($changeLinks.text()).toContain('Change')
      expect($removeLinks.text()).toContain('Remove')
      expect($changeLinks.find('.govuk-visually-hidden').text()).toContain('Change item one')
      expect($removeLinks.find('.govuk-visually-hidden').text()).toContain('Remove item one from the list')
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
      expect($removeLinks.eq(0).text()).toContain('Remove Director One from the list')
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
