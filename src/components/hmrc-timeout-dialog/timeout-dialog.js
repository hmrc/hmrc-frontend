import '../../vendor/polyfills/Array/prototype/forEach'
import '../../vendor/polyfills/Object/assign'
import '../../vendor/polyfills/Object/keys'
import '../../vendor/polyfills/Date/now'

import dialog from './dialog.js'
import ValidateInput from './validate-input.js'
import RedirectHelper from './redirectHelper.js'
import utils from './utils.js'

// TODO: rewruite this to follow govuk-frontend's protoytpe module pattern
function TimeoutDialog ($module) {
  var options = {}
  var settings = {}
  var cleanupFunctions = []
  var localisedDefaults = (readCookie('PLAY_LANG') &&
    readCookie('PLAY_LANG') === 'cy' && {
      title: undefined,
      message: 'Er eich diogelwch, byddwn yn eich allgofnodi cyn pen',
      keepAliveButtonText: 'Parhau i fod wedi’ch mewngofnodi',
      signOutButtonText: 'Allgofnodi',
      properties: {
        minutes: 'funud',
        minute: 'funud',
        seconds: 'eiliad',
        second: 'eiliad'
      }
    }) || {
      title: undefined,
      message: 'For your security, we will sign you out in',
      keepAliveButtonText: 'Stay signed in',
      signOutButtonText: 'Sign out',
      properties: {
        minutes: 'minutes',
        minute: 'minute',
        seconds: 'seconds',
        second: 'second'
      }
    }

  function init () {
    var validate = ValidateInput

    function lookupData (key) {
      return ($module.attributes.getNamedItem(key) || {}).value
    }

    options = {
      timeout: validate.int(lookupData('data-timeout')),
      countdown: validate.int(lookupData('data-countdown')),
      keepAliveUrl: validate.string(lookupData('data-keep-alive-url')),
      signOutUrl: validate.string(lookupData('data-sign-out-url')),
      title: validate.string(lookupData('data-title')),
      message: validate.string(lookupData('data-message')),
      keepAliveButtonText: validate.string(
        lookupData('data-keep-alive-button-text')
      ),
      signOutButtonText: validate.string(
        lookupData('data-sign-out-button-text')
      )
    }

    validateInput(options)
    settings = mergeOptionsWithDefaults(options, localisedDefaults)
    setupDialogTimer()
  }

  function validateInput (config) {
    var requiredConfig = ['timeout', 'countdown', 'keepAliveUrl', 'signOutUrl']
    var missingRequiredConfig = []

    requiredConfig.forEach(function (item) {
      if (!config.hasOwnProperty(item) || !config[item]) {
        missingRequiredConfig.push('data-' + item.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
      }
    })

    if (missingRequiredConfig.length > 0) {
      throw new Error(
        'Missing config item(s): [' + missingRequiredConfig.join(', ') + ']'
      )
    }
  }

  function mergeOptionsWithDefaults (options, localisedDefaults) {
    var clone = Object.assign({}, options)

    Object.keys(localisedDefaults).forEach(function (key) {
      if (typeof clone[key] === 'object') {
        clone[key] = mergeOptionsWithDefaults(
          options[key],
          localisedDefaults[key]
        )
      }
      if (clone[key] === undefined || clone[key] === '') {
        clone[key] = localisedDefaults[key]
      }
    })

    return clone
  }

  function setupDialogTimer () {
    settings.signout_time = getDateNow() + settings.timeout * 1000

    var timeout = window.setTimeout(function () {
      setupDialog()
    }, (settings.timeout - settings.countdown) * 1000)

    cleanupFunctions.push(function () {
      window.clearTimeout(timeout)
    })
  }

  function setupDialog () {
    var $countdownElement = utils.generateDomElementFromString(
      '<span id="hmrc-timeout-countdown" class="hmrc-timeout-dialog__countdown">'
    )
    var $element = utils.generateDomElementFromString('<div>')

    if (settings.title) {
      var $tmp = utils.generateDomElementFromStringAndAppendText(
        '<h1 class="govuk-heading-m push--top">',
        settings.title
      )
      $element.appendChild($tmp)
    }

    var $timeoutMessage = utils.generateDomElementFromStringAndAppendText(
      '<p id="hmrc-timeout-message" class="govuk-body hmrc-timeout-dialog__message" role="text">',
      settings.message
    )
    var $staySignedInButton = utils.generateDomElementFromStringAndAppendText(
      '<button id="hmrc-timeout-keep-signin-btn" class="govuk-button">',
      settings.keepAliveButtonText
    )
    var $signOutButton = utils.generateDomElementFromStringAndAppendText(
      '<a id="hmrc-timeout-sign-out-link" class="govuk-link hmrc-timeout-dialog__link">',
      settings.signOutButtonText
    )

    $staySignedInButton.addEventListener('click', keepAliveAndClose)
    $signOutButton.addEventListener('click', signOut)
    $signOutButton.setAttribute('href', settings.signOutUrl)

    $timeoutMessage.appendChild(document.createTextNode(' '))
    $timeoutMessage.appendChild($countdownElement)
    $timeoutMessage.appendChild(document.createTextNode('.'))

    $element.appendChild($timeoutMessage)
    $element.appendChild($staySignedInButton)
    $element.appendChild(document.createTextNode(' '))
    $element.appendChild($signOutButton)

    var dialogControl = dialog.displayDialog($element)

    cleanupFunctions.push(function () {
      dialogControl.closeDialog()
    })

    dialogControl.addCloseHandler(keepAliveAndClose)

    dialogControl.setAriaLabelledBy('hmrc-timeout-message')
    if (getSecondsRemaining() > 60) {
      dialogControl.setAriaLive('polite')
    }

    startCountdown($countdownElement, dialogControl)
  }

  function getSecondsRemaining () {
    return Math.floor((settings.signout_time - getDateNow()) / 1000)
  }

  function startCountdown ($countdownElement, dialogControl) {
    function updateCountdown (counter, $countdownElement) {
      var message
      if (counter === 60) {
        dialogControl.setAriaLive()
      }
      if (counter < 60) {
        message = counter + ' ' + settings.properties[counter !== 1 ? 'seconds' : 'second']
      } else {
        var minutes = Math.ceil(counter / 60)
        message = minutes + ' ' + settings.properties[minutes === 1 ? 'minute' : 'minutes']
      }
      $countdownElement.innerText = message
    }

    function runUpdate () {
      var counter = getSecondsRemaining()
      updateCountdown(counter, $countdownElement)
      if (counter <= 0) {
        signOut()
      }
    }

    var countdown = window.setInterval(runUpdate, 1000)
    cleanupFunctions.push(function () {
      window.clearInterval(countdown)
    })
    runUpdate()
  }

  function keepAliveAndClose () {
    cleanup()
    setupDialogTimer()
    utils.ajaxGet(settings.keepAliveUrl, function () { })
  }

  function getDateNow () {
    return Date.now()
  }

  function signOut () {
    RedirectHelper.redirectToUrl(settings.signOutUrl)
  }

  function cleanup () {
    while (cleanupFunctions.length > 0) {
      var fn = cleanupFunctions.shift()
      fn()
    }
  }

  function readCookie (cookieName) { // From http://www.javascripter.net/faq/readingacookie.htm
    var re = new RegExp('[; ]' + cookieName + '=([^\\s;]*)')
    var sMatch = (' ' + document.cookie).match(re)
    if (cookieName && sMatch) return unescape(sMatch[1])
    return ''
  }

  return { init: init, cleanup: cleanup }
}

TimeoutDialog.dialog = dialog
TimeoutDialog.redirectHelper = RedirectHelper
TimeoutDialog.utils = utils

export default TimeoutDialog
