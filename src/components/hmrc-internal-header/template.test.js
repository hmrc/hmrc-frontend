/* eslint-env jest */

const { render, getExamples } = require('../../../lib/jest-helpers')

const examples = getExamples('internal-header')

describe('Internal Header', () => {
  describe('by default', () => {
    const $ = render('internal-header', examples.default)
    it('does not render a service name', () => {
      const $serviceName = $('.hmrc-internal-service-name')
      expect($serviceName.html()).toBeNull()
    })
  })
  describe('With a Service Name', () => {
    it('renders a service name', () => {
      const $ = render('internal-header', examples['with-service-name'])
      const serviceName = $('.hmrc-internal-service-name a').text().trim()
      expect(serviceName).toBe('Service Name')
    })
  })
})
