/* eslint-env jest */
const mock = require('jest-mock')

const TimeoutDialog = require('../../../public/components/timeout-dialog/timeout-dialog')
const dialog = TimeoutDialog.dialog
const redirectHelper = TimeoutDialog.redirectHelper
const utils = TimeoutDialog.utils

describe('/components/timeout-dialog', () => {
  var assume
  var testScope // an object which is reset between test runs
  const audibleCountSelector = '#hmrc-timeout-message .govuk-visually-hidden'
  const visualCountSelector = '#hmrc-timeout-message [aria-hidden=true]'

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
    const $TimeoutDialog = document.createElement('meta')
    $TimeoutDialog.setAttribute('name', 'hmrc-timeout-dialog')

    const config = Object.assign({}, testScope.minimumValidConfig, partialConfig)

    for (let item in config) {
      $TimeoutDialog.setAttribute(item, config[item])
    }

    testScope.timeoutDialogControl = new TimeoutDialog($TimeoutDialog)
    testScope.timeoutDialogControl.init()
  }

  function setLanguageToWelsh () {
    testScope.minimumValidConfig['data-language'] = 'cy'
  }

  beforeEach(function () {
    assume = expect
    testScope = {
      currentDateTime: 1554196031049 // the time these tests were written - this can change but it's best not to write randomness into tests
    }
    mock.spyOn(Date, 'now').mockImplementation(function () {
      return testScope.currentDateTime
    })
    mock.spyOn(utils, 'ajaxGet').mockImplementation(() => { })
    mock.spyOn(redirectHelper, 'redirectToUrl').mockImplementation(() => { })
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
      'data-timeout': 900,
      'data-countdown': 120,
      'data-keep-alive-url': '/keep-alive',
      'data-sign-out-url': '/sign-out'
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
      setupDialog({ 'data-timeout': 300, 'data-countdown': 30, 'data-title': 'one' })

      pretendSecondsHavePassed(269)

      expect(dialog.displayDialog).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(dialog.displayDialog).toHaveBeenCalled()
      expect(testScope.latestDialogControl.setAriaLive).not.toHaveBeenCalled()
      expect(testScope.latestDialogControl.setAriaLabelledBy).toHaveBeenCalledWith('hmrc-timeout-message')
    })
  })

  describe('Timeout Dialog', function () {
    it('should start countdown at 13 minutes', function () {
      setupDialog({ 'data-timeout': 900, 'data-countdown': 120, 'data-title': 'two' })

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
      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('For your security, we will sign you out in 2 minutes.')
    })

    it('should show keep signed in button', function () {
      expect(testScope.latestDialog$element.querySelector('button#hmrc-timeout-keep-signin-btn.govuk-button').innerText).toEqual('Stay signed in')
    })

    it('should show sign out link', function () {
      expect(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link').innerText).toEqual('Sign out')
    })

    it('should redirect to signout url when signout is clicked', function () {
      assume(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      clickElem(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link'))
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('/sign-out')
    })

    it('should use the signout url on the signout link', function () {
      var $signoutLink = testScope.latestDialog$element.querySelector('a#hmrc-timeout-sign-out-link')
      expect($signoutLink.attributes.getNamedItem('href').value).toEqual('/sign-out')
    })

    it('should AJAX call the keep alive URL when the keepalive button is clicked', function () {
      assume(testScope.latestDialogControl.closeDialog).not.toHaveBeenCalled()

      clickElem(testScope.latestDialog$element.querySelector('#hmrc-timeout-keep-signin-btn'))

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
      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('Er eich diogelwch, byddwn yn eich allgofnodi cyn pen 2 funud.')
    })

    it('should show keep signed in button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('button#hmrc-timeout-keep-signin-btn.govuk-button'))).toEqual('Parhau i fod wedi’ch mewngofnodi')
    })

    it('should show sign out button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('a#hmrc-timeout-sign-out-link'))).toEqual('Allgofnodi')
    })
  })

  it('should AJAX call the configured URL', function () {
    mock.spyOn(utils, 'ajaxGet').mockImplementation(() => { })

    setupDialog({
      'data-timeout': 130,
      'data-countdown': 120,
      'data-keep-alive-url': '/customKeepAlive'
    })

    pretendSecondsHavePassed(10)
    pretendDialogWasClosedWithoutButtonPress()

    expect(utils.ajaxGet).toHaveBeenCalledWith('/customKeepAlive', expect.any(Function))
    expect(utils.ajaxGet.mock.calls.length).toEqual(1)
  })

  describe('the default options when empty strings are provided', function () {
    beforeEach(function () {
      setupDialog({
        'data-title': '',
        'data-message': '',
        'data-keep-alive-button-text': '',
        'data-sign-out-button-text': ''
      })
      pretendSecondsHavePassed(780)
    })

    it('should not show heading', function () {
      expect(testScope.latestDialog$element.querySelector('h1')).toBeNull()
    })

    it('should show message', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('For your security, we will sign you out in 2 minutes.')
    })

    it('should show keep signed in button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-keep-signin-btn'))).toEqual('Stay signed in')
    })

    it('should show sign out button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('a#hmrc-timeout-sign-out-link'))).toEqual('Sign out')
    })
  })

  describe('the configuration options', function () {
    beforeEach(function () {
      setupDialog({
        'data-title': 'my custom TITLE',
        'data-message': 'MY custom message',
        'data-message-suffix': 'My message suffix.',
        'data-keep-alive-button-text': 'KEEP alive',
        'data-sign-out-button-text': 'sign OUT',
        'data-sign-out-url': '/mySignOutUrl.html'
      })
      pretendSecondsHavePassed(780)
    })

    it('should show heading', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('h1'))).toEqual('my custom TITLE')
    })

    it('should show message', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('MY custom message 2 minutes. My message suffix.')
    })

    it('should show keep signed in button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-keep-signin-btn'))).toEqual('KEEP alive')
    })

    it('should show sign out button', function () {
      expect(getElemText(testScope.latestDialog$element.querySelector('a#hmrc-timeout-sign-out-link'))).toEqual('sign OUT')
    })

    it('should redirect to default signout url when signout is clicked', function () {
      assume(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      expect(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link')).not.toBeNull()

      clickElem(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link'))
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('/mySignOutUrl.html')
    })
  })

  describe('Restarting countdown on close', function () {
    it('should restart with default settings', function () {
      setupDialog({ 'data-message': 'time:' })

      pretendSecondsHavePassed(880)
      pretendDialogWasClosedWithoutButtonPress()
      dialog.displayDialog.mockClear()
      pretendSecondsHavePassed(880)

      expect(dialog.displayDialog).toHaveBeenCalled()
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('20 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('20 seconds')
    })
  })

  describe('required configuration', function () {
    it('should fail when timeout is missing', function () {
      delete testScope.minimumValidConfig['data-timeout']

      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-timeout]')
    })

    it('should fail when countdown is missing', function () {
      delete testScope.minimumValidConfig['data-countdown']

      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-countdown]')
    })

    it('should fail when keepAliveUrl is missing', function () {
      delete testScope.minimumValidConfig['data-keep-alive-url']

      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-keep-alive-url]')
    })

    it('should fail when signOutUrl is missing', function () {
      delete testScope.minimumValidConfig['data-sign-out-url']

      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-sign-out-url]')
    })

    it('should fail when all config is missing', function () {
      testScope.minimumValidConfig = {}
      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-timeout, data-countdown, data-keep-alive-url, data-sign-out-url]')
    })

    it('should fail when timeout is empty', function () {
      testScope.minimumValidConfig['data-timeout'] = ''

      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-timeout]')
    })

    it('should fail when countdown is empty', function () {
      testScope.minimumValidConfig['data-countdown'] = ''

      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-countdown]')
    })

    it('should fail when keepAliveUrl is empty', function () {
      testScope.minimumValidConfig['data-keep-alive-url'] = ''

      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-keep-alive-url]')
    })

    it('should fail when signOutUrl is empty', function () {
      testScope.minimumValidConfig['data-sign-out-url'] = ''

      expect(function () {
        setupDialog()
      }).toThrowError('Missing config item(s): [data-sign-out-url]')
    })
  })

  describe('Cleanup', function () {
    var MINIMUM_TIME_UNTIL_MODAL_DISPLAYED = 10

    it('should not display the dialog if cleanup has already been called', function () {
      setupDialog({ 'data-timeout': 130, 'data-countdown': 120 })

      testScope.timeoutDialogControl.cleanup()
      pretendSecondsHavePassed(MINIMUM_TIME_UNTIL_MODAL_DISPLAYED)
      expect(dialog.displayDialog).not.toHaveBeenCalled()
    })

    it('should remove dialog when cleanup is called', function () {
      setupDialog({ 'data-timeout': 130, 'data-countdown': 120 })
      pretendSecondsHavePassed(MINIMUM_TIME_UNTIL_MODAL_DISPLAYED)
      assume(dialog.displayDialog).toHaveBeenCalled()

      testScope.timeoutDialogControl.cleanup()

      expect(testScope.latestDialogControl.closeDialog).toHaveBeenCalled()
    })
  })

  describe('Countdown timer', function () {
    it('should countdown minutes and then seconds in english', function () {
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 120,
        'data-message': 'time:',
        'data-sign-out-url': 'logout'
      })

      pretendSecondsHavePassed(10)

      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('time: 2 minutes.')
      pretendSecondsHavePassed(59)

      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('time: 2 minutes.')
      expect(testScope.latestDialogControl.setAriaLive).not.toHaveBeenCalledWith()
      pretendSecondsHavePassed(1)

      expect(testScope.latestDialogControl.setAriaLive).toHaveBeenCalledWith()
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('1 minute')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('1 minute')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('59 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('1 minute')
      pretendSecondsHavePassed(57)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('2 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('20 seconds')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('1 second')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('20 seconds')
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('0 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('0 seconds')
      pretendSecondsHavePassed(1)

      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('logout')
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('-1 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('0 seconds')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('-2 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('0 seconds')
    })
    it('should have an audio countdown which counts the last minute in 20 second decrements', function () {
      setupDialog({
        'data-timeout': 70,
        'data-countdown': 65,
        'data-message': 'time:',
        'data-sign-out-url': 'logout'
      })

      pretendSecondsHavePassed(10)
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('1 minute')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('1 minute')

      pretendSecondsHavePassed(1)
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('59 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('1 minute')

      pretendSecondsHavePassed(18)
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('41 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('1 minute')

      pretendSecondsHavePassed(1)
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('40 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('40 seconds')

      pretendSecondsHavePassed(1)
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('39 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('40 seconds')

      pretendSecondsHavePassed(18)
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('21 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('40 seconds')

      pretendSecondsHavePassed(1)
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('20 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('20 seconds')

      pretendSecondsHavePassed(1)
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('19 seconds')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('20 seconds')
    })
    it('should countdown minutes and then seconds in welsh', function () {
      setLanguageToWelsh()
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 120,
        'data-message': 'time:',
        'data-sign-out-url': 'logout'
      })

      pretendSecondsHavePassed(10)

      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('time: 2 funud.')
      pretendSecondsHavePassed(59)

      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('time: 2 funud.')
      expect(testScope.latestDialogControl.setAriaLive).not.toHaveBeenCalledWith()
      pretendSecondsHavePassed(1)

      expect(testScope.latestDialogControl.setAriaLive).toHaveBeenCalledWith()
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('1 funud')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('1 funud')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('59 eiliad')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('1 funud')
      pretendSecondsHavePassed(57)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('2 eiliad')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('20 eiliad')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('1 eiliad')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('20 eiliad')
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('0 eiliad')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('0 eiliad')
      pretendSecondsHavePassed(1)

      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('logout')
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('-1 eiliad')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('0 eiliad')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('-2 eiliad')
      expect(getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector))).toEqual('0 eiliad')
    })

    it('should countdown lots of minutes when countdown is long', function () {
      setupDialog({
        'data-timeout': 1810,
        'data-countdown': 1800,
        'data-message': 'time:'
      })

      pretendSecondsHavePassed(10)
      assume(dialog.displayDialog).toHaveBeenCalled()
      expect(testScope.latestDialogControl.setAriaLive).toHaveBeenCalledWith('polite')

      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('time: 30 minutes.')
      pretendSecondsHavePassed(59)

      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('time: 30 minutes.')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-message'))).toEqual('time: 29 minutes.')
    })

    it('should countdown only seconds when the countdown is short', function () {
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 50,
        'data-message': 'time:',
        'data-sign-out-url': 'logout'
      })

      pretendSecondsHavePassed(80)

      expect(testScope.latestDialogControl.setAriaLive).not.toHaveBeenCalled()
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('50 seconds')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('49 seconds')
      pretendSecondsHavePassed(47)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('2 seconds')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('1 second')
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled()

      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('0 seconds')
      pretendSecondsHavePassed(1)

      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('logout')
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('-1 seconds')
      pretendSecondsHavePassed(1)

      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('-2 seconds')
    })
  })
  describe('techy features', function () {
    it('should not rely on setInterval for countdown', function () {
      setupDialog({
        'data-timeout': 80,
        'data-countdown': 50,
        'data-message': 'time:'
      })

      pretendSecondsHavePassed(29)

      assume(dialog.displayDialog).not.toHaveBeenCalled()
      pretendSecondsHavePassed(1)

      expect(dialog.displayDialog).toHaveBeenCalled()
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('50 seconds')
      testScope.currentDateTime += 2 * 1000 // two seconds go by without any interval events
      pretendSecondsHavePassed(1)

      expect(dialog.displayDialog).toHaveBeenCalled()
      expect(getElemText(testScope.latestDialog$element.querySelector(visualCountSelector))).toEqual('47 seconds')
    })

    it('should clearInterval on cleanup', function () {
      var intervalReturn = { 'data-message': 'this has been returned from a spy' }
      jest.clearAllTimers()

      mock.spyOn(window, 'setInterval').mockReturnValue(intervalReturn)
      mock.spyOn(window, 'clearInterval').mockImplementation(() => { })
      mock.spyOn(window, 'setTimeout').mockImplementation(function (fn) {
        fn()
      })

      setupDialog({ 'data-timeout': 130, 'data-countdown': 120 })
      assume(window.setInterval).toHaveBeenCalled()
      assume(window.clearInterval).not.toHaveBeenCalled()

      testScope.timeoutDialogControl.cleanup()
      expect(window.clearInterval).toHaveBeenCalledWith(intervalReturn)
    })

    it('should clearInterval on closeDialog', function () {
      var intervalReturn = { 'data-message': 'this has been returned from a spy' }
      jest.clearAllTimers()

      mock.spyOn(window, 'setInterval').mockReturnValue(intervalReturn)
      mock.spyOn(window, 'clearInterval').mockImplementation(() => { })
      mock.spyOn(window, 'setTimeout').mockImplementation(function (fn) {
        fn()
      })

      setupDialog({ 'data-timeout': 130, 'data-countdown': 120 })
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
