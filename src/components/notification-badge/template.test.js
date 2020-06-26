/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('notification-badge')

describe('Notification Badge', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('notification-badge', examples.default)

      const results = await axe($.html(), {
        rules: {
          'region': { enabled: false }
        }
      })
      expect(results).toHaveNoViolations()
    })

    it('renders a span element', () => {
      const $ = render('notification-badge', examples.default)

      const $component = $('.hmrc-notification-badge')
      expect($component.get(0).tagName).toEqual('span')
    })

    it('does not output anything if no html or text is provided', () => {
      const $ = render('notification-badge', {})

      const $component = $('.hmrc-notification-badge')

      expect($component.length).toEqual(0)
    })

    it('renders badge text', () => {
      const text = 'New'

      const $ = render('notification-badge', { text })

      const labelText = $('.hmrc-notification-badge').text().trim()

      expect(labelText).toEqual(text)
    })
  })
})
