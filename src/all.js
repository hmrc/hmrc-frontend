import initAccountMenu from './components/hmrc-account-menu/account-menu'

window.HMRC = window.HMRC || {}

if (document.querySelector('[data-module="hmrc-account-menu"]')) {
  initAccountMenu(window, window.HMRC)
}
