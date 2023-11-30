// eslint-disable-next-line import/no-extraneous-dependencies
import 'nodelist-foreach-polyfill';
import AccountMenu from './components/account-menu/account-menu';
import BackLinkHelper from './components/back-link-helper/back-link-helper';
import TimeoutDialog from './components/timeout-dialog/timeout-dialog';
import UserResearchBanner from './components/user-research-banner/user-research-banner';
import SessionActivityService from './components/timeout-dialog/session-activity-service';
import HmrcPrintLink from './components/hmrc-print-link/hmrc-print-link';

function initAll() {
  const $AccountMenuSelector = '[data-module="hmrc-account-menu"]';
  if (document.querySelector($AccountMenuSelector)) {
    new AccountMenu($AccountMenuSelector).init();
  }

  const $HmrcPrintLinks = document.querySelectorAll('a[data-module="hmrc-print-link"]');
  $HmrcPrintLinks.forEach(($HmrcPrintLink) => {
    new HmrcPrintLink($HmrcPrintLink, window).init();
  });

  const sessionActivityService = new SessionActivityService(window.BroadcastChannel);
  sessionActivityService.logActivity();

  const $TimeoutDialog = document.querySelector('meta[name="hmrc-timeout-dialog"]');
  if ($TimeoutDialog) {
    new TimeoutDialog($TimeoutDialog, sessionActivityService).init();
  }

  const $UserResearchBanner = document.querySelector('[data-module="hmrc-user-research-banner"]');
  if ($UserResearchBanner) {
    new UserResearchBanner($UserResearchBanner).init();
  }

  const $BackLinks = document.querySelectorAll('[data-module="hmrc-back-link"]');
  $BackLinks.forEach(($BackLink) => {
    new BackLinkHelper($BackLink, window, document).init();
  });
}

export default {
  initAll,
  AccountMenu,
  TimeoutDialog,
  UserResearchBanner,
  BackLinkHelper,

};
