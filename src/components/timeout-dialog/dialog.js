import utils from './utils';

function displayDialog($elementToDisplay) {
  const $dialog = utils.generateDomElementFromString('<div id="hmrc-timeout-dialog" tabindex="-1" role="dialog" aria-modal="true" class="hmrc-timeout-dialog">');
  const $overlay = utils.generateDomElementFromString('<div id="hmrc-timeout-overlay" class="hmrc-timeout-overlay">');
  const $preparedElementToDisplay = typeof $elementToDisplay === 'string' ? utils.generateDomElementFromString($elementToDisplay) : $elementToDisplay;
  const resetElementsFunctionList = [];
  const closeCallbacks = [];

  $dialog.appendChild($preparedElementToDisplay);

  if (!utils.hasClass('html', 'noScroll')) {
    utils.addClass('html', 'noScroll');
    resetElementsFunctionList.push(() => {
      utils.removeClass('html', 'noScroll');
    });
  }
  document.body.appendChild($dialog);
  document.body.appendChild($overlay);

  resetElementsFunctionList.push(() => {
    utils.removeElement($dialog);
    utils.removeElement($overlay);
  });

  const setupFocusHandlerAndFocusDialog = () => {
    function keepFocus(event) {
      const modalFocus = document.getElementById('hmrc-timeout-dialog');
      if (modalFocus) {
        if (event.target !== modalFocus && !modalFocus.contains(event.target)) {
          event.stopPropagation();
          modalFocus.focus();
        }
      }
    }

    const elemToFocusOnReset = document.activeElement;
    $dialog.focus();

    document.addEventListener('focus', keepFocus, true);

    resetElementsFunctionList.push(() => {
      document.removeEventListener('focus', keepFocus);
      elemToFocusOnReset.focus();
    });
  };

  // disable the non-dialog page to prevent confusion for VoiceOver users
  const selectors = [
    '#skiplink-container',
    'body > header',
    '#global-cookie-message',
    'main',
    'body > footer',
    'body > .govuk-skip-link',
    '.cbanner-govuk-cookie-banner',
    'body > .govuk-width-container',
  ];
  const elements = document.querySelectorAll(selectors.join(', '));
  const close = () => {
    while (resetElementsFunctionList.length > 0) {
      const fn = resetElementsFunctionList.shift();
      fn();
    }
  };
  const closeAndInform = () => {
    closeCallbacks.forEach((fn) => { fn(); });
    close();
  };
  const setupKeydownHandler = () => {
    function keydownListener(e) {
      if (e.keyCode === 27) {
        closeAndInform();
      }
    }

    document.addEventListener('keydown', keydownListener);

    resetElementsFunctionList.push(() => {
      document.removeEventListener('keydown', keydownListener);
    });
  };
  const preventMobileScrollWhileAllowingPinchZoom = () => {
    const handleTouch = (e) => {
      const touches = e.touches || e.changedTouches || [];

      if (touches.length === 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouch, true);

    resetElementsFunctionList.push(() => {
      document.removeEventListener('touchmove', handleTouch, true);
    });
  };

  elements.forEach(($elem) => {
    const value = $elem.getAttribute('aria-hidden');
    $elem.setAttribute('aria-hidden', 'true');
    resetElementsFunctionList.push(() => {
      if (value) {
        $elem.setAttribute('aria-hidden', value);
      } else {
        $elem.removeAttribute('aria-hidden');
      }
    });
  });

  //
  setupFocusHandlerAndFocusDialog();

  setupKeydownHandler();

  preventMobileScrollWhileAllowingPinchZoom();

  return {
    closeDialog() {
      close();
    },
    setAriaLabelledBy(value) {
      if (value) {
        $dialog.setAttribute('aria-labelledby', value);
      } else {
        $dialog.removeAttribute('aria-labelledby');
      }
    },
    addCloseHandler(closeHandler) {
      closeCallbacks.push(closeHandler);
    },
  };
}

export default { displayDialog };
