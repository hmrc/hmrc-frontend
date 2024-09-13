/* eslint-env jest */

import axe from '../../../lib/axe-helper';
import { render, getExamples } from '../../../lib/jest-helpers';

const examples = getExamples('account-menu');

describe('Account Menu', () => {
  describe('by default', () => {
    it('passes accessibility tests', async () => {
      const $ = render('account-menu', examples.default);

      const results = await axe($.html());
      expect(results).toHaveNoViolations();
    });

    it('renders a default menu', () => {
      const $ = render('account-menu', examples.default);

      const $nav = $('[data-module="hmrc-account-menu"]');
      const $accountHomeLink = $nav.find('a:contains("Account home")');
      const $messagesLink = $nav.find('a:contains("Messages")');
      const $progressLink = $nav.find('a:contains("Check progress")');
      const $yourProfileLink = $nav.find('a:contains("Profile and settings")');
      const $signOutLink = $nav.find('a:contains("Sign out")');

      expect($nav).not.toBeNull();
      expect($accountHomeLink.attr('href')).toEqual('#');
      expect($messagesLink.attr('href')).toEqual('#');
      expect($progressLink.attr('href')).toEqual('#');
      expect($yourProfileLink.attr('href')).toEqual('#');
      expect($signOutLink.attr('href')).toEqual('#');
    });

    it('render menu with the business tax account link visible', () => {
      const example = examples['with-business-tax-account-link'];
      const $ = render('account-menu', example);

      const $nav = $('[data-module="hmrc-account-menu"]');
      const $accountHomeLink = $nav.find('a:contains("Account home")');
      const $messagesLink = $nav.find('a:contains("Messages")');
      const $progressLink = $nav.find('a:contains("Check progress")');
      const $yourProfileLink = $nav.find('a:contains("Profile and settings")');
      const $businessTaxAccountLink = $nav.find('a:contains("Business tax account")');
      const $signOutLink = $nav.find('a:contains("Sign out")');

      expect($nav).not.toBeNull();
      expect($accountHomeLink.attr('href')).toEqual('#');
      expect($messagesLink.attr('href')).toEqual('#');
      expect($progressLink.attr('href')).toEqual('#');
      expect($yourProfileLink.attr('href')).toEqual('#');
      expect($businessTaxAccountLink.attr('href')).toEqual('#business-tax-account');
      expect($signOutLink.attr('href')).toEqual('#');
    });

    it('renders custom hrefs', () => {
      const example = examples['with-navigation-urls'];
      const $ = render('account-menu', example);

      const $nav = $('[data-module="hmrc-account-menu"]');
      const $accountHomeLink = $nav.find('a:contains("Account home")');
      const $messagesLink = $nav.find('a:contains("Messages")');
      const $progressLink = $nav.find('a:contains("Check progress")');
      const $yourProfileLink = $nav.find('a:contains("Profile and settings")');
      const $signOutLink = $nav.find('a:contains("Sign out")');

      expect($accountHomeLink.attr('href')).toEqual(example.accountHome.href);
      expect($messagesLink.attr('href')).toEqual(example.messages.href);
      expect($progressLink.attr('href')).toEqual(example.checkProgress.href);
      expect($yourProfileLink.attr('href')).toEqual(example.yourProfile.href);
      expect($signOutLink.attr('href')).toEqual(example.signOut.href);
    });

    it('renders a notification badge with a message count', () => {
      const example = examples['with-unread-messages'];
      const $ = render('account-menu', example);

      const $messageCount = $('.hmrc-notification-badge');

      expect($messageCount).not.toBeNull();
      expect($messageCount.text()).toEqual(example.messages.messageCount.toString());
    });
  });
});
