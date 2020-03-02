/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('report-technical-issue')

describe('Report Technical Issue', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('report-technical-issue', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders a link element', () => {
      const $ = render('report-technical-issue', examples.default)

      const $component = $('.govuk-link')
      expect($component.get(0).tagName).toEqual('a')
      expect($component.attr('target')).toEqual('_blank')
      expect($component.attr('rel')).toEqual(undefined)
      expect($component.attr('href')).toEqual('/contact/problem_reports_nonjs?service=the-url-safe-service-name')
      expect($component.text()).toEqual('Get help with this page')
    })

    it('renders link with custom classes', () => {
      const $ = render('report-technical-issue', examples['with-classes'])

      const $component = $('.govuk-link')

      expect($component.attr('class')).toEqual('govuk-link govuk-!-font-weight-bold my-custom-class')
    })

    it('uses the provided URL', () => {
      const $ = render('report-technical-issue', examples.welsh)

      const $component = $('.govuk-link')

      expect($component.text()).toEqual('Help gyda\'r dudalen hon')
    })
  })
})
