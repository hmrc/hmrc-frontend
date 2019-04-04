/* eslint-env jest */
const mock = require('jest-mock')

const TimeoutDialog = require('../../../public/components/hmrc-timeout-dialog/timeout-dialog')
const dialog = TimeoutDialog.dialog
const redirectHelper = TimeoutDialog.redirectHelper
const utils = TimeoutDialog.utils

// jest.mock('../../../public/all')

// dialog.mockImplementation(() => {

// })

describe('/components/timeout-dialog', () => {
  var assume
  var testScope // an object which is reset between test runs

  function pretendSecondsHavePassed (numberOfSeconds) {
    var millis = numberOfSeconds * 1000
    testScope.currentDateTime += millis
    jest.advanceTimersByTime(millis)
  }

  function pretendDialogWasClosedWithoutButtonPress () {
    if (!testScope.latestDialogCloseCallback) {
      throw new Error('No dialog close callback available.')
    }
    testScope.latestDialogCloseCallback()
  }

  function setupDialog (partialConfig) {
    testScope.timeoutDialogControl = TimeoutDialog(Object.assign({}, testScope.minimumValidConfig, partialConfig))
  }

  function setLanguageToWelsh () {
    document.cookie = 'PLAY_LANG=cy'
  }

  beforeEach(function () {
    document.cookie = 'PLAY_LANG=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path/;'
    assume = expect
    testScope = {
      currentDateTime: 1554196031049 // the time these tests were written - this can change but it's best not to write randomness into tests
    }
    mock.spyOn(Date, 'now').mockImplementation(function () {
      return testScope.currentDateTime
    })
    mock.spyOn(utils, 'ajaxGet').mockImplementation(() => {})
    mock.spyOn(redirectHelper, 'redirectToUrl').mockImplementation(() => {})
    mock.spyOn(dialog, 'displayDialog').mockImplementation(function ($elementToDisplay) {
      testScope.latestDialog$element = $elementToDisplay
      testScope.latestDialogControl = {
        closeDialog: mock.fn(),
        setAriaLive: mock.fn(),
        setAriaLabelledBy: mock.fn(),
        addCloseHandler: mock.fn().mockImplementation(function (fn) {
          testScope.latestDialogCloseCallback = fn
        })
      }
      return testScope.latestDialogControl
    })
    jest.useFakeTimers()
    testScope.minimumValidConfig = {
      timeout: 900,
      countdown: 120,
      keepAliveUrl: '/keep-alive',
      signOutUrl: '/sign-out'
    }
  })

  afterEach(function () {
    if (testScope.timeoutDialogControl && testScope.timeoutDialogControl.cleanup) {
      testScope.timeoutDialogControl.cleanup()
    }
    delete testScope.timeoutDialogControl
    dialog.displayDialog.mockReset()
    utils.ajaxGet.mockReset()
    redirectHelper.redirectToUrl.mockReset()
    jest.clearAllTimers()
  })

  describe('Delay before displaying', function () {
    it('should start countdown at 2.5 minutes', function () {
      setupDialog({timeout: 300, countdown: 30, title: 'one'})

      pretendSecondsHavePassed(269)

      expect(dialog.displayDialog).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(dialog.displayDialog).toHaveBeenCalled()
      expect(testScope.latestDialogControl.setAriaLive).not.toHaveBeenCalled()
      expect(testScope.latestDialogControl.setAriaLabelledBy).toHaveBeenCalledWith('timeout-message')
    })
  })

  describe('Timeout Dialog', function () {
    it('should start countdown at 13 minutes', function () {
      setupDialog({timeout: 900, countdown: 120, title: 'two'})

      pretendSecondsHavePassed(779)

      expect(dialog.displayDialog).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(dialog.displayDialog).toHaveBeenCalled()
    })
  })

  describe('the default options', function () {
    beforeEach(function () {
      setupDialog()
      pretendSecondsHavePassed(781)
    })

    it('should start with a polite screenreader tone', function () {
      expect(testScope.latestDialogControl.setAriaLive).toHaveBeenCalledWith('polite')
    })

    it('should not show heading', function () {
      expect(testScope.latestDialog$element.querySelector('h1.push--top')).toBeDefined()
    })

    it('should show message', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('For your security, we will sign you out in 2 minutes.')
    })

    it('should show keep signed in button', function () {
      expect(testScope.latestDialog$element.querySelector('button#timeout-keep-signin-btn.govuk-button').innerText).toEqual('Stay signed in')
    })

    it('should show sign out link', function () {
      expect(testScope.latestDialog$element.querySelector('a#timeout-sign-out-btn.govuk-link.link').innerText).toEqual('Sign out')
    })

    it('should redirect to default signout url when signout is clicked', function () {
      assume(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      clickElem(testScope.latestDialog$element.querySelector('#timeout-sign-out-btn'))
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('/sign-out')
    })

    it('should use the default signout url on the signout link', function () {
      var $signoutLink = testScope.latestDialog$element.querySelector('a#timeout-sign-out-btn')
      expect($signoutLink.attributes.getNamedItem('href').value).toEqual('/sign-out')
    })

    it('should AJAX call the keep alive URL when the keepalive button is clicked', function () {
      assume(testScope.latestDialogControl.closeDialog).not.toHaveBeenCalled()

      clickElem(testScope.latestDialog$element.querySelector('#timeout-keep-signin-btn'))

      expect(utils.ajaxGet).toHaveBeenCalledWith('/keep-alive', expect.any(Function))
      expect(testScope.latestDialogControl.closeDialog).toHaveBeenCalled()

      pretendSecondsHavePassed(130)
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled()
    })

    it('should AJAX call the keep alive URL when dialog is closed without using the button', function () {
      pretendDialogWasClosedWithoutButtonPress()

      expect(utils.ajaxGet).toHaveBeenCalledWith('/keep-alive', expect.any(Function))
      expect(utils.ajaxGet.mock.calls.length).toEqual(1)
    })
  })
  describe('the default welsh options', function () {
    beforeEach(function () {
      setLanguageToWelsh()
      setupDialog()
      pretendSecondsHavePassed(780)
    })

    it('should not show heading', function () {
      expect(testScope.latestDialog$element.querySelector('h1.push--top')).toBeNull()
    })

    it('should show message', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('Er eich diogelwch, byddwn yn eich allgofnodi cyn pen 2 funud.')
    })

    it('should show keep signed in button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('button#timeout-keep-signin-btn.govuk-button'))).toEqual('Parhau i fod wedi’ch mewngofnodi')
    })

    it('should show sign out button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('a#timeout-sign-out-btn.govuk-link.link'))).toEqual('Allgofnodi')
    })
  })

  it('should AJAX call the configured URL', function () {
    mock.spyOn(utils, 'ajaxGet').mockImplementation(() => {})

    setupDialog({
      timeout: 130,
      countdown: 120,
      keepAliveUrl: '/customKeepAlive'
    })

    pretendSecondsHavePassed(10)
    pretendDialogWasClosedWithoutButtonPress()

    expect(utils.ajaxGet).toHaveBeenCalledWith('/customKeepAlive', expect.any(Function))
    expect(utils.ajaxGet.mock.calls.length).toEqual(1)
  })

  describe('the configuration options', function () {
    beforeEach(function () {
      setupDialog({
        title: 'my custom TITLE',
        message: 'MY custom message',
        keepAliveButtonText: 'KEEP alive',
        signOutButtonText: 'sign OUT',
        signOutUrl: '/mySignOutUrl.html'
      })
      pretendSecondsHavePassed(780)
    })

    it('should show heading', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('h1'))).toEqual('my custom TITLE')
    })

    it('should show message', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('MY custom message 2 minutes.')
    })

    it('should show keep signed in button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-keep-signin-btn'))).toEqual('KEEP alive')
    })

    it('should show sign out button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('a#timeout-sign-out-btn.govuk-link.link'))).toEqual('sign OUT')
    })

    it('should redirect to default signout url when signout is clicked', function () {
      assume(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      expect(testScope.latestDialog$element.querySelector('#timeout-sign-out-btn')).not.toBeNull()

      clickElem(testScope.latestDialog$element.querySelector('#timeout-sign-out-btn'))
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('/mySignOutUrl.html')
    })
  })

  describe('Restarting countdown on close', function () {
    it('should restart with default settings', function () {
      setupDialog({message: 'time:'})

      pretendSecondsHavePassed(880)
      pretendDialogWasClosedWithoutButtonPress()
      dialog.displayDialog.mockClear()
      pretendSecondsHavePassed(880)

      expect(dialog.displayDialog).toHaveBeenCalled()
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 20 seconds.')
    })
  })
  describe('required configuration', function () {
    it('should fail when timeout is missing', function () {
      delete testScope.minimumValidConfig.timeout

      expect(function () {
        TimeoutDialog(testScope.minimumValidConfig)
      }).toThrow(new Error('Missing config item(s): [timeout]'))
    })

    it('should fail when countdown is missing', function () {
      delete testScope.minimumValidConfig.countdown

      expect(function () {
        TimeoutDialog(testScope.minimumValidConfig)
      }).toThrow(new Error('Missing config item(s): [countdown]'))
    })

    it('should fail when keepAliveUrl is missing', function () {
      delete testScope.minimumValidConfig.keepAliveUrl

      expect(function () {
        TimeoutDialog(testScope.minimumValidConfig)
      }).toThrow(new Error('Missing config item(s): [keepAliveUrl]'))
    })

    it('should fail when signOutUrl is missing', function () {
      delete testScope.minimumValidConfig.signOutUrl

      expect(function () {
        TimeoutDialog(testScope.minimumValidConfig)
      }).toThrow(new Error('Missing config item(s): [signOutUrl]'))
    })

    it('should fail when all config is missing', function () {
      expect(function () {
        TimeoutDialog({})
      }).toThrow(new Error('Missing config item(s): [timeout, countdown, keepAliveUrl, signOutUrl]'))
    })
  })

  describe('Cleanup', function () {
    var MINIMUM_TIME_UNTIL_MODAL_DISPLAYED = 10

    it('should not display the dialog if cleanup has already been called', function () {
      setupDialog({timeout: 130, countdown: 120})

      testScope.timeoutDialogControl.cleanup()
      pretendSecondsHavePassed(MINIMUM_TIME_UNTIL_MODAL_DISPLAYED)
      expect(dialog.displayDialog).not.toHaveBeenCalled()
    })

    it('should remove dialog when cleanup is called', function () {
      setupDialog({timeout: 130, countdown: 120})
      pretendSecondsHavePassed(MINIMUM_TIME_UNTIL_MODAL_DISPLAYED)
      assume(dialog.displayDialog).toHaveBeenCalled()

      testScope.timeoutDialogControl.cleanup()

      expect(testScope.latestDialogControl.closeDialog).toHaveBeenCalled()
    })
  })

  describe('Countdown timer', function () {
    it('should countdown minutes and then seconds in english', function () {
      setupDialog({
        timeout: 130,
        countdown: 120,
        message: 'time:',
        signOutUrl: 'logout'
      })

      pretendSecondsHavePassed(10)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 2 minutes.')
      pretendSecondsHavePassed(59)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 2 minutes.')
      expect(testScope.latestDialogControl.setAriaLive).not.toHaveBeenCalledWith()
      pretendSecondsHavePassed(1)

      expect(testScope.latestDialogControl.setAriaLive).toHaveBeenCalledWith()
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 1 minute.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 59 seconds.')
      pretendSecondsHavePassed(57)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 2 seconds.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 1 second.')
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 0 seconds.')
      pretendSecondsHavePassed(1)

      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('logout')
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: -1 seconds.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: -2 seconds.')
    })
    it('should countdown minutes and then seconds in welsh', function () {
      setLanguageToWelsh()
      setupDialog({
        timeout: 130,
        countdown: 120,
        message: 'time:',
        signOutUrl: 'logout'
      })

      pretendSecondsHavePassed(10)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 2 funud.')
      pretendSecondsHavePassed(59)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 2 funud.')
      expect(testScope.latestDialogControl.setAriaLive).not.toHaveBeenCalledWith()
      pretendSecondsHavePassed(1)

      expect(testScope.latestDialogControl.setAriaLive).toHaveBeenCalledWith()
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 1 funud.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 59 eiliad.')
      pretendSecondsHavePassed(57)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 2 eiliad.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 1 eiliad.')
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 0 eiliad.')
      pretendSecondsHavePassed(1)

      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('logout')
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: -1 eiliad.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: -2 eiliad.')
    })

    it('should countdown lots of minutes when countdown is long', function () {
      setupDialog({
        timeout: 1810,
        countdown: 1800,
        message: 'time:'
      })

      pretendSecondsHavePassed(10)
      assume(dialog.displayDialog).toHaveBeenCalled()
      expect(testScope.latestDialogControl.setAriaLive).toHaveBeenCalledWith('polite')

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 30 minutes.')
      pretendSecondsHavePassed(59)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 30 minutes.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 29 minutes.')
    })

    it('should countdown only seconds when the countdown is short', function () {
      setupDialog({
        timeout: 130,
        countdown: 50,
        message: 'time:',
        signOutUrl: 'logout'
      })

      pretendSecondsHavePassed(80)

      expect(testScope.latestDialogControl.setAriaLive).not.toHaveBeenCalled()
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 50 seconds.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 49 seconds.')
      pretendSecondsHavePassed(47)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 2 seconds.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 1 second.')
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 0 seconds.')
      pretendSecondsHavePassed(1)

      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('logout')
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: -1 seconds.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: -2 seconds.')
    })
  })
  describe('techy features', function () {
    it('should not rely on setInterval for countdown', function () {
      setupDialog({
        timeout: 80,
        countdown: 50,
        message: 'time:'
      })

      pretendSecondsHavePassed(29)

      assume(dialog.displayDialog).not.toHaveBeenCalled()
      pretendSecondsHavePassed(1)

      expect(dialog.displayDialog).toHaveBeenCalled()
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 50 seconds.')
      testScope.currentDateTime += 2 * 1000 // two seconds go by without any interval events
      pretendSecondsHavePassed(1)

      expect(dialog.displayDialog).toHaveBeenCalled()
      expect(getElemText(testScope.latestDialog$element.querySelector('#timeout-message'))).toEqual('time: 47 seconds.')
    })

    it('should clearInterval on cleanup', function () {
      var intervalReturn = {message: 'this has been returned from a spy'}
      jest.clearAllTimers()

      mock.spyOn(window, 'setInterval').mockReturnValue(intervalReturn)
      mock.spyOn(window, 'clearInterval').mockImplementation(() => {})
      mock.spyOn(window, 'setTimeout').mockImplementation(function (fn) {
        fn()
      })

      setupDialog({timeout: 130, countdown: 120})
      assume(window.setInterval).toHaveBeenCalled()
      assume(window.clearInterval).not.toHaveBeenCalled()

      testScope.timeoutDialogControl.cleanup()
      expect(window.clearInterval).toHaveBeenCalledWith(intervalReturn)
    })

    it('should clearInterval on closeDialog', function () {
      var intervalReturn = {message: 'this has been returned from a spy'}
      jest.clearAllTimers()

      mock.spyOn(window, 'setInterval').mockReturnValue(intervalReturn)
      mock.spyOn(window, 'clearInterval').mockImplementation(() => {})
      mock.spyOn(window, 'setTimeout').mockImplementation(function (fn) {
        fn()
      })

      setupDialog({timeout: 130, countdown: 120})
      assume(window.setInterval).toHaveBeenCalled()
      assume(window.clearInterval).not.toHaveBeenCalled()

      testScope.latestDialogCloseCallback()
      expect(window.clearInterval).toHaveBeenCalledWith(intervalReturn)
    })
  })
})

function getElemText (elem) {
  if (!elem) {
    throw new Error('Can\'t get text from an element that doesn\'t exist.')
  }
  let out = elem.innerText
  for (let i = 0; i < elem.childNodes.length; i++) {
    let child = elem.childNodes[i]
    if (child.nodeType === 3) {
      out += child.textContent
    } else {
      out += child.innerText
    }
  }
  return out
}

function clickElem (elem) {
  if (!elem) {
    throw new Error('Can\'t click an element that doesn\'t exist.')
  }
  var e = document.createEvent('Events')
  e.initEvent('click', true, true, window, 1)
  elem.dispatchEvent(e)
}
