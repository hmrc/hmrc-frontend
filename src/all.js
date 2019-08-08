import AccountMenu from './components/account-menu/account-menu'
import TimeoutDialog from './components/timeout-dialog/timeout-dialog'

function initAll () {
  var $AccountMenuSelector = '[data-module="hmrc-account-menu"]'
  if (document.querySelector($AccountMenuSelector)) {
    new AccountMenu($AccountMenuSelector).init()
  }

  var $TimeoutDialog = document.querySelector('meta[name="hmrc-timeout-dialog"]')
  if ($TimeoutDialog) {
    new TimeoutDialog($TimeoutDialog).init()
  }
}

export default {
  initAll: initAll,
  AccountMenu: AccountMenu,
  TimeoutDialog: TimeoutDialog
}
