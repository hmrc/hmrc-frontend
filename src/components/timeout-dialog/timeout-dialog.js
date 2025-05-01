import dialog from './dialog';
import ValidateInput from './validate-input';
import RedirectHelper from './redirectHelper';
import utils from './utils';

// TODO: rewrite this to follow govuk-frontend prototype module pattern

function TimeoutDialog($module, $sessionActivityService) {
  let options = {};
  let settings = {};
  const cleanupFunctions = [];
  let currentTimer;
  const sessionActivityService = $sessionActivityService;

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
      synchroniseTabs: validate.boolean(
        lookupData('data-synchronise-tabs') || false,
      ),
      hideSignOutButton: validate.boolean(
        lookupData('data-hide-sign-out-button') || false,
      ),
    };

    // Default timeoutUrl to signOutUrl if not set
    options.timeoutUrl = options.timeoutUrl || options.signOutUrl;

    validateInput(options);
    settings = mergeOptionsWithDefaults(options, localisedDefaults);
    setupDialogTimer();
    listenForSessionActivityAndResetDialogTimer();
  }

  const broadcastSessionActivity = () => {
    sessionActivityService.logActivity();
  };

  const listenForSessionActivityAndResetDialogTimer = () => {
    if (settings.synchroniseTabs) {
      sessionActivityService.onActivity((event) => {
        const timeOfActivity = event.timestamp;
        cleanup();
        setupDialogTimer(timeOfActivity);
      });
    }
  };

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

  const setupDialogTimer = (timeOfLastActivity = getDateNow()) => {
    const signoutTime = timeOfLastActivity + settings.timeout * 1000;

    const delta = getDateNow() - timeOfLastActivity;
    const secondsUntilTimeoutDialog = settings.timeout - settings.countdown;
    const timeout = window.setTimeout(() => {
      setupDialog(signoutTime);
    }, (secondsUntilTimeoutDialog * 1000) - delta);

    cleanupFunctions.push(() => {
      window.clearTimeout(timeout);
      if (currentTimer) {
        window.clearTimeout(currentTimer);
      }
    });
  };

  const setupDialog = (signoutTime) => {
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
    if (settings.messageSuffix) {
      $visualMessge.appendChild(document.createTextNode(` ${settings.messageSuffix}`));
    }

    const $staySignedInButton = utils.generateDomElementFromStringAndAppendText(
      '<button id="hmrc-timeout-keep-signin-btn" class="govuk-button">',
      settings.keepAliveButtonText,
    );

    const $wrapper = document.createElement('div');
    $wrapper.classList.add('govuk-button-group');
    $wrapper.appendChild($staySignedInButton);

    $element.appendChild($visualMessge);
    $element.appendChild($audibleMessage);
    $staySignedInButton.addEventListener('click', keepAliveAndClose);
    $element.appendChild(document.createTextNode(' '));

    if (!settings.hideSignOutButton) {
      const $signOutButton = utils.generateDomElementFromStringAndAppendText(
        '<a id="hmrc-timeout-sign-out-link" class="govuk-link hmrc-timeout-dialog__link">',
        settings.signOutButtonText,
      );
      $signOutButton.addEventListener('click', signOut);
      $signOutButton.setAttribute('href', settings.signOutUrl);

      $wrapper.appendChild($signOutButton);
    }

    $element.appendChild($wrapper);

    const dialogControl = dialog.displayDialog($element);

    cleanupFunctions.push(() => {
      dialogControl.closeDialog();
    });

    dialogControl.addCloseHandler(keepAliveAndClose);

    dialogControl.setAriaLabelledBy('hmrc-timeout-heading hmrc-timeout-message');

    const getMillisecondsRemaining = () => signoutTime - getDateNow();
    const getSecondsRemaining = () => Math.round(getMillisecondsRemaining() / 1000);

    const getHumanText = (counter) => {
      let minutes; let
        visibleMessage;
      if (counter < 60) {
        visibleMessage = `${counter} ${settings.properties[counter !== 1 ? 'seconds' : 'second']}.`;
      } else {
        minutes = Math.ceil(counter / 60);
        visibleMessage = `${minutes} ${settings.properties[minutes === 1 ? 'minute' : 'minutes']}.`;
      }
      return visibleMessage;
    };

    const getAudibleHumanText = (counter) => {
      const humanText = getHumanText(roundSecondsUp(counter));
      const messageParts = [settings.message, ' ', humanText];
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
      updateTextIfChanged($audibleMessage, audibleHumanText);
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
      const counter = Math.max(getSecondsRemaining(), 0);
      updateCountdown(counter);
      if (counter === 0) {
        timeout();
      } else {
        currentTimer = window.setTimeout(runUpdate, getNextTimeout());
      }
    };

    runUpdate();
  };

  const keepAliveAndClose = () => {
    cleanup();
    setupDialogTimer();
    utils.ajaxGet(settings.keepAliveUrl, () => {});
    broadcastSessionActivity();
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
