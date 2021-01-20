/* eslint-env jest */

const axe = require('../../../lib/axe-helper');

const { render, getExamples } = require('../../../lib/jest-helpers');

const examples = getExamples('user-research-banner');

describe('User Research Banner', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('user-research-banner', examples.default);

      const results = await axe($.html(), {
        rules: {
          region: { enabled: false },
        },
      });

      expect(results).toHaveNoViolations();
    });

    it('should render the correct URL', () => {
      const $ = render('user-research-banner', examples.default);
      expect($('.hmrc-user-research-banner__link').attr('href')).toEqual('https://www.example.com/user-research');
    });

    it('should have English text by default', () => {
      const $ = render('user-research-banner', examples.default);
      expect($('.hmrc-user-research-banner__title').text().trim()).toEqual('Help improve HMRC services');
    });

    it('should have Welsh text when specified', () => {
      const $ = render('user-research-banner', examples.welsh);
      expect($('.hmrc-user-research-banner__title').text().trim()).toEqual('Helpwch i wella gwasanaethau CThEM');
    });
  });
});
