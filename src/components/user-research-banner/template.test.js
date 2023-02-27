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

    it('should have English link text by default', () => {
      const $ = render('user-research-banner', examples.default);
      expect($('.hmrc-user-research-banner__link').text().trim()).toEqual('Sign up to take part in research (opens in new tab)');
    });

    it('should have Welsh link text when specified', () => {
      const $ = render('user-research-banner', examples.welsh);
      expect($('.hmrc-user-research-banner__link').text().trim()).toEqual('Cofrestrwch i gymryd rhan mewn ymchwil (yn agor tab newydd)');
    });

    it('should have English text by default', () => {
      const $ = render('user-research-banner', examples.default);
      expect($('.hmrc-user-research-banner__title').text().trim()).toEqual('Help make GOV.UK better');
    });

    it('should have Welsh text when specified', () => {
      const $ = render('user-research-banner', examples.welsh);
      expect($('.hmrc-user-research-banner__title').text().trim()).toEqual('Helpwch i wella GOV.UK');
    });

    it('should have visible English text for the close button by default', () => {
      const $ = render('user-research-banner', examples.default);
      expect($('.hmrc-user-research-banner__close [aria-hidden="true"]').text().trim()).toEqual('Hide message');
    });

    it('should have visually hidden English text for the close button by default', () => {
      const $ = render('user-research-banner', examples.default);
      expect($('.hmrc-user-research-banner__close .govuk-visually-hidden').text().trim()).toEqual('Hide message. I do not want to take part in research');
    });

    it('should have visible Welsh text for the close button when specified', () => {
      const $ = render('user-research-banner', examples.welsh);
      expect($('.hmrc-user-research-banner__close [aria-hidden="true"]').text().trim()).toEqual('Cuddio’r neges');
    });

    it('should have visually hidden Welsh text for the close button when specified', () => {
      const $ = render('user-research-banner', examples.welsh);
      expect($('.hmrc-user-research-banner__close .govuk-visually-hidden').text().trim()).toEqual('Cuddio’r neges. Dydw i ddim eisiau cymryd rhan mewn ymchwil');
    });

    it('should have the close button by default', () => {
      const $ = render('user-research-banner', examples.default);
      expect($('.hmrc-user-research-banner').html()).toContain('hmrc-user-research-banner__close');
    });

    it('should not have the close button when specified', () => {
      const $ = render('user-research-banner', examples['hide-close-button']);
      expect($('.hmrc-user-research-banner').html()).not.toContain('hmrc-user-research-banner__close');
    });
  });
});
