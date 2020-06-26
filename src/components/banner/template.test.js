/* eslint-env jest */

const axe = require('../../../lib/axe-helper')

const {render, getExamples} = require('../../../lib/jest-helpers')

const examples = getExamples('banner')

describe('Internal Header', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('internal-header', examples.default)

      const results = await axe($.html(), {
        rules: {
          'region': { enabled: false }
        }
      })

      expect(results).toHaveNoViolations()
    })
    it('should have English text by default', () => {
      const $ = render('banner', examples.default)
      expect($('.hmrc-banner > .hmrc-organisation-logo > p.govuk-body-s').text().trim()).toEqual('HM Revenue & Customs')
    })
    it('should have Welsh text when specified', () => {
      const $ = render('banner', examples.welsh)
      expect($('.hmrc-banner > .hmrc-organisation-logo > p.govuk-body-s').text().trim()).toEqual('Cyllid a Thollau EM')
    })
  })
})
