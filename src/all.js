import AccountMenu from './components/hmrc-account-menu/account-menu'
import TimeoutDialog from './components/hmrc-timeout-dialog/timeout-dialog'
import ValidateInput from './components/hmrc-timeout-dialog/validate-input'

function initAll () {
  var itemsToInit = window.HMRCReady || []

  if (document.querySelector('[data-module="hmrc-account-menu"]')) {
    new AccountMenu('[data-module="hmrc-account-menu"]').init()
  }

  for (var index = 0; index < itemsToInit.length; index++) {
    var init = itemsToInit[index]
    init()
  }
}

export {
  initAll,
  AccountMenu,
  TimeoutDialog,
  ValidateInput
}
