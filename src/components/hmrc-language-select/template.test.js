/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('language-select')

describe('New Tab Link', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('language-select', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders a English as text and Welsh as a link', () => {
      const $ = render('language-select', examples.default)

      const $component = $('.govuk-link')
      expect($component.length).toEqual(1)
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('target')).toEqual(undefined)
      expect($component.attr('lang')).toEqual('cy')
      expect($component.attr('href')).toEqual(examples.default.cy.href)
      expect($component.text()).toEqual('Cymraeg')
      expect($.text().trim().replace(/[\s,\n]+/g, ' ')).toEqual('English | Cymraeg')
    })

    it('renders a Welsh as text and English as a link', () => {
      const $ = render('language-select', examples.welsh)

      const $component = $('.govuk-link')
      expect($component.length).toEqual(1)
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('target')).toEqual(undefined)
      expect($component.attr('lang')).toEqual('en')
      expect($component.attr('href')).toEqual(examples.welsh.en.href)
      expect($component.text()).toEqual('English')
      expect($.text().trim().replace(/[\s,\n]+/g, ' ')).toEqual('English | Cymraeg')
    })
  })
})
