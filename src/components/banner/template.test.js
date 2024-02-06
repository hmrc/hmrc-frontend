/* eslint-env jest */

import axe from '../../../lib/axe-helper';

import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('banner');

describe('Internal Header', () => {
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
      expect($('.hmrc-banner > .hmrc-organisation-logo > p.govuk-body-s').text().trim()).toEqual('HM Revenue & Customs');
    });
    it('should have Welsh text when specified', () => {
      const $ = render('banner', examples.welsh);
      expect($('.hmrc-banner > .hmrc-organisation-logo > p.govuk-body-s').text().trim()).toEqual('Cyllid a Thollau EF');
    });
    it('should have Tudor Crown logo by default', () => {
      const $ = render('banner', examples.default);
      expect($('.hmrc-banner > .hmrc-organisation-logo > svg').html().trim()).toContain('<path class="cls-1" d="m28.5,16.6c.82-.34,1.22-1.29.88-2.12-.34-.83-1.3-1.24-2.12-.9-.84.34-1.23,1.31-.89,2.14.34.83,1.3,1.23,2.14.88Z"></path>');
    });
    it('should have St Edwards Crown logo when specified', () => {
      const $ = render('banner', examples['with-deprecated-crown']);
      expect($('.hmrc-banner > .hmrc-organisation-logo > svg').html().trim()).toContain('<path d="M104.32,73.72,101,73.29c.94-2,1.51-3.22,1.51-3.22,0-.38,1.11-2.22,1.53-3.73a19.94,19.94,0,0,0,.61-3.89,15.05,15.05,0,0,0-3.68-10.06,12.21,12.21,0,0,0-9.18-4.18,17.46,17.46,0,0,0-3.68.44c-2.09.52-3.08.81-4.93,1.29a51.13,51.13,0,0,0-8.85,3.61,1.37,1.37,0,0,0-.73.91,2,2,0,0,0-.07.53L73.31,71.6H70.53V53.46a4.05,4.05,0,0,1,.18-1.14,3.37,3.37,0,0,1,1.43-1.71c.6-.39,1.21-.75,1.82-1.08a2.49,2.49,0,1,1,3.87-2.07c0,.12,0,.25,0,.37l.16-.06c.55-.19,1.16-.37,1.75-.55a2.49,2.49,0,1,1,3.71-2.16,2.66,2.66,0,0,1-.3,1.16l2.06-.56.36-.08a2.49,2.49,0,1,1,3.87-2.07A2.42,2.42,0,0,1,89,44.82h.06a16.43,16.43,0,0,1,2.72-.18,2.45,2.45,0,0,1-.48-1.45,2.49,2.49,0,1,1,5,0,2.46,2.46,0,0,1-.89,1.89A16.46,16.46,0,0,1,98.1,46a2.41,2.41,0,0,1-.12-.72,2.5,2.5,0,1,1,3,2.44,16.7,16.7,0,0,1,2.12,1.91v-.08a2.49,2.49,0,1,1,2.49,2.49,2.15,2.15,0,0,1-.68-.11,18.34,18.34,0,0,1,1.25,2.26,2.49,2.49,0,0,1,4.55,1.4,2.5,2.5,0,0,1-2.49,2.5,2.64,2.64,0,0,1-.8-.15,20.9,20.9,0,0,1,.35,2.1,2.52,2.52,0,0,1,1-.19,2.49,2.49,0,1,1,0,5,2.59,2.59,0,0,1-1.07-.25c0,.26-.08.54-.11.82s-.14.55-.21.78a2.49,2.49,0,0,1-.32,5,2.39,2.39,0,0,1-1.39-.43c-.34.8-.78,1.83-1.27,3"></path>');
    });
  });
});
