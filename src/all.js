import AccountMenu from './components/hmrc-account-menu/account-menu'

function initAll () {
  if (document.querySelector('[data-module="hmrc-account-menu"]')) {
    new AccountMenu('[data-module="hmrc-account-menu"]').init()
  }
}

export {
  initAll,
  AccountMenu
}
