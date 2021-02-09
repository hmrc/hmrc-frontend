/* eslint-env jest */
import mock from 'jest-mock';
import dialog from './dialog';
import utils from './utils';

describe('Dialog', () => {
  const assume = expect;
  const ESCAPE_KEY_CODE = 27;
  let $DEFAULT_ELEMENT_TO_DISPLAY;
  let testScope;

  const triggerKeyPress = (keyCode) => {
    const e = document.createEvent('Events');
    e.initEvent('keydown', true, true, window, 1);
    e.keyCode = keyCode;
    document.dispatchEvent(e);
  };

  const pretendEverythingButEscapeWasPressed = () => {
    let keyCode = 256;
    while (keyCode >= 0) {
      keyCode -= 1;
      if (keyCode !== ESCAPE_KEY_CODE) {
        triggerKeyPress(keyCode);
      }
    }
  };
  const pretendEscapeWasPressed = () => {
    triggerKeyPress(ESCAPE_KEY_CODE);
  };

  beforeEach(() => {
    $DEFAULT_ELEMENT_TO_DISPLAY = utils.generateDomElementFromStringAndAppendText('<div id="added-to-dialog">', 'Dialog message');
    testScope = {};
  });

  afterEach(() => {
    if (testScope.dialogControl) {
      testScope.dialogControl.closeDialog();
    }
  });

  function openDefaultDialog() {
    testScope.closeCallback = mock.fn();
    testScope.dialogControl = dialog.displayDialog($DEFAULT_ELEMENT_TO_DISPLAY);
    testScope.dialogControl.addCloseHandler(testScope.closeCallback);
  }

  describe('When open', () => {
    beforeEach(() => {
      assume(document.querySelector('#hmrc-timeout-overlay')).toBeNull();
      assume(document.querySelector('#hmrc-timeout-dialog')).toBeNull();

      openDefaultDialog();
    });

    it('calling close should remove the elements', () => {
      assume(document.querySelector('#hmrc-timeout-overlay.hmrc-timeout-overlay')).not.toBeNull();
      assume(document.querySelector('#hmrc-timeout-dialog.hmrc-timeout-dialog')).not.toBeNull();

      testScope.dialogControl.closeDialog();

      expect(document.querySelector('#hmrc-timeout-overlay')).toBeNull();
      expect(document.querySelector('#hmrc-timeout-dialog')).toBeNull();
      expect(testScope.closeCallback).not.toHaveBeenCalled();
    });

    it('should be added to the dom with correct attributes', () => {
      const $overlay = document.querySelector('#hmrc-timeout-overlay');
      const $dialog = document.querySelector('#hmrc-timeout-dialog');

      expect($overlay).not.toBeNull();
      expect($overlay.classList).toContain('hmrc-timeout-overlay');
      expect($dialog).not.toBeNull();
      expect($dialog.classList).toContain('hmrc-timeout-dialog');
      expect($dialog.attributes.getNamedItem('role').value).toEqual('dialog');
      expect($dialog.attributes.getNamedItem('tabindex').value).toEqual('-1');
    });

    it('should be attached to the end of the body', () => {
      const $lastElement = document.querySelector('body').lastElementChild;
      const $secondToLastElement = $lastElement.previousElementSibling;

      expect($lastElement.id).toEqual('hmrc-timeout-overlay');
      expect($secondToLastElement.id).toEqual('hmrc-timeout-dialog');
    });

    it('should hide when escape is pressed', () => {
      assume(testScope.closeCallback).not.toHaveBeenCalled();

      pretendEscapeWasPressed();

      expect(testScope.closeCallback).toHaveBeenCalled();
      expect(document.querySelector('#hmrc-timeout-overlay')).toBeNull();
      expect(document.querySelector('#hmrc-timeout-dialog')).toBeNull();
    });

    it('should only call callback once when escape is pressed many times', () => {
      assume(testScope.closeCallback).not.toHaveBeenCalled();

      pretendEscapeWasPressed();
      pretendEscapeWasPressed();
      pretendEscapeWasPressed();
      pretendEscapeWasPressed();
      pretendEscapeWasPressed();

      expect(testScope.closeCallback.mock.calls.length).toEqual(1);
    });

    it('should only call callback once when escape is pressed after closeDialog was called', () => {
      assume(testScope.closeCallback).not.toHaveBeenCalled();

      testScope.dialogControl.closeDialog();

      pretendEscapeWasPressed();

      expect(testScope.closeCallback).not.toHaveBeenCalled();
    });

    it('should hide when escape is pressed', () => {
      pretendEverythingButEscapeWasPressed();

      expect(document.querySelector('#hmrc-timeout-dialog')).not.toBeNull();
      expect(document.querySelector('#hmrc-timeout-overlay')).not.toBeNull();
      expect(testScope.closeCallback).not.toHaveBeenCalled();
    });

    it('should specify no background scroll', () => {
      expect(document.querySelector('html').classList).toContain('noScroll');
    });

    it('should remove no background scroll when closed with escape key', () => {
      pretendEscapeWasPressed();

      expect(document.querySelector('html').classList).not.toContain('noScroll');
    });

    it('should remove no background scroll when closed with control function', () => {
      testScope.dialogControl.closeDialog();

      expect(document.querySelector('html').classList).not.toContain('noScroll');
    });
  });

  it('should not remove noScroll class if it was set before opening', () => {
    document.querySelector('html').classList.add('noScroll');

    openDefaultDialog();
    pretendEscapeWasPressed();

    expect(document.querySelector('html').classList).toContain('noScroll');

    document.querySelector('html').classList.remove('noScroll'); // to cleanup before the next test
  });

  it('should open with specified element', () => {
    const $root = utils.generateDomElementFromStringAndAppendText('<div id="my-custom-elem">', 'abcdef');

    testScope.dialogControl = dialog.displayDialog($root);

    const $dialogElem = document.querySelector('#hmrc-timeout-dialog');

    expect($dialogElem.querySelector('#my-custom-elem')).toBe($root);
  });
  it('should not error when escape is pressed and no callback is provided', () => {
    testScope.dialogControl = dialog.displayDialog($DEFAULT_ELEMENT_TO_DISPLAY);

    expect(pretendEscapeWasPressed).not.toThrow();

    expect(document.querySelector('#hmrc-timeout-dialog')).toBeNull();
    expect(document.querySelector('#hmrc-timeout-overlay')).toBeNull();
  });

  describe('Manipulating page elements for dialog', () => {
    beforeEach(() => {
      const arr = [];
      testScope.elementsCreatedForThisTest = arr;

      if (!document.querySelector('#skiplink-container')) {
        arr.push(utils.generateDomElementFromString('<div id=skiplink-container>'));
      }
      if (!document.querySelector('#global-cookie-message')) {
        arr.push(utils.generateDomElementFromString('<div id=global-cookie-message>'));
      }
      if (!document.querySelector('body>header')) {
        arr.push(utils.generateDomElementFromString('<header>'));
      }
      if (!document.querySelector('main[role=main]')) {
        arr.push(utils.generateDomElementFromString('<main role="main">'));
      }
      if (!document.querySelector('body>footer')) {
        arr.push(utils.generateDomElementFromString('<footer>'));
      }
      arr.forEach(($elem) => document.body.appendChild($elem));
    });
    afterEach(() => {
      testScope.elementsCreatedForThisTest.forEach(($elem) => {
        document.body.removeChild($elem);
      });
    });

    it('should set aria-hidden when dialog is open', () => {
      const selectors = [
        '#skiplink-container',
        'body>header',
        '#global-cookie-message',
        'main[role=main]',
        'body>footer',
      ];
      selectors.forEach((selector) => {
        assume(document.querySelectorAll(selector).length).toBe(1);
        assume(document.querySelector(selector).attributes.getNamedItem('aria-hidden')).toBeNull();
      });

      openDefaultDialog();

      selectors.forEach((selector) => {
        expect(document.querySelector(selector).attributes.getNamedItem('aria-hidden').value).toEqual('true');
      });
    });

    it('should reset to previous values when closed', () => {
      assume(testScope.elementsCreatedForThisTest.length).toBeGreaterThanOrEqual(3);
      testScope.elementsCreatedForThisTest[0].setAttribute('aria-hidden', 'abcd');
      testScope.elementsCreatedForThisTest[1].setAttribute('aria-hidden', 'efgh');
      assume(testScope.elementsCreatedForThisTest[2].attributes.getNamedItem('aria-hidden')).toBeNull();

      openDefaultDialog();

      expect(testScope.elementsCreatedForThisTest[0].attributes.getNamedItem('aria-hidden').value).toEqual('true');
      expect(testScope.elementsCreatedForThisTest[1].attributes.getNamedItem('aria-hidden').value).toEqual('true');
      expect(testScope.elementsCreatedForThisTest[2].attributes.getNamedItem('aria-hidden').value).toEqual('true');

      pretendEscapeWasPressed();

      expect(testScope.elementsCreatedForThisTest[0].attributes.getNamedItem('aria-hidden').value).toEqual('abcd');
      expect(testScope.elementsCreatedForThisTest[1].attributes.getNamedItem('aria-hidden').value).toEqual('efgh');
      expect(testScope.elementsCreatedForThisTest[2].attributes.getNamedItem('aria-hidden')).toBeNull();
    });

    it('should allow aria-labelledby to be set, reset and removed', () => {
      openDefaultDialog();
      const $dialog = document.querySelector('#hmrc-timeout-dialog');

      expect($dialog.attributes.getNamedItem('aria-labelledby')).toBeNull();

      testScope.dialogControl.setAriaLabelledBy('element-id');

      expect($dialog.attributes.getNamedItem('aria-labelledby').value).toEqual('element-id');

      testScope.dialogControl.setAriaLabelledBy('something-else');

      expect($dialog.attributes.getNamedItem('aria-labelledby').value).toEqual('something-else');

      testScope.dialogControl.setAriaLabelledBy();

      expect($dialog.attributes.getNamedItem('aria-labelledby')).toBeNull();
    });

    describe('Focus control', () => {
      function expeectActiveElementToHaveId(id) {
        expect(document.activeElement.id || document.activeElement.outerHTML).toEqual(id);
      }

      function appendToBody($elem) {
        testScope.elementsCreatedForThisTest.push($elem);
        document.body.appendChild($elem);
        return $elem;
      }

      beforeEach(() => {
        const $focusElem = appendToBody(utils.generateDomElementFromStringAndAppendText('<a href=#>', 'abc'));
        $focusElem.setAttribute('id', 'the-element-with-the-focus');
        $focusElem.focus();
        appendToBody(utils.generateDomElementFromStringAndAppendText('<input>')).setAttribute('id', 'different-elem');
        appendToBody(utils.generateDomElementFromStringAndAppendText('<button>', 'abc'));
        appendToBody(utils.generateDomElementFromStringAndAppendText('<textarea>', 'abc'));
        appendToBody(utils.generateDomElementFromStringAndAppendText('<div tabindex="-1">', 'abc'));
        appendToBody(utils.generateDomElementFromStringAndAppendText('<div tabindex="10">', 'def'));
      });

      it('should take focus when opening', () => {
        openDefaultDialog();

        expeectActiveElementToHaveId('hmrc-timeout-dialog');
      });

      it('should return the focus when closed', () => {
        document.querySelector('#the-element-with-the-focus').focus();
        expeectActiveElementToHaveId('the-element-with-the-focus');

        openDefaultDialog();
        testScope.dialogControl.closeDialog();

        expeectActiveElementToHaveId('the-element-with-the-focus');

        document.querySelector('#different-elem').focus();

        openDefaultDialog();
        pretendEscapeWasPressed();

        expeectActiveElementToHaveId('different-elem');
      });

      it('should not allow focus to move outside the dialog', () => {
        openDefaultDialog();

        appendToBody(utils.generateDomElementFromStringAndAppendText('<a href=#>', 'this was added after dialog open')).setAttribute('id', 'added-after-open');

        testScope.elementsCreatedForThisTest.forEach(($elem) => {
          $elem.focus();
          expeectActiveElementToHaveId('hmrc-timeout-dialog');
        });
      });

      it('should allow focus to move outside the dialog after closing', () => {
        openDefaultDialog();
        testScope.dialogControl.closeDialog();

        document.querySelector('#the-element-with-the-focus').focus();
        expeectActiveElementToHaveId('the-element-with-the-focus');

        document.querySelector('#different-elem').focus();
        expeectActiveElementToHaveId('different-elem');
      });

      it('should allow focus to move inside the dialog', () => {
        expeectActiveElementToHaveId('the-element-with-the-focus');

        testScope.dialogControl = dialog.displayDialog(utils.generateDomElementFromString('<div><a href=# id="button-a">Button A</a><a href=# id="button-b">Button B</a></div>'));

        document.querySelector('#button-a').focus();
        expeectActiveElementToHaveId('button-a');

        document.querySelector('#button-b').focus();
        expeectActiveElementToHaveId('button-b');

        testScope.dialogControl.closeDialog();

        expeectActiveElementToHaveId('the-element-with-the-focus');
      });
    });
  });

  describe('Zoom and Scroll on Mobile', () => {
    function triggerTouchmoveEventWith(arrayName, arrayLength) {
      const arr = [];
      for (let i = 0; i < arrayLength; i += 1) {
        arr.push({});
      }
      const e = document.createEvent('Events');
      e.initEvent('touchmove', true, true);
      e[arrayName] = arr;
      e.preventDefault = mock.fn();
      document.dispatchEvent(e);
      return e;
    }

    function simulateTouchmoveWithNumberOfFingers(n) {
      return triggerTouchmoveEventWith('touches', n);
    }

    function simulateNumberOfChangedTouches(n) {
      return triggerTouchmoveEventWith('changedTouches', n);
    }

    beforeEach(() => {
      assume(document.querySelector('#hmrc-timeout-dialog')).toBeNull();
      expect.extend({
        toHaveHadDefaultPrevented(received) {
          const result = {};
          const passMessage = ['Expected', received.type, 'event'];
          result.pass = received.preventDefault.mock.calls.length > 0;
          if (result.pass) {
            passMessage.push('not', 'to have had default prevented');
          } else {
            passMessage.push('to have had default prevented, but it wasn\'t prevented');
          }
          result.message = () => passMessage.join(' ');
          return result;
        },
      });
    });
    it('should allow all combinations before dialog is open', () => {
      expect(simulateTouchmoveWithNumberOfFingers(1)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(2)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(3)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(4)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(5)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(1)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(2)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(3)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(4)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(5)).not.toHaveHadDefaultPrevented();
    });
    it('should disallow scroll while dialog is open', () => {
      openDefaultDialog();

      expect(simulateTouchmoveWithNumberOfFingers(1)).toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(1)).toHaveHadDefaultPrevented();
    });
    it('should allow pinch scroll while dialog is open', () => {
      openDefaultDialog();

      expect(simulateTouchmoveWithNumberOfFingers(2)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(2)).not.toHaveHadDefaultPrevented();
    });
    it('should allow other multifinger touches while dialog is open', () => {
      openDefaultDialog();

      expect(simulateTouchmoveWithNumberOfFingers(3)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(4)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(5)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(3)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(4)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(5)).not.toHaveHadDefaultPrevented();
    });
    it('should allow all combinations after dialog is closed', () => {
      expect(simulateTouchmoveWithNumberOfFingers(1)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(2)).not.toHaveHadDefaultPrevented();

      openDefaultDialog();
      testScope.dialogControl.closeDialog();

      expect(simulateTouchmoveWithNumberOfFingers(1)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(2)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(3)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(4)).not.toHaveHadDefaultPrevented();
      expect(simulateTouchmoveWithNumberOfFingers(5)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(1)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(2)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(3)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(4)).not.toHaveHadDefaultPrevented();
      expect(simulateNumberOfChangedTouches(5)).not.toHaveHadDefaultPrevented();
    });
  });
});
