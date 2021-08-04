import '../../vendor/polyfills/Array/prototype/forEach';
import '../../vendor/polyfills/Object/assign';
import '../../vendor/polyfills/Object/keys';
import '../../vendor/polyfills/Date/now';

import dialog from './dialog';
import ValidateInput from './validate-input';
import RedirectHelper from './redirectHelper';
import utils from './utils';

// TODO: rewruite this to follow govuk-frontend's protoytpe module pattern

function TimeoutDialog($module) {
  let options = {};
  let settings = {};
  const cleanupFunctions = [];
  let currentTimer;

  cleanupFunctions.push(() => {
    if (currentTimer) {
      window.clearTimeout(currentTimer);
    }
  });

  function init() {
    const validate = ValidateInput;

    function lookupData(key) {
      return ($module.attributes.getNamedItem(key) || {}).value;
    }

    const localisedDefaults = validate.string(lookupData('data-language')) === 'cy' ? {
      title: 'Rydych ar fin cael eich allgofnodi',
      message: 'Er eich diogelwch, byddwn yn eich allgofnodi cyn pen',
      keepAliveButtonText: 'Parhau i fod wedi’ch mewngofnodi',
      signOutButtonText: 'Allgofnodi',
      properties: {
        minutes: 'funud',
        minute: 'funud',
        seconds: 'eiliad',
        second: 'eiliad',
      },
    } : {
      title: 'You’re about to be signed out',
      message: 'For your security, we will sign you out in',
      keepAliveButtonText: 'Stay signed in',
      signOutButtonText: 'Sign out',
      properties: {
        minutes: 'minutes',
        minute: 'minute',
        seconds: 'seconds',
        second: 'second',
      },
    };

    options = {
      timeout: validate.int(lookupData('data-timeout')),
      countdown: validate.int(lookupData('data-countdown')),
      keepAliveUrl: validate.string(lookupData('data-keep-alive-url')),
      signOutUrl: validate.string(lookupData('data-sign-out-url')),
      timeoutUrl: validate.string(lookupData('data-timeout-url')),
      title: validate.string(lookupData('data-title')),
      message: validate.string(lookupData('data-message')),
      messageSuffix: validate.string(lookupData('data-message-suffix')),
      keepAliveButtonText: validate.string(
        lookupData('data-keep-alive-button-text'),
      ),
      signOutButtonText: validate.string(
        lookupData('data-sign-out-button-text'),
      ),
    };

    // Default timeoutUrl to signOutUrl if not set
    options.timeoutUrl = options.timeoutUrl || options.signOutUrl;

    validateInput(options);
    settings = mergeOptionsWithDefaults(options, localisedDefaults);
    setupDialogTimer();
  }

  const validateInput = (config) => {
    const requiredConfig = ['timeout', 'countdown', 'keepAliveUrl', 'signOutUrl'];
    const missingRequiredConfig = [];

    requiredConfig.forEach((item) => {
      if (!config[item]) {
        missingRequiredConfig.push(`data-${item.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`);
      }
    });

    if (missingRequiredConfig.length > 0) {
      throw new Error(
        `Missing config item(s): [${missingRequiredConfig.join(', ')}]`,
      );
    }
  };

  const mergeOptionsWithDefaults = (theOptions, localisedDefaults) => {
    const clone = { ...theOptions };

    Object.keys(localisedDefaults).forEach((key) => {
      if (typeof clone[key] === 'object') {
        clone[key] = mergeOptionsWithDefaults(
          theOptions[key],
          localisedDefaults[key],
        );
      }
      if (clone[key] === undefined || clone[key] === '') {
        clone[key] = localisedDefaults[key];
      }
    });

    return clone;
  };

  const setupDialogTimer = () => {
    settings.signout_time = getDateNow() + settings.timeout * 1000;

    const timeout = window.setTimeout(() => {
      setupDialog();
    }, (settings.timeout - settings.countdown) * 1000);

    cleanupFunctions.push(() => {
      window.clearTimeout(timeout);
    });
  };

  const wrapLink = ($elem) => {
    const $wrapper = document.createElement('div');
    $wrapper.classList.add('hmrc-timeout-dialog__link-wrapper');
    $wrapper.appendChild($elem);

    return $wrapper;
  };

  const setupDialog = () => {
    const $element = utils.generateDomElementFromString('<div>');

    if (settings.title) {
      const $tmp = utils.generateDomElementFromStringAndAppendText(
        '<h1 id="hmrc-timeout-heading" class="govuk-heading-m push--top">',
        settings.title,
      );
      $element.appendChild($tmp);
    }

    const $countdownElement = utils.generateDomElementFromString(
      '<span id="hmrc-timeout-countdown" class="hmrc-timeout-dialog__countdown">',
    );

    const $audibleMessage = utils.generateDomElementFromString('<p id="hmrc-timeout-message" class="govuk-visually-hidden screenreader-content" aria-live="assertive">');
    const $visualMessge = utils.generateDomElementFromStringAndAppendText(
      '<p class="govuk-body hmrc-timeout-dialog__message" aria-hidden="true">',
      settings.message,
    );
    $visualMessge.appendChild(document.createTextNode(' '));
    $visualMessge.appendChild($countdownElement);
    $visualMessge.appendChild(document.createTextNode('.'));
    if (settings.messageSuffix) {
      $visualMessge.appendChild(document.createTextNode(` ${settings.messageSuffix}`));
    }

    const $staySignedInButton = utils.generateDomElementFromStringAndAppendText(
      '<button id="hmrc-timeout-keep-signin-btn" class="govuk-button">',
      settings.keepAliveButtonText,
    );
    const $signOutButton = utils.generateDomElementFromStringAndAppendText(
      '<a id="hmrc-timeout-sign-out-link" class="govuk-link hmrc-timeout-dialog__link">',
      settings.signOutButtonText,
    );

    $staySignedInButton.addEventListener('click', keepAliveAndClose);
    $signOutButton.addEventListener('click', signOut);
    $signOutButton.setAttribute('href', settings.signOutUrl);

    $element.appendChild($visualMessge);
    $element.appendChild($audibleMessage);
    $element.appendChild($staySignedInButton);
    $element.appendChild(document.createTextNode(' '));
    $element.appendChild(wrapLink($signOutButton));

    const dialogControl = dialog.displayDialog($element);

    cleanupFunctions.push(() => {
      dialogControl.closeDialog();
    });

    dialogControl.addCloseHandler(keepAliveAndClose);

    dialogControl.setAriaLabelledBy('hmrc-timeout-heading hmrc-timeout-message');

    startCountdown($countdownElement, $audibleMessage);
  };

  const getMillisecondsRemaining = () => settings.signout_time - getDateNow();

  const getSecondsRemaining = () => Math.round(getMillisecondsRemaining() / 1000);

  const startCountdown = ($countdownElement, $screenReaderCountdownElement) => {
    const getHumanText = (counter) => {
      let minutes; let
        visibleMessage;
      if (counter < 60) {
        visibleMessage = `${counter} ${settings.properties[counter !== 1 ? 'seconds' : 'second']}`;
      } else {
        minutes = Math.ceil(counter / 60);
        visibleMessage = `${minutes} ${settings.properties[minutes === 1 ? 'minute' : 'minutes']}`;
      }
      return visibleMessage;
    };

    const getAudibleHumanText = (counter) => {
      const humanText = getHumanText(roundSecondsUp(counter));
      const messageParts = [settings.message, ' ', humanText, '.'];
      if (settings.messageSuffix) {
        messageParts.push(' ');
        messageParts.push(settings.messageSuffix);
      }
      return messageParts.join('');
    };

    const roundSecondsUp = (counter) => {
      if (counter > 60) {
        return counter;
      } if (counter < 20) {
        return 20;
      }
      return Math.ceil(counter / 20) * 20;
    };

    const updateTextIfChanged = ($elem, text) => {
      if ($elem.innerText !== text) {
        // eslint-disable-next-line no-param-reassign
        $elem.innerText = text;
      }
    };

    const updateCountdown = (counter) => {
      const visibleMessage = getHumanText(counter);
      const audibleHumanText = getAudibleHumanText(counter);

      updateTextIfChanged($countdownElement, visibleMessage);
      updateTextIfChanged($screenReaderCountdownElement, audibleHumanText);
    };

    const getNextTimeout = () => {
      const remaining = getMillisecondsRemaining();
      const roundedRemaining = Math.floor(getMillisecondsRemaining() / 1000) * 1000;
      if (roundedRemaining <= 60000) {
        return (remaining - roundedRemaining) || 1000;
      }
      return remaining - (roundedRemaining - (roundedRemaining % 60000 || 60000));
    };

    const runUpdate = () => {
      const counter = getSecondsRemaining();
      updateCountdown(counter);
      if (counter <= 0) {
        timeout();
      }
      currentTimer = window.setTimeout(runUpdate, getNextTimeout());
    };

    runUpdate();
  };

  const keepAliveAndClose = () => {
    cleanup();
    setupDialogTimer();
    utils.ajaxGet(settings.keepAliveUrl, () => {
    });
  };

  const getDateNow = () => Date.now();

  const signOut = () => {
    RedirectHelper.redirectToUrl(settings.signOutUrl);
  };

  const timeout = () => {
    RedirectHelper.redirectToUrl(settings.timeoutUrl);
  };

  const cleanup = () => {
    while (cleanupFunctions.length > 0) {
      const fn = cleanupFunctions.shift();
      fn();
    }
  };

  return { init, cleanup };
}

TimeoutDialog.dialog = dialog;
TimeoutDialog.redirectHelper = RedirectHelper;
TimeoutDialog.utils = utils;

export default TimeoutDialog;
