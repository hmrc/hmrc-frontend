/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('new-tab-link')

describe('New Tab Link', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('new-tab-link', examples.default)

      const results = await axe($.html(), {
        rules: {
          'region': { enabled: false }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('renders a link element', () => {
      const $ = render('new-tab-link', examples.default)

      const $component = $('.govuk-link')
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('target')).toEqual('_blank')
      expect($component.attr('rel')).toEqual('noopener noreferrer')
      expect($component.attr('href')).toEqual('https://www.gov.uk/working-tax-credit/eligibility')
    })

    it('renders link text with english explanation', () => {
      const text = 'my link TEXT'

      const $ = render('new-tab-link', { text, language: 'en', href: 'about:blank' })

      const labelText = $('.govuk-link').text().trim()

      expect(labelText).toEqual('my link TEXT (opens in a new tab)')
    })

    it('renders link text with english explanation', () => {
      const text = 'my link TEXT'

      const $ = render('new-tab-link', { text, language: 'cy', href: 'about:blank' })

      const labelText = $('.govuk-link').text().trim()

      expect(labelText).toEqual('my link TEXT (yn agor ffenestr neu dab newydd)')
    })

    it('renders link with custom classes', () => {
      const $ = render('new-tab-link', examples['with-classes'])

      const $component = $('.govuk-link')

      expect($component.attr('class')).toEqual('govuk-link govuk-!-font-weight-bold my-custom-class')
    })

    it('uses the provided URL', () => {
      const $ = render('new-tab-link', examples.welsh)

      const $component = $('.govuk-link')

      expect($component.attr('href')).toEqual('https://www.gov.uk/guidance/ffurflenni-cthem#4')
    })
  })
})
