import AccountMenu from './components/hmrc-account-menu/account-menu'
import TimeoutDialog from './components/hmrc-timeout-dialog/timeout-dialog'
import ValidateInput from './components/hmrc-timeout-dialog/validate-input'

function initAll () {
  const invoke = fn => { fn() }
  const itemsToInit = window.HMRCReady || []
  window.HMRCReady = {
    push: invoke
  }
  if (document.querySelector('[data-module="hmrc-account-menu"]')) {
    new AccountMenu('[data-module="hmrc-account-menu"]').init()
  }
  itemsToInit.forEach(invoke)
}

export {
  initAll,
  AccountMenu,
  TimeoutDialog,
  ValidateInput
}
