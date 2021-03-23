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
      const $paperlessLink = $nav.find('a:contains("paperless settings")');
      const $detailsLink = $nav.find('a:contains("personal details")');
      const $signOutLink = $nav.find('a:contains("Sign out")');

      expect($nav).not.toBeNull();
      expect($accountHomeLink.attr('href')).toEqual('#');
      expect($messagesLink.attr('href')).toEqual('#');
      expect($progressLink.attr('href')).toEqual('#');
      expect($paperlessLink.attr('href')).toEqual('#');
      expect($detailsLink.attr('href')).toEqual('#');
      expect($signOutLink.attr('href')).toEqual('#');
    });

    it('renders custom hrefs', () => {
      const example = examples['with-navigation-urls'];
      const $ = render('account-menu', example);

      const $nav = $('[data-module="hmrc-account-menu"]');
      const $accountHomeLink = $nav.find('a:contains("Account home")');
      const $messagesLink = $nav.find('a:contains("Messages")');
      const $progressLink = $nav.find('a:contains("Check progress")');
      const $paperlessLink = $nav.find('a:contains("paperless settings")');
      const $detailsLink = $nav.find('a:contains("personal details")');
      const $signOutLink = $nav.find('a:contains("Sign out")');

      expect($accountHomeLink.attr('href')).toEqual(example.accountHome.href);
      expect($messagesLink.attr('href')).toEqual(example.messages.href);
      expect($progressLink.attr('href')).toEqual(example.checkProgress.href);
      expect($paperlessLink.attr('href')).toEqual(example.paperlessSettings.href);
      expect($detailsLink.attr('href')).toEqual(example.personalDetails.href);
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
