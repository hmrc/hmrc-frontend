import AccountMenu from './components/account-menu/account-menu';
import BackLinkHelper from './components/back-link-helper/back-link-helper';
import TimeoutDialog from './components/timeout-dialog/timeout-dialog';
import UserResearchBanner from './components/user-research-banner/user-research-banner';
import SessionActivityService from './components/timeout-dialog/session-activity-service';
import HmrcPrintLink from './components/hmrc-print-link/hmrc-print-link';

function initAll() {
  const $AccountMenuSelector = '[data-module="hmrc-account-menu"]';
  if (document.querySelector($AccountMenuSelector)) {
    try {
      new AccountMenu($AccountMenuSelector).init();
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.error(`hmrc-frontend - AccountMenu failed to initialise: ${message}`);
    }
  }

  const $HmrcPrintLinks = document.querySelectorAll('a[data-module="hmrc-print-link"]');
  $HmrcPrintLinks.forEach(($HmrcPrintLink) => {
    try {
      new HmrcPrintLink($HmrcPrintLink, window).init();
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.error(`hmrc-frontend - HmrcPrintLinks failed to initialise: ${message}`);
    }
  });

  const sessionActivityService = new SessionActivityService(window.BroadcastChannel);
  sessionActivityService.logActivity();

  const $TimeoutDialog = document.querySelector('meta[name="hmrc-timeout-dialog"]');
  if ($TimeoutDialog) {
    try {
      new TimeoutDialog($TimeoutDialog, sessionActivityService).init();
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.error(`hmrc-frontend - TimeoutDialog failed to initialise: ${message}`);
    }
  }

  const $UserResearchBanner = document.querySelector('[data-module="hmrc-user-research-banner"]');
  if ($UserResearchBanner) {
    try {
      new UserResearchBanner($UserResearchBanner).init();
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.error(`hmrc-frontend - UserResearchBanner failed to initialise: ${message}`);
    }
  }

  const $BackLinks = document.querySelectorAll('[data-module="hmrc-back-link"]');
  $BackLinks.forEach(($BackLink) => {
    try {
      new BackLinkHelper($BackLink, window, document).init();
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.error(`hmrc-frontend - BackLinkHelper failed to initialise: ${message}`);
    }
  });
}

export default {
  initAll,
  AccountMenu,
  TimeoutDialog,
  UserResearchBanner,
  BackLinkHelper,

};
