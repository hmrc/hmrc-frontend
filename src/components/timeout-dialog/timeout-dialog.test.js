/* eslint-env jest */
import mock from 'jest-mock';
import util from 'util';
import TimeoutDialog from './timeout-dialog';

const { dialog, redirectHelper, utils } = TimeoutDialog;
const nextTick = util.promisify(setImmediate);

const getElemText = (elem) => {
  if (!elem) {
    throw new Error('Can\'t get text from an element that doesn\'t exist.');
  }
  let out = elem.innerText;
  for (let i = 0; i < elem.childNodes.length; i += 1) {
    const child = elem.childNodes[i];
    if (child.nodeType === 3) {
      out += child.textContent;
    } else {
      out += child.innerText;
    }
  }
  return out;
};

const clickElem = (elem) => {
  if (!elem) {
    throw new Error('Can\'t click an element that doesn\'t exist.');
  }
  const e = document.createEvent('Events');
  e.initEvent('click', true, true, window, 1);
  elem.dispatchEvent(e);
};

describe('/components/timeout-dialog', () => {
  let assume;
  let testScope; // an object which is reset between test runs
  const audibleCountSelector = '.screenreader-content.govuk-visually-hidden[aria-live=assertive]';
  const visualCountSelector = '[aria-hidden=true]';

  function pretendSecondsHavePassed(numberOfSeconds) {
    const millis = numberOfSeconds * 1000;
    testScope.currentDateTime += millis;
    jest.advanceTimersByTime(millis);
  }

  function pretendDialogWasClosedWithoutButtonPress() {
    if (!testScope.latestDialogCloseCallback) {
      throw new Error('No dialog close callback available.');
    }
    testScope.latestDialogCloseCallback();
  }

  function setupDialog(partialConfig) {
    const $TimeoutDialog = document.createElement('meta');
    $TimeoutDialog.setAttribute('name', 'hmrc-timeout-dialog');

    const config = { ...testScope.minimumValidConfig, ...partialConfig };

    Object.keys(config).forEach((item) => {
      $TimeoutDialog.setAttribute(item, config[item]);
    });

    testScope.timeoutDialogControl = new TimeoutDialog($TimeoutDialog);
    testScope.timeoutDialogControl.init();
  }

  function setLanguageToWelsh() {
    testScope.minimumValidConfig['data-language'] = 'cy';
  }

  function getVisualCountText() {
    return getElemText(testScope.latestDialog$element.querySelector(visualCountSelector));
  }

  function getAudibleCountText() {
    return getElemText(testScope.latestDialog$element.querySelector(audibleCountSelector));
  }

  beforeEach(() => {
    assume = expect;
    testScope = {
      currentDateTime: 1554196031049, // the time these tests were written
      // - this can change but it's best not to write randomness into tests
    };
    mock.spyOn(Date, 'now').mockImplementation(() => testScope.currentDateTime);
    mock.spyOn(utils, 'ajaxGet').mockImplementation(() => {
    });
    mock.spyOn(redirectHelper, 'redirectToUrl').mockImplementation(() => {
    });
    mock.spyOn(dialog, 'displayDialog').mockImplementation(($elementToDisplay) => {
      testScope.latestDialog$element = $elementToDisplay;
      testScope.latestDialogControl = {
        closeDialog: mock.fn(),
        setAriaLabelledBy: mock.fn(),
        addCloseHandler: mock.fn().mockImplementation((fn) => {
          testScope.latestDialogCloseCallback = fn;
        }),
      };
      return testScope.latestDialogControl;
    });
    jest.useFakeTimers();
    testScope.minimumValidConfig = {
      'data-timeout': 900,
      'data-countdown': 120,
      'data-keep-alive-url': '/keep-alive',
      'data-sign-out-url': '/sign-out',
    };
  });

  afterEach(() => {
    if (testScope.timeoutDialogControl && testScope.timeoutDialogControl.cleanup) {
      testScope.timeoutDialogControl.cleanup();
    }
    delete testScope.timeoutDialogControl;
    dialog.displayDialog.mockReset();
    utils.ajaxGet.mockReset();
    redirectHelper.redirectToUrl.mockReset();
    jest.clearAllTimers();
  });

  describe('Delay before displaying', () => {
    it('should start countdown at 2.5 minutes', () => {
      setupDialog({ 'data-timeout': 300, 'data-countdown': 30, 'data-title': 'one' });

      pretendSecondsHavePassed(269);

      expect(dialog.displayDialog).not.toHaveBeenCalled();

      pretendSecondsHavePassed(1);

      expect(dialog.displayDialog).toHaveBeenCalled();
      expect(testScope.latestDialogControl.setAriaLabelledBy).toHaveBeenCalledWith('hmrc-timeout-message');
    });
  });

  describe('Timeout Dialog', () => {
    it('should start countdown at 13 minutes', () => {
      setupDialog({ 'data-timeout': 900, 'data-countdown': 120, 'data-title': 'two' });

      pretendSecondsHavePassed(779);

      expect(dialog.displayDialog).not.toHaveBeenCalled();

      pretendSecondsHavePassed(1);

      expect(dialog.displayDialog).toHaveBeenCalled();
    });
  });

  describe('the default options', () => {
    const initialMessage = 'For your security, we will sign you out in 2 minutes.';

    beforeEach(() => {
      setupDialog();
      pretendSecondsHavePassed(781);
    });

    it('should start with a assertive screenreader tone', () => {
      expect(getElemText(testScope.latestDialog$element.querySelector('[aria-live="assertive"]'))).toBe(initialMessage);
    });

    it('should not show heading', () => {
      expect(testScope.latestDialog$element.querySelector('h1.push--top')).toBeDefined();
    });

    it('should show message', () => {
      expect(getVisualCountText()).toEqual(initialMessage);
      expect(getAudibleCountText()).toEqual(initialMessage);
    });

    it('should show keep signed in button', () => {
      expect(testScope.latestDialog$element.querySelector('button#hmrc-timeout-keep-signin-btn.govuk-button').innerText).toEqual('Stay signed in');
    });

    it('should show sign out link', () => {
      expect(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link').innerText).toEqual('Sign out');
    });

    it('should separate the call-to-actions into different containers', () => {
      expect(testScope.latestDialog$element.querySelector('button#hmrc-timeout-keep-signin-btn.govuk-button').parentNode).not.toBe(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link').parentNode);
    });

    it('should redirect to signout url when signout is clicked', () => {
      assume(redirectHelper.redirectToUrl).not.toHaveBeenCalled();

      clickElem(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link'));
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('/sign-out');
    });

    it('should use the signout url on the signout link', () => {
      const $signoutLink = testScope.latestDialog$element.querySelector('a#hmrc-timeout-sign-out-link');
      expect($signoutLink.attributes.getNamedItem('href').value).toEqual('/sign-out');
    });

    it('should AJAX call the keep alive URL when the keepalive button is clicked', () => {
      assume(testScope.latestDialogControl.closeDialog).not.toHaveBeenCalled();

      clickElem(testScope.latestDialog$element.querySelector('#hmrc-timeout-keep-signin-btn'));

      expect(utils.ajaxGet).toHaveBeenCalledWith('/keep-alive', expect.any(Function));
      expect(testScope.latestDialogControl.closeDialog).toHaveBeenCalled();

      pretendSecondsHavePassed(130);
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled();
    });

    it('should AJAX call the keep alive URL when dialog is closed without using the button', () => {
      pretendDialogWasClosedWithoutButtonPress();

      expect(utils.ajaxGet).toHaveBeenCalledWith('/keep-alive', expect.any(Function));
      expect(utils.ajaxGet.mock.calls.length).toEqual(1);
    });
  });
  describe('the default welsh options', () => {
    beforeEach(() => {
      setLanguageToWelsh();
      setupDialog();
      pretendSecondsHavePassed(780);
    });

    it('should not show heading', () => {
      expect(testScope.latestDialog$element.querySelector('h1.push--top')).toBeNull();
    });

    it('should show message', () => {
      const expected = 'Er eich diogelwch, byddwn yn eich allgofnodi cyn pen 2 funud.';
      expect(getVisualCountText()).toEqual(expected);
      expect(getAudibleCountText()).toEqual(expected);
    });

    it('should show keep signed in button', () => {
      expect(getElemText(testScope.latestDialog$element.querySelector('button#hmrc-timeout-keep-signin-btn.govuk-button'))).toEqual('Parhau i fod wedi’ch mewngofnodi');
    });

    it('should show sign out button', () => {
      expect(getElemText(testScope.latestDialog$element.querySelector('a#hmrc-timeout-sign-out-link'))).toEqual('Allgofnodi');
    });
  });

  it('should AJAX call the configured URL', () => {
    mock.spyOn(utils, 'ajaxGet').mockImplementation(() => {
    });

    setupDialog({
      'data-timeout': 130,
      'data-countdown': 120,
      'data-keep-alive-url': '/customKeepAlive',
    });

    pretendSecondsHavePassed(10);
    pretendDialogWasClosedWithoutButtonPress();

    expect(utils.ajaxGet).toHaveBeenCalledWith('/customKeepAlive', expect.any(Function));
    expect(utils.ajaxGet.mock.calls.length).toEqual(1);
  });

  describe('the default options when empty strings are provided', () => {
    beforeEach(() => {
      setupDialog({
        'data-title': '',
        'data-message': '',
        'data-keep-alive-button-text': '',
        'data-sign-out-button-text': '',
      });
      pretendSecondsHavePassed(780);
    });

    it('should not show heading', () => {
      expect(testScope.latestDialog$element.querySelector('h1')).toBeNull();
    });

    it('should show message', () => {
      expect(getVisualCountText()).toEqual('For your security, we will sign you out in 2 minutes.');
      expect(getAudibleCountText()).toEqual('For your security, we will sign you out in 2 minutes.');
    });

    it('should show keep signed in button', () => {
      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-keep-signin-btn'))).toEqual('Stay signed in');
    });

    it('should show sign out button', () => {
      expect(getElemText(testScope.latestDialog$element.querySelector('a#hmrc-timeout-sign-out-link'))).toEqual('Sign out');
    });
  });

  describe('the configuration options', () => {
    beforeEach(() => {
      setupDialog({
        'data-title': 'my custom TITLE',
        'data-message': 'MY custom message',
        'data-message-suffix': 'My message suffix.',
        'data-keep-alive-button-text': 'KEEP alive',
        'data-sign-out-button-text': 'sign OUT',
        'data-sign-out-url': '/mySignOutUrl.html',
        'data-timeout-url': '/myTimeoutUrl.html',
      });
      pretendSecondsHavePassed(780);
    });

    it('should show heading', () => {
      expect(getElemText(testScope.latestDialog$element.querySelector('h1'))).toEqual('my custom TITLE');
    });

    it('should show message', () => {
      expect(getVisualCountText()).toEqual('MY custom message 2 minutes. My message suffix.');
      expect(getAudibleCountText()).toEqual('MY custom message 2 minutes. My message suffix.');
    });

    it('should show keep signed in button', () => {
      expect(getElemText(testScope.latestDialog$element.querySelector('#hmrc-timeout-keep-signin-btn'))).toEqual('KEEP alive');
    });

    it('should show sign out button', () => {
      expect(getElemText(testScope.latestDialog$element.querySelector('a#hmrc-timeout-sign-out-link'))).toEqual('sign OUT');
    });

    it('should redirect to default signout url when signout is clicked', () => {
      assume(redirectHelper.redirectToUrl).not.toHaveBeenCalled();

      expect(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link')).not.toBeNull();

      clickElem(testScope.latestDialog$element.querySelector('#hmrc-timeout-sign-out-link'));
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('/mySignOutUrl.html');
    });
  });

  describe('Restarting countdown on close', () => {
    it('should restart with default settings', () => {
      setupDialog({ 'data-message': 'time:' });

      pretendSecondsHavePassed(880);
      pretendDialogWasClosedWithoutButtonPress();
      dialog.displayDialog.mockClear();
      pretendSecondsHavePassed(880);

      expect(dialog.displayDialog).toHaveBeenCalled();
      const expected = 'time: 20 seconds.';
      expect(getVisualCountText()).toEqual(expected);
      expect(getAudibleCountText()).toEqual(expected);
    });
  });

  describe('required configuration', () => {
    it('should fail when timeout is missing', () => {
      delete testScope.minimumValidConfig['data-timeout'];

      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-timeout]');
    });

    it('should fail when countdown is missing', () => {
      delete testScope.minimumValidConfig['data-countdown'];

      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-countdown]');
    });

    it('should fail when keepAliveUrl is missing', () => {
      delete testScope.minimumValidConfig['data-keep-alive-url'];

      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-keep-alive-url]');
    });

    it('should fail when signOutUrl is missing', () => {
      delete testScope.minimumValidConfig['data-sign-out-url'];

      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-sign-out-url]');
    });

    it('should fail when all config is missing', () => {
      testScope.minimumValidConfig = {};
      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-timeout, data-countdown, data-keep-alive-url, data-sign-out-url]');
    });

    it('should fail when timeout is empty', () => {
      testScope.minimumValidConfig['data-timeout'] = '';

      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-timeout]');
    });

    it('should fail when countdown is empty', () => {
      testScope.minimumValidConfig['data-countdown'] = '';

      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-countdown]');
    });

    it('should fail when keepAliveUrl is empty', () => {
      testScope.minimumValidConfig['data-keep-alive-url'] = '';

      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-keep-alive-url]');
    });

    it('should fail when signOutUrl is empty', () => {
      testScope.minimumValidConfig['data-sign-out-url'] = '';

      expect(() => {
        setupDialog();
      }).toThrowError('Missing config item(s): [data-sign-out-url]');
    });
  });

  describe('Cleanup', () => {
    const MINIMUM_TIME_UNTIL_MODAL_DISPLAYED = 10;

    it('should not display the dialog if cleanup has already been called', () => {
      setupDialog({ 'data-timeout': 130, 'data-countdown': 120 });

      testScope.timeoutDialogControl.cleanup();
      pretendSecondsHavePassed(MINIMUM_TIME_UNTIL_MODAL_DISPLAYED);
      expect(dialog.displayDialog).not.toHaveBeenCalled();
    });

    it('should remove dialog when cleanup is called', () => {
      setupDialog({ 'data-timeout': 130, 'data-countdown': 120 });
      pretendSecondsHavePassed(MINIMUM_TIME_UNTIL_MODAL_DISPLAYED);
      assume(dialog.displayDialog).toHaveBeenCalled();

      testScope.timeoutDialogControl.cleanup();

      expect(testScope.latestDialogControl.closeDialog).toHaveBeenCalled();
    });
  });

  describe('Countdown timer', () => {
    it('should countdown minutes and then seconds in english', async () => {
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 120,
        'data-message': 'time:',
        'data-sign-out-url': 'signout',
        'data-timeout-url': 'timeout',
      });

      pretendSecondsHavePassed(10);

      expect(getVisualCountText()).toEqual('time: 2 minutes.');
      expect(getAudibleCountText()).toEqual('time: 2 minutes.');
      pretendSecondsHavePassed(59);

      expect(getVisualCountText()).toEqual('time: 2 minutes.');
      expect(getAudibleCountText()).toEqual('time: 2 minutes.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('time: 1 minute.');
      expect(getAudibleCountText()).toEqual('time: 1 minute.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('time: 59 seconds.');
      expect(getAudibleCountText()).toEqual('time: 1 minute.');
      pretendSecondsHavePassed(57);

      expect(getVisualCountText()).toEqual('time: 2 seconds.');
      expect(getAudibleCountText()).toEqual('time: 20 seconds.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('time: 1 second.');
      expect(getAudibleCountText()).toEqual('time: 20 seconds.');
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled();

      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('time: 0 seconds.');
      expect(getAudibleCountText()).toEqual('time: 20 seconds.');
      pretendSecondsHavePassed(1);

      await nextTick();
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('timeout');
      expect(getVisualCountText()).toEqual('time: -1 seconds.');
      expect(getAudibleCountText()).toEqual('time: 20 seconds.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('time: -2 seconds.');
      expect(getAudibleCountText()).toEqual('time: 20 seconds.');
    });
    it('should default redirectToUrl to data-sign-out-url if data-timeout-url is not set', async () => {
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 120,
        'data-message': 'time:',
        'data-sign-out-url': 'logout',
      });
      pretendSecondsHavePassed(131);
      await nextTick();
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('logout');
    });

    it('should not redirect the user to the signOut if the user hasn\'t been timed out', async () => {
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 120,
        'data-message': 'time:',
        'data-sign-out-url': 'logout',
        'data-session-url': '/contact-frontend/hmrc-frontend/session',
      });
      jest.spyOn(utils, 'getSession').mockReturnValue(Promise.resolve({
        secondsRemaining: 100,
      }));

      pretendSecondsHavePassed(131);

      await nextTick();
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalledWith('logout');
      expect(utils.getSession).toHaveBeenCalledWith('/contact-frontend/hmrc-frontend/session');
    });

    it('should redirect the user to the signOut if the sessionUrl has not been supplied', async () => {
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 120,
        'data-message': 'time:',
        'data-sign-out-url': 'logout',
      });
      utils.getSession.mockRestore();

      pretendSecondsHavePassed(131);

      await nextTick();
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('logout');
    });

    it('should have an audio countdown which counts the last minute in 20 second decrements', () => {
      setupDialog({
        'data-timeout': 70,
        'data-countdown': 65,
        'data-message': 'time:',
        'data-sign-out-url': 'signout',
        'data-timeout-url': 'timeout',
      });

      pretendSecondsHavePassed(10);
      expect(getVisualCountText()).toEqual('time: 1 minute.');
      expect(getAudibleCountText()).toEqual('time: 1 minute.');

      pretendSecondsHavePassed(1);
      expect(getVisualCountText()).toEqual('time: 59 seconds.');
      expect(getAudibleCountText()).toEqual('time: 1 minute.');

      pretendSecondsHavePassed(18);
      expect(getVisualCountText()).toEqual('time: 41 seconds.');
      expect(getAudibleCountText()).toEqual('time: 1 minute.');

      pretendSecondsHavePassed(1);
      expect(getVisualCountText()).toEqual('time: 40 seconds.');
      expect(getAudibleCountText()).toEqual('time: 40 seconds.');

      pretendSecondsHavePassed(1);
      expect(getVisualCountText()).toEqual('time: 39 seconds.');
      expect(getAudibleCountText()).toEqual('time: 40 seconds.');

      pretendSecondsHavePassed(18);
      expect(getVisualCountText()).toEqual('time: 21 seconds.');
      expect(getAudibleCountText()).toEqual('time: 40 seconds.');

      pretendSecondsHavePassed(1);
      expect(getVisualCountText()).toEqual('time: 20 seconds.');
      expect(getAudibleCountText()).toEqual('time: 20 seconds.');

      pretendSecondsHavePassed(1);
      expect(getVisualCountText()).toEqual('time: 19 seconds.');
      expect(getAudibleCountText()).toEqual('time: 20 seconds.');
    });
    it('should countdown minutes and then seconds in welsh', async () => {
      setLanguageToWelsh();
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 120,
        'data-message': 'Welsh, time:',
        'data-sign-out-url': 'signout',
        'data-timeout-url': 'timeout',
      });

      pretendSecondsHavePassed(10);

      expect(getVisualCountText()).toEqual('Welsh, time: 2 funud.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 2 funud.');
      pretendSecondsHavePassed(59);

      expect(getVisualCountText()).toEqual('Welsh, time: 2 funud.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 2 funud.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Welsh, time: 1 funud.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 1 funud.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Welsh, time: 59 eiliad.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 1 funud.');
      pretendSecondsHavePassed(57);

      expect(getVisualCountText()).toEqual('Welsh, time: 2 eiliad.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 20 eiliad.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Welsh, time: 1 eiliad.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 20 eiliad.');
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled();

      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Welsh, time: 0 eiliad.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 20 eiliad.');
      pretendSecondsHavePassed(1);

      await nextTick();

      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('timeout');
      expect(getVisualCountText()).toEqual('Welsh, time: -1 eiliad.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 20 eiliad.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Welsh, time: -2 eiliad.');
      expect(getAudibleCountText()).toEqual('Welsh, time: 20 eiliad.');
    });

    it('should countdown lots of minutes when countdown is long', () => {
      setupDialog({
        'data-timeout': 1810,
        'data-countdown': 1800,
        'data-message': 'time:',
      });

      pretendSecondsHavePassed(10);
      assume(dialog.displayDialog).toHaveBeenCalled();

      expect(getVisualCountText()).toEqual('time: 30 minutes.');
      expect(getAudibleCountText()).toEqual('time: 30 minutes.');
      pretendSecondsHavePassed(59);

      expect(getVisualCountText()).toEqual('time: 30 minutes.');
      expect(getAudibleCountText()).toEqual('time: 30 minutes.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('time: 29 minutes.');
      expect(getAudibleCountText()).toEqual('time: 29 minutes.');
    });

    it('should countdown properly when the starting time is not in a round number of minutes', () => {
      setupDialog({
        'data-timeout': 70,
        'data-countdown': 68,
        'data-message': 'Remaining time is',
      });

      window.setTimeout.mockClear();

      pretendSecondsHavePassed(2.123);

      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 7877);
    });

    it('should countdown properly when the starting time is not in a round number of minutes', () => {
      setupDialog({
        'data-timeout': 300,
        'data-countdown': 120,
        'data-message': 'Remaining time is',
      });

      window.setTimeout.mockClear();

      pretendSecondsHavePassed(180.4);

      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 59600);
    });

    it('should countdown properly when the the intervals aren\'t at perfect seconds', () => {
      setupDialog({
        'data-timeout': 70,
        'data-countdown': 68,
        'data-message': 'Remaining time is',
      });

      window.setTimeout.mockClear();

      pretendSecondsHavePassed(12.123);

      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 877);

      window.setTimeout.mockClear();
      pretendSecondsHavePassed(0.879);

      expect(window.setTimeout).toHaveBeenCalledWith(expect.any(Function), 998);
    });

    it('should countdown minutes and then seconds in welsh', async () => {
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 50,
        'data-message': 'Remaining time is',
        'data-sign-out-url': 'signout',
        'data-timeout-url': 'timeout',
      });
      const lowestAudibleCount = 'Remaining time is 20 seconds.';

      pretendSecondsHavePassed(80);

      expect(getVisualCountText()).toEqual('Remaining time is 50 seconds.');
      expect(getAudibleCountText()).toEqual('Remaining time is 1 minute.');
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Remaining time is 49 seconds.');
      expect(getAudibleCountText()).toEqual('Remaining time is 1 minute.');
      pretendSecondsHavePassed(47);

      expect(getVisualCountText()).toEqual('Remaining time is 2 seconds.');
      expect(getAudibleCountText()).toEqual(lowestAudibleCount);
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Remaining time is 1 second.');
      expect(getAudibleCountText()).toEqual(lowestAudibleCount);

      await nextTick();
      expect(redirectHelper.redirectToUrl).not.toHaveBeenCalled();

      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Remaining time is 0 seconds.');
      expect(getAudibleCountText()).toEqual(lowestAudibleCount);
      pretendSecondsHavePassed(1);

      await nextTick();
      expect(redirectHelper.redirectToUrl).toHaveBeenCalledWith('timeout');
      expect(getVisualCountText()).toEqual('Remaining time is -1 seconds.');
      expect(getAudibleCountText()).toEqual(lowestAudibleCount);
      pretendSecondsHavePassed(1);

      expect(getVisualCountText()).toEqual('Remaining time is -2 seconds.');
      expect(getAudibleCountText()).toEqual(lowestAudibleCount);
    });
  });
  describe('screen reader tools', () => {
    it('should not place aria-hidden elements inside aria-live elements', () => {
      setupDialog({
        'data-timeout': 130,
        'data-countdown': 50,
        'data-message': 'time:',
        'data-sign-out-url': 'signout',
        'data-timeout-url': 'timeout',
      });

      pretendSecondsHavePassed(80);

      expect(testScope.latestDialog$element.querySelector('[aria-live] [aria-hidden]')).toBeNull();
    });
  });
  describe('techy features', () => {
    it('should not rely on timeout/interval accuracy for countdown', () => {
      setupDialog({
        'data-timeout': 80,
        'data-countdown': 50,
        'data-message': 'You will be timed out in',
      });

      pretendSecondsHavePassed(29);

      assume(dialog.displayDialog).not.toHaveBeenCalled();
      pretendSecondsHavePassed(1);

      expect(dialog.displayDialog).toHaveBeenCalled();
      expect(getVisualCountText()).toEqual('You will be timed out in 50 seconds.');
      testScope.currentDateTime += 2 * 1000; // two seconds go by without any interval events
      pretendSecondsHavePassed(1);

      expect(dialog.displayDialog).toHaveBeenCalled();
      expect(getVisualCountText()).toEqual('You will be timed out in 47 seconds.');
    });
    describe('Timeouts', () => {
      beforeEach(() => {
        testScope.intervalReturn = { 'data-message': 'this has been returned from a spy' };
        testScope.timeoutFirstRun = true;
        jest.clearAllTimers();

        mock.spyOn(window, 'clearTimeout').mockImplementation(() => {
        });
        mock.spyOn(window, 'setTimeout').mockImplementation((fn) => {
          if (testScope.timeoutFirstRun) {
            testScope.timeoutFirstRun = false;
            fn();
            return undefined;
          }
          return testScope.intervalReturn;
        });

        setupDialog({ 'data-timeout': 130, 'data-countdown': 120 });
        pretendSecondsHavePassed(30);
        assume(window.setTimeout).toHaveBeenCalled();
        assume(window.clearTimeout).not.toHaveBeenCalled();
      });

      it('should clearTimeout on cleanup', () => {
        testScope.timeoutDialogControl.cleanup();
        expect(window.clearTimeout).toHaveBeenCalledWith(testScope.intervalReturn);
      });

      it('should clearInterval on closeDialog', () => {
        pretendDialogWasClosedWithoutButtonPress();
        expect(window.clearTimeout).toHaveBeenCalledWith(testScope.intervalReturn);
      });
    });
    it('shouldn\'t regenerate audible countdown', () => {
      setupDialog({
        'data-timeout': 80,
        'data-countdown': 70,
      });
      pretendSecondsHavePassed(20);
      let currentValue;
      const setterSpy = jest.fn((newValue) => {
        currentValue = newValue;
      });
      const $originalElem = testScope.latestDialog$element.querySelector(audibleCountSelector);
      assume($originalElem).not.toBeNull();
      currentValue = $originalElem.innerText;

      Object.defineProperty($originalElem, 'innerText', {
        set: setterSpy,
        get: jest.fn(() => currentValue),
      });

      pretendSecondsHavePassed(19);
      expect(setterSpy).not.toHaveBeenCalled();

      pretendSecondsHavePassed(1);
      expect(setterSpy).toHaveBeenCalled();
    });
  });
});
