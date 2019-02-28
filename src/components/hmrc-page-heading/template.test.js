/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('page-heading')

describe('Page Heading', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-heading', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders a header element with a single heading', () => {
      const $ = render('page-heading', examples.default)

      const $component = $('.hmrc-page-heading')

      expect($component.get(0).tagName).toEqual('header')
      expect($component.children().length).toEqual(1)
      expect($component.children().get(0).tagName).toEqual('h1')
      expect($component.find('h1').text().trim()).toEqual(examples.default.text)
    })
  })

  describe('with section', () => {
    it('passes accessibility tests', async () => {
      const $ = render('page-heading', examples['with-section'])

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders a header with a section subheading', () => {
      const $ = render('page-heading', examples['with-section'])

      const $component = $('.hmrc-page-heading')

      expect($component.children().length).toEqual(2)
      expect($component.children().get(1).tagName).toEqual('p')
      expect($component.find('p').text().trim()).toEqual(`This section is Personal details`)
      expect($component.find('span.govuk-visually-hidden').text()).toEqual(`This section is `)
    })
  })
})
