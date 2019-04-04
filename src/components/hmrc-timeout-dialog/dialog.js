import utils from './utils'

function displayDialog ($elementToDisplay) {
  var $dialog = utils.generateDomElementFromString('<div id="timeout-dialog" tabindex="-1" role="dialog" class="timeout-dialog">')
  var $overlay = utils.generateDomElementFromString('<div id="timeout-overlay" class="timeout-overlay">')
  var $preparedElementToDisplay = typeof $elementToDisplay === 'string' ? utils.generateDomElementFromString($elementToDisplay) : $elementToDisplay
  var resetElementsFunctionList = []
  var closeCallbacks = []

  $dialog.appendChild($preparedElementToDisplay)

  if (!utils.hasClass('html', 'noScroll')) {
    utils.addClass('html', 'noScroll')
    resetElementsFunctionList.push(function () {
      utils.removeClass('html', 'noScroll')
    })
  }
  document.body.appendChild($dialog)
  document.body.appendChild($overlay)

  resetElementsFunctionList.push(function () {
    utils.removeElement($dialog)
    utils.removeElement($overlay)
  })

  // disable the non-dialog page to prevent confusion for VoiceOver users
  document.querySelectorAll('#skiplink-container, body>header, #global-cookie-message, body>main, body>footer').forEach(function ($elem) {
    var value = $elem.getAttribute('aria-hidden')
    $elem.setAttribute('aria-hidden', 'true')
    resetElementsFunctionList.push(function () {
      if (value) {
        $elem.setAttribute('aria-hidden', value)
      } else {
        $elem.removeAttribute('aria-hidden')
      }
    })
  })
  //
  setupFocusHandlerAndFocusDialog()
  setupKeydownHandler()
  preventMobileScrollWhileAllowingPinchZoom()

  function close () {
    while (resetElementsFunctionList.length > 0) {
      var fn = resetElementsFunctionList.shift()
      fn()
    }
  }

  function closeAndInform () {
    closeCallbacks.forEach(fn => fn())
    close()
  }

  function setupFocusHandlerAndFocusDialog () {
    function keepFocus (event) {
      var modalFocus = document.getElementById('timeout-dialog')
      if (modalFocus) {
        if (event.target !== modalFocus && !modalFocus.contains(event.target)) {
          event.stopPropagation()
          modalFocus.focus()
        }
      }
    }

    var elemToFocusOnReset = document.activeElement
    $dialog.focus()

    document.addEventListener('focus', keepFocus, true)

    resetElementsFunctionList.push(function () {
      document.removeEventListener('focus', keepFocus)
      elemToFocusOnReset.focus()
    })
  }

  function setupKeydownHandler () {
    function keydownListener (e) {
      if (e.keyCode === 27) {
        closeAndInform()
      }
    }

    document.addEventListener('keydown', keydownListener)

    resetElementsFunctionList.push(function () {
      document.removeEventListener('keydown', keydownListener)
    })
  }

  function preventMobileScrollWhileAllowingPinchZoom () {
    function handleTouch (e) {
      var touches = e.touches || e.changedTouches || []

      if (touches.length === 1) {
        e.preventDefault()
      }
    }

    document.addEventListener('touchmove', handleTouch, true)

    resetElementsFunctionList.push(function () {
      document.removeEventListener('touchmove', handleTouch, true)
    })
  }

  function createSetterFunctionForAttributeOfDialog (attributeName) {
    return function (value) {
      if (value) {
        $dialog.setAttribute(attributeName, value)
      } else {
        $dialog.removeAttribute(attributeName)
      }
    }
  }

  return {
    closeDialog: function () {
      close()
    },
    setAriaLive: createSetterFunctionForAttributeOfDialog('aria-live'),
    setAriaLabelledBy: createSetterFunctionForAttributeOfDialog('aria-labelledby'),
    addCloseHandler: function (closeHandler) {
      closeCallbacks.push(closeHandler)
    }
  }
}

export default {displayDialog}
