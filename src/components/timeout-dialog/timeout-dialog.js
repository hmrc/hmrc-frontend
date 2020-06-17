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
  var currentTimer

  cleanupFunctions.push(function () {
    if (currentTimer) {
      window.clearTimeout(currentTimer)
    }
  })

  function init () {
    var validate = ValidateInput

    function lookupData (key) {
      return ($module.attributes.getNamedItem(key) || {}).value
    }

    var localisedDefaults = validate.string(lookupData('data-language')) === 'cy' ? {
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
    } : {
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

    options = {
      timeout: validate.int(lookupData('data-timeout')),
      countdown: validate.int(lookupData('data-countdown')),
      keepAliveUrl: validate.string(lookupData('data-keep-alive-url')),
      signOutUrl: validate.string(lookupData('data-sign-out-url')),
      title: validate.string(lookupData('data-title')),
      message: validate.string(lookupData('data-message')),
      messageSuffix: validate.string(lookupData('data-message-suffix')),
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

  function wrapLink ($elem) {
    var $wrapper = document.createElement('div')
    $wrapper.classList.add('hmrc-timeout-dialog__link-wrapper')
    $wrapper.appendChild($elem)

    return $wrapper
  }

  function setupDialog () {
    var $element = utils.generateDomElementFromString('<div>')

    if (settings.title) {
      var $tmp = utils.generateDomElementFromStringAndAppendText(
        '<h1 class="govuk-heading-m push--top">',
        settings.title
      )
      $element.appendChild($tmp)
    }

    var $countdownElement = utils.generateDomElementFromString(
      '<span id="hmrc-timeout-countdown" class="hmrc-timeout-dialog__countdown">'
    )

    var $timeoutMessage = utils.generateDomElementFromStringAndAppendText(
      '<p id="hmrc-timeout-message" class="govuk-body hmrc-timeout-dialog__message" role="text">',
      settings.message
    )
    $timeoutMessage.appendChild(document.createTextNode(' '))
    $timeoutMessage.appendChild($countdownElement)
    $timeoutMessage.appendChild(document.createTextNode('.'))
    if (settings.messageSuffix) {
      $timeoutMessage.appendChild(document.createTextNode(' ' + settings.messageSuffix))
    }

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

    $element.appendChild($timeoutMessage)
    $element.appendChild(wrapLink($staySignedInButton))
    $element.appendChild(document.createTextNode(' '))
    $element.appendChild(wrapLink($signOutButton))

    var dialogControl = dialog.displayDialog($element)

    cleanupFunctions.push(function () {
      dialogControl.closeDialog()
    })

    dialogControl.addCloseHandler(keepAliveAndClose)

    dialogControl.setAriaLabelledBy('hmrc-timeout-message')
    if (getSecondsRemaining() > 60) {
      dialogControl.setAriaLive('assertive')
    }

    startCountdown($countdownElement)
  }

  function getSecondsRemaining () {
    return Math.floor((settings.signout_time - getDateNow()) / 1000)
  }

  function updateIfChanged ($parent, selector, text) {
    var $elem = $parent.querySelector(selector)
    if ($elem && $elem.innerText !== text) {
      $elem.innerText = text
    }
  }

  function startCountdown ($countdownElement) {
    var audibleUpdateRate = 20

    function createVisualAndAudioMessages ($countdownElement, visualMessage, audibleMessage) {
      if (!$countdownElement.querySelector('.govuk-visually-hidden')) {
        var $visualDisplay = document.createElement('span')
        var $audibleDisplay = document.createElement('span')
        $visualDisplay.setAttribute('aria-hidden', 'true')
        $audibleDisplay.setAttribute('class', 'govuk-visually-hidden')
        $audibleDisplay.setAttribute('aria-live', 'assertive')
        $countdownElement.innerHTML = ''
        $countdownElement.appendChild($visualDisplay)
        $countdownElement.appendChild($audibleDisplay)
      }
      updateIfChanged($countdownElement, '[aria-hidden=true]', visualMessage)
      updateIfChanged($countdownElement, '.govuk-visually-hidden', audibleMessage)
    }

    function getHumanText (counter, visibleMessage) {
      var minutes
      if (counter < 60) {
        visibleMessage = counter + ' ' + settings.properties[counter !== 1 ? 'seconds' : 'second']
      } else {
        minutes = Math.ceil(counter / 60)
        visibleMessage = minutes + ' ' + settings.properties[minutes === 1 ? 'minute' : 'minutes']
      }
      return visibleMessage
    }

    function updateCountdown (counter, $countdownElement) {
      var visibleMessage
      var audibleMessage
      var audibleCount

      visibleMessage = getHumanText(counter)
      if (counter <= 60) {
        audibleCount = Math.ceil(counter / audibleUpdateRate) * audibleUpdateRate
        audibleMessage = getHumanText(audibleCount > 0 ? audibleCount : audibleUpdateRate)
      }

      if (audibleMessage) {
        createVisualAndAudioMessages($countdownElement, visibleMessage, audibleMessage)
      } else {
        $countdownElement.innerText = visibleMessage
      }
    }

    function runUpdate () {
      var counter = getSecondsRemaining()
      updateCountdown(counter, $countdownElement)
      if (counter <= 0) {
        signOut()
      }
      currentTimer = window.setTimeout(runUpdate, counter > 60 ? 60000 : 1000)
    }

    runUpdate()
  }

  function keepAliveAndClose () {
    cleanup()
    setupDialogTimer()
    utils.ajaxGet(settings.keepAliveUrl, function () {
    })
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

  return {init: init, cleanup: cleanup}
}

TimeoutDialog.dialog = dialog
TimeoutDialog.redirectHelper = RedirectHelper
TimeoutDialog.utils = utils

export default TimeoutDialog
