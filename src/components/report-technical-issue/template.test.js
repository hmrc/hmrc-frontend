/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('report-technical-issue')

describe('Report Technical Issue', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('report-technical-issue', examples.default)

      const results = await axe($.html(), {
        rules: {
          'region': { enabled: false }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('renders a link element', () => {
      const $ = render('report-technical-issue', examples.default)

      const $component = $('.govuk-link')
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('target')).toEqual('_blank')
      expect($component.attr('hreflang')).toEqual('en')
      expect($component.attr('lang')).toEqual('en')
      expect($component.attr('href')).toEqual('/contact/problem_reports_nonjs?newTab=true&service=the-url-safe-service-name')
      expect($component.text()).toEqual('Get help with this page (opens in a new window or tab)')
    })

    it('renders a link element when nothing is provided', () => {
      const $ = render('report-technical-issue', {})

      const $component = $('.govuk-link')
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('target')).toEqual('_blank')
      expect($component.attr('hreflang')).toEqual('en')
      expect($component.attr('lang')).toEqual('en')
      expect($component.attr('href')).toEqual('/contact/problem_reports_nonjs?newTab=true')
      expect($component.text()).toEqual('Get help with this page (opens in a new window or tab)')
    })

    it('shouldn\'t specify any rel attributes so that referrer data is passed through', () => {
      const $ = render('report-technical-issue', examples.default)

      const $component = $('.govuk-link')
      expect($component.attr('rel')).toEqual(undefined)
    })

    it('renders link with custom classes', () => {
      const $ = render('report-technical-issue', examples['with-classes'])

      const $component = $('.govuk-link')

      expect($component.attr('class')).toEqual('govuk-link govuk-!-font-weight-bold my-custom-class')
    })

    it('should display in welsh', () => {
      const $ = render('report-technical-issue', examples.welsh)

      const $component = $('.govuk-link')

      expect($component.attr('hreflang')).toEqual('cy')
      expect($component.attr('lang')).toEqual('cy')
      expect($component.text()).toEqual('Help gyda\'r dudalen hon (yn agor ffenestr neu dab newydd)')
    })
  })
})
