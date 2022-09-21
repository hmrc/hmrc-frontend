import AccountMenu from './components/account-menu/account-menu';
import BackLinkHelper from './components/back-link-helper/back-link-helper';
import CharacterCount from './components/character-count/character-count';
import TimeoutDialog from './components/timeout-dialog/timeout-dialog';
import UserResearchBanner from './components/user-research-banner/user-research-banner';
import { nodeListForEach } from './common';
import SessionActivityService from './components/timeout-dialog/session-activity-service';

function initAll() {
  const $AccountMenuSelector = '[data-module="hmrc-account-menu"]';
  if (document.querySelector($AccountMenuSelector)) {
    new AccountMenu($AccountMenuSelector).init();
  }

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
  nodeListForEach($BackLinks, ($BackLink) => {
    new BackLinkHelper($BackLink, window, document).init();
  });

  const $CharacterCounts = document.querySelectorAll('[data-module="hmrc-character-count"]');
  nodeListForEach($CharacterCounts, ($CharacterCount) => {
    new CharacterCount($CharacterCount).init();
  });
}

export default {
  initAll,
  AccountMenu,
  TimeoutDialog,
  UserResearchBanner,
  CharacterCount,
  BackLinkHelper,

};
