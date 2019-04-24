import AccountMenu from './components/hmrc-account-menu/account-menu'
import TimeoutDialog from './components/hmrc-timeout-dialog/timeout-dialog'

function initAll () {
  var $AccountMenuSelector = '[data-module="hmrc-account-menu"]'
  if ($AccountMenuSelector) {
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
