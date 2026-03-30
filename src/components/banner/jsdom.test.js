/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('banner');

describe('HMRC Header', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('internal-header', examples.default);

      const results = await axe($.html(), {
        rules: {
          region: { enabled: false },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should have English text by default', () => {
      const $ = render('banner', examples.default);
      expect($('.hmrc-banner > .govuk-width-container > .hmrc-organisation-logo > p.govuk-body-s').text().trim()).toEqual('HM Revenue & Customs');
    });

    it('should have Welsh text when specified', () => {
      const $ = render('banner', examples.welsh);
      expect($('.hmrc-banner > .govuk-width-container > .hmrc-organisation-logo > p.govuk-body-s').text().trim()).toEqual('Cyllid a Thollau EF');
    });

    it('should have Tudor Crown logo', () => {
      const $ = render('banner', examples.default);
      expect($('.hmrc-banner > .govuk-width-container > .hmrc-organisation-logo > svg').html().trim()).toContain('<path class="cls-1" d="m28.5,16.6c');
    });
  });
});
