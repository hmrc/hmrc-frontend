/* eslint-env jest */
const mock = require('jest-mock')
const expect = require('expect')
const dialog = require('../../../public/components/hmrc-timeout-dialog/dialog')
const utils = require('../../../public/components/hmrc-timeout-dialog/utils')

describe('Dialog', function () {
  var assume = expect
  var $DEFAULT_ELEMENT_TO_DISPLAY
  var testScope

  function pretendEscapeWasPressed () {
    triggerKeyPress(ESCAPE_KEY_CODE)
  }

  function pretendEverythingButEscapeWasPressed () {
    var keyCode = 256
    while (keyCode >= 0) {
      keyCode--
      if (keyCode !== ESCAPE_KEY_CODE) {
        triggerKeyPress(keyCode)
      }
    }
  }

  function triggerKeyPress (keyCode) {
    var e = document.createEvent('Events')
    e.initEvent('keydown', true, true, window, 1)
    e.keyCode = keyCode
    document.dispatchEvent(e)
  }

  var ESCAPE_KEY_CODE = 27

  beforeEach(function () {
    $DEFAULT_ELEMENT_TO_DISPLAY = utils.generateDomElementFromStringAndAppendText('<div id="added-to-dialog">', 'Dialog message')
    testScope = {}
  })

  afterEach(function () {
    if (testScope.dialogControl) {
      testScope.dialogControl.closeDialog()
    }
  })

  function openDefaultDialog () {
    testScope.closeCallback = mock.fn()
    testScope.dialogControl = dialog.displayDialog($DEFAULT_ELEMENT_TO_DISPLAY)
    testScope.dialogControl.addCloseHandler(testScope.closeCallback)
  }

  describe('When open', function () {
    beforeEach(function () {
      assume(document.querySelector('#timeout-overlay')).toBeNull()
      assume(document.querySelector('#timeout-dialog')).toBeNull()

      openDefaultDialog()
    })

    it('calling close should remove the elements', function () {
      assume(document.querySelector('#timeout-overlay.timeout-overlay')).not.toBeNull()
      assume(document.querySelector('#timeout-dialog.timeout-dialog')).not.toBeNull()

      testScope.dialogControl.closeDialog()

      expect(document.querySelector('#timeout-overlay')).toBeNull()
      expect(document.querySelector('#timeout-dialog')).toBeNull()
      expect(testScope.closeCallback).not.toHaveBeenCalled()
    })

    it('should be added to the dom with correct attributes', function () {
      var $overlay = document.querySelector('#timeout-overlay')
      var $dialog = document.querySelector('#timeout-dialog')

      expect($overlay).not.toBeNull()
      expect($overlay.classList).toContain('timeout-overlay')
      expect($dialog).not.toBeNull()
      expect($dialog.classList).toContain('timeout-dialog')
      expect($dialog.attributes.getNamedItem('role').value).toEqual('dialog')
      expect($dialog.attributes.getNamedItem('tabindex').value).toEqual('-1')
    })

    it('should be attached to the end of the body', function () {
      var $lastElement = document.querySelector('body').lastElementChild
      var $secondToLastElement = $lastElement.previousElementSibling

      expect($lastElement.id).toEqual('timeout-overlay')
      expect($secondToLastElement.id).toEqual('timeout-dialog')
    })

    // it('should contain provided element', function () {
    //   expect(document.querySelector('#timeout-dialog')).toContainElement($DEFAULT_ELEMENT_TO_DISPLAY)
    // })

    it('should hide when escape is pressed', function () {
      assume(testScope.closeCallback).not.toHaveBeenCalled()

      pretendEscapeWasPressed()

      expect(testScope.closeCallback).toHaveBeenCalled()
      expect(document.querySelector('#timeout-overlay')).toBeNull()
      expect(document.querySelector('#timeout-dialog')).toBeNull()
    })

    it('should only call callback once when escape is pressed many times', function () {
      assume(testScope.closeCallback).not.toHaveBeenCalled()

      pretendEscapeWasPressed()
      pretendEscapeWasPressed()
      pretendEscapeWasPressed()
      pretendEscapeWasPressed()
      pretendEscapeWasPressed()

      expect(testScope.closeCallback.mock.calls.length).toEqual(1)
    })

    it('should only call callback once when escape is pressed after closeDialog was called', function () {
      assume(testScope.closeCallback).not.toHaveBeenCalled()

      testScope.dialogControl.closeDialog()

      pretendEscapeWasPressed()

      expect(testScope.closeCallback).not.toHaveBeenCalled()
    })

    it('should hide when escape is pressed', function () {
      pretendEverythingButEscapeWasPressed()

      expect(document.querySelector('#timeout-dialog')).not.toBeNull()
      expect(document.querySelector('#timeout-overlay')).not.toBeNull()
      expect(testScope.closeCallback).not.toHaveBeenCalled()
    })

    it('should specify no background scroll', function () {
      expect(document.querySelector('html').classList).toContain('noScroll')
    })

    it('should remove no background scroll when closed with escape key', function () {
      pretendEscapeWasPressed()

      expect(document.querySelector('html').classList).not.toContain('noScroll')
    })

    it('should remove no background scroll when closed with control function', function () {
      testScope.dialogControl.closeDialog()

      expect(document.querySelector('html').classList).not.toContain('noScroll')
    })
  })

  it('should not remove noScroll class if it was set before opening', function () {
    document.querySelector('html').classList.add('noScroll')

    openDefaultDialog()
    pretendEscapeWasPressed()

    expect(document.querySelector('html').classList).toContain('noScroll')

    document.querySelector('html').classList.remove('noScroll') // to cleanup before the next test
  })

  it('should open with specified element', function () {
    const $root = utils.generateDomElementFromStringAndAppendText('<div id="my-custom-elem">', 'abcdef')

    testScope.dialogControl = dialog.displayDialog($root)

    let $dialogElem = document.querySelector('#timeout-dialog')

    expect($dialogElem.querySelector('#my-custom-elem')).toBe($root)
  })
  it('should not error when escape is pressed and no callback is provided', function () {
    testScope.dialogControl = dialog.displayDialog($DEFAULT_ELEMENT_TO_DISPLAY)

    expect(pretendEscapeWasPressed).not.toThrow()

    expect(document.querySelector('#timeout-dialog')).toBeNull()
    expect(document.querySelector('#timeout-overlay')).toBeNull()
  })

  describe('Manipulating page elements for dialog', function () {
    beforeEach(function () {
      const arr = testScope.elementsCreatedForThisTest = []

      if (!document.querySelector('#skiplink-container')) {
        arr.push(utils.generateDomElementFromString('<div id=skiplink-container>'))
      }
      if (!document.querySelector('#global-cookie-message')) {
        arr.push(utils.generateDomElementFromString('<div id=global-cookie-message>'))
      }
      if (!document.querySelector('body>header')) {
        arr.push(utils.generateDomElementFromString('<header>'))
      }
      if (!document.querySelector('body>main')) {
        arr.push(utils.generateDomElementFromString('<main>'))
      }
      if (!document.querySelector('body>footer')) {
        arr.push(utils.generateDomElementFromString('<footer>'))
      }
      arr.forEach($elem => document.body.appendChild($elem))
    })
    afterEach(function () {
      testScope.elementsCreatedForThisTest.forEach(function ($elem) {
        document.body.removeChild($elem)
      })
    })

    it('should set aria-hidden when dialog is open', function () {
      var selectors = [
        '#skiplink-container',
        'body>header',
        '#global-cookie-message',
        'body>main',
        'body>footer'
      ]
      selectors.forEach(function (selector) {
        assume(document.querySelectorAll(selector).length).toBe(1)
        assume(document.querySelector(selector).attributes.getNamedItem('aria-hidden')).toBeNull()
      })

      openDefaultDialog()

      selectors.forEach(function (selector) {
        expect(document.querySelector(selector).attributes.getNamedItem('aria-hidden').value).toEqual('true')
      })
    })

    it('should reset to previous values when closed', function () {
      assume(testScope.elementsCreatedForThisTest.length).toBeGreaterThanOrEqual(3)
      testScope.elementsCreatedForThisTest[0].setAttribute('aria-hidden', 'abcd')
      testScope.elementsCreatedForThisTest[1].setAttribute('aria-hidden', 'efgh')
      assume(testScope.elementsCreatedForThisTest[2].attributes.getNamedItem('aria-hidden')).toBeNull()

      openDefaultDialog()

      expect(testScope.elementsCreatedForThisTest[0].attributes.getNamedItem('aria-hidden').value).toEqual('true')
      expect(testScope.elementsCreatedForThisTest[1].attributes.getNamedItem('aria-hidden').value).toEqual('true')
      expect(testScope.elementsCreatedForThisTest[2].attributes.getNamedItem('aria-hidden').value).toEqual('true')

      pretendEscapeWasPressed()

      expect(testScope.elementsCreatedForThisTest[0].attributes.getNamedItem('aria-hidden').value).toEqual('abcd')
      expect(testScope.elementsCreatedForThisTest[1].attributes.getNamedItem('aria-hidden').value).toEqual('efgh')
      expect(testScope.elementsCreatedForThisTest[2].attributes.getNamedItem('aria-hidden')).toBeNull()
    })

    it('should allow aria-live to be set, reset and removed', function () {
      openDefaultDialog()
      var $dialog = document.querySelector('#timeout-dialog')

      expect($dialog.attributes.getNamedItem('aria-live')).toBeNull()

      testScope.dialogControl.setAriaLive('polite')

      expect($dialog.attributes.getNamedItem('aria-live').value).toEqual('polite')

      testScope.dialogControl.setAriaLive()

      expect($dialog.attributes.getNamedItem('aria-live')).toBeNull()
    })

    it('should allow aria-labelledby to be set, reset and removed', function () {
      openDefaultDialog()
      var $dialog = document.querySelector('#timeout-dialog')

      expect($dialog.attributes.getNamedItem('aria-labelledby')).toBeNull()

      testScope.dialogControl.setAriaLabelledBy('element-id')

      expect($dialog.attributes.getNamedItem('aria-labelledby').value).toEqual('element-id')

      testScope.dialogControl.setAriaLabelledBy('something-else')

      expect($dialog.attributes.getNamedItem('aria-labelledby').value).toEqual('something-else')

      testScope.dialogControl.setAriaLabelledBy()

      expect($dialog.attributes.getNamedItem('aria-labelledby')).toBeNull()
    })

    describe('Focus control', function () {
      function expeectActiveElementToHaveId (id) {
        expect(document.activeElement.id || document.activeElement.outerHTML).toEqual(id)
      }

      function appendToBody ($elem) {
        testScope.elementsCreatedForThisTest.push($elem)
        document.body.appendChild($elem)
        return $elem
      }

      beforeEach(function () {
        const $focusElem = appendToBody(utils.generateDomElementFromStringAndAppendText('<a href=#>', 'abc'))
        $focusElem.setAttribute('id', 'the-element-with-the-focus')
        $focusElem.focus()
        appendToBody(utils.generateDomElementFromStringAndAppendText('<input>')).setAttribute('id', 'different-elem')
        appendToBody(utils.generateDomElementFromStringAndAppendText('<button>', 'abc'))
        appendToBody(utils.generateDomElementFromStringAndAppendText('<textarea>', 'abc'))
        appendToBody(utils.generateDomElementFromStringAndAppendText('<div tabindex="-1">', 'abc'))
        appendToBody(utils.generateDomElementFromStringAndAppendText('<div tabindex="10">', 'def'))
      })

      it('should take focus when opening', function () {
        openDefaultDialog()

        expeectActiveElementToHaveId('timeout-dialog')
      })

      it('should return the focus when closed', function () {
        document.querySelector('#the-element-with-the-focus').focus()
        expeectActiveElementToHaveId('the-element-with-the-focus')

        openDefaultDialog()
        testScope.dialogControl.closeDialog()

        expeectActiveElementToHaveId('the-element-with-the-focus')

        document.querySelector('#different-elem').focus()

        openDefaultDialog()
        pretendEscapeWasPressed()

        expeectActiveElementToHaveId('different-elem')
      })

      it('should not allow focus to move outside the dialog', function () {
        openDefaultDialog()

        appendToBody(utils.generateDomElementFromStringAndAppendText('<a href=#>', 'this was added after dialog open')).setAttribute('id', 'added-after-open')

        testScope.elementsCreatedForThisTest.forEach(function ($elem) {
          $elem.focus()
          expeectActiveElementToHaveId('timeout-dialog')
        })
      })

      it('should allow focus to move outside the dialog after closing', function () {
        openDefaultDialog()
        testScope.dialogControl.closeDialog()

        document.querySelector('#the-element-with-the-focus').focus()
        expeectActiveElementToHaveId('the-element-with-the-focus')

        document.querySelector('#different-elem').focus()
        expeectActiveElementToHaveId('different-elem')
      })

      it('should allow focus to move inside the dialog', function () {
        expeectActiveElementToHaveId('the-element-with-the-focus')

        testScope.dialogControl = dialog.displayDialog(utils.generateDomElementFromString('<div><a href=# id="button-a">Button A</a><a href=# id="button-b">Button B</a></div>'))

        document.querySelector('#button-a').focus()
        expeectActiveElementToHaveId('button-a')

        document.querySelector('#button-b').focus()
        expeectActiveElementToHaveId('button-b')

        testScope.dialogControl.closeDialog()

        expeectActiveElementToHaveId('the-element-with-the-focus')
      })
    })
  })

  describe('Zoom and Scroll on Mobile', function () {
    function simulateTouchmoveWithNumberOfFingers (n) {
      return triggerTouchmoveEventWith('touches', n)
    }

    function simulateNumberOfChangedTouches (n) {
      return triggerTouchmoveEventWith('changedTouches', n)
    }

    function triggerTouchmoveEventWith (arrayName, arrayLength) {
      var arr = []
      for (var i = 0; i < arrayLength; i++) {
        arr.push({})
      }
      var e = document.createEvent('Events')
      e.initEvent('touchmove', true, true)
      e[arrayName] = arr
      e.preventDefault = mock.fn()
      document.dispatchEvent(e)
      return e
    }

    beforeEach(function () {
      assume(document.querySelector('#timeout-dialog')).toBeNull()
      expect.extend({
        toHaveHadDefaultPrevented: function (received) {
          var result = {}
          var passMessage = ['Expected', received.type, 'event']
          result.pass = received.preventDefault.mock.calls.length > 0
          if (result.pass) {
            passMessage.push('not', 'to have had default prevented')
          } else {
            passMessage.push('to have had default prevented, but it wasn\'t prevented')
          }
          result.message = () => passMessage.join(' ')
          return result
        }
      })
    })
    it('should allow all combinations before dialog is open', function () {
      expect(simulateTouchmoveWithNumberOfFingers(1)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(2)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(3)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(4)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(5)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(1)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(2)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(3)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(4)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(5)).not.toHaveHadDefaultPrevented()
    })
    it('should disallow scroll while dialog is open', function () {
      openDefaultDialog()

      expect(simulateTouchmoveWithNumberOfFingers(1)).toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(1)).toHaveHadDefaultPrevented()
    })
    it('should allow pinch scroll while dialog is open', function () {
      openDefaultDialog()

      expect(simulateTouchmoveWithNumberOfFingers(2)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(2)).not.toHaveHadDefaultPrevented()
    })
    it('should allow other multifinger touches while dialog is open', function () {
      openDefaultDialog()

      expect(simulateTouchmoveWithNumberOfFingers(3)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(4)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(5)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(3)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(4)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(5)).not.toHaveHadDefaultPrevented()
    })
    it('should allow all combinations after dialog is closed', function () {
      expect(simulateTouchmoveWithNumberOfFingers(1)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(2)).not.toHaveHadDefaultPrevented()

      openDefaultDialog()
      testScope.dialogControl.closeDialog()

      expect(simulateTouchmoveWithNumberOfFingers(1)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(2)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(3)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(4)).not.toHaveHadDefaultPrevented()
      expect(simulateTouchmoveWithNumberOfFingers(5)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(1)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(2)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(3)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(4)).not.toHaveHadDefaultPrevented()
      expect(simulateNumberOfChangedTouches(5)).not.toHaveHadDefaultPrevented()
    })
  })
})
