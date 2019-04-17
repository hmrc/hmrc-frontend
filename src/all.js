import AccountMenu from './components/hmrc-account-menu/account-menu'
import TimeoutDialog from './components/hmrc-timeout-dialog/timeout-dialog'
import ValidateInput from './components/hmrc-timeout-dialog/validate-input'

function initAll () {
  if (document.querySelector('[data-module="hmrc-account-menu"]')) {
    new AccountMenu('[data-module="hmrc-account-menu"]').init()
  }

  let timeoutConfigElem = document.querySelector('meta[name="hmrc-timeout-dialog"]')
  if (timeoutConfigElem) {
    const validate = ValidateInput
    const lookupData = key => (timeoutConfigElem.attributes.getNamedItem(key) || {}).value
    TimeoutDialog({
      timeout: validate.int(lookupData('data-timeout')),
      countdown: validate.int(lookupData('data-countdown')),
      keepAliveUrl: validate.string(lookupData('data-keep-alive-url')),
      signOutUrl: validate.string(lookupData('data-sign-out-url')),
      title: validate.string(lookupData('data-title')),
      message: validate.string(lookupData('data-message')),
      keepAliveButtonText: validate.string(lookupData('data-keep-alive-button-text')),
      signOutButtonText: validate.string(lookupData('data-sign-out-button-text')),
      properties: {
        minutes: validate.string(lookupData('data-properties--minutes')),
        minute: validate.string(lookupData('data-properties--minute')),
        seconds: validate.string(lookupData('data-properties--seconds')),
        second: validate.string(lookupData('data-properties--second'))
      }
    })
  }
}

export {
  initAll,
  AccountMenu,
  TimeoutDialog
}
