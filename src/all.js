import AccountMenu from './components/account-menu/account-menu';
import TimeoutDialog from './components/timeout-dialog/timeout-dialog';
import UserResearchBanner from './components/user-research-banner/user-research-banner';

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
}

export default {
  initAll,
  AccountMenu,
  TimeoutDialog,
  UserResearchBanner,
};
