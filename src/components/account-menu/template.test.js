/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('account-menu')

describe('Notification Badge', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('account-menu', examples.default)

      const results = await axe($.html())
      expect(results).toHaveNoViolations()
    })

    it('renders a span element', () => {
      const $ = render('account-menu', examples.default)

      const $component = $('nav#secondary-nav')
      expect($component.get(0).tagName).toEqual('nav')
    })
  })
})
