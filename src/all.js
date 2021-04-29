import AccountMenu from './components/account-menu/account-menu';
import TimeoutDialog from './components/timeout-dialog/timeout-dialog';
import UserResearchBanner from './components/user-research-banner/user-research-banner';
import CharacterCount from './components/character-count/character-count';
import { nodeListForEach } from './common';

function initAll() {
  const $AccountMenuSelector = '[data-module="hmrc-account-menu"]';
  if (document.querySelector($AccountMenuSelector)) {
    new AccountMenu($AccountMenuSelector).init();
  }

  const $TimeoutDialog = document.querySelector('meta[name="hmrc-timeout-dialog"]');
  if ($TimeoutDialog) {
    new TimeoutDialog($TimeoutDialog).init();
  }

  const $UserResearchBanner = document.querySelector('[data-module="hmrc-user-research-banner"]');
  if ($UserResearchBanner) {
    new UserResearchBanner($UserResearchBanner).init();
  }

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

};
