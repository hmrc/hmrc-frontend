import HMRCFrontend from './all';
import BackLinkHelper from './components/back-link-helper/back-link-helper';

jest.spyOn(BackLinkHelper.prototype, 'init');

describe('Init All', () => {
  beforeEach(() => {
    document.body.innerHTML = ''; // basic jsdom reset, doesn't fully reset everything
  });

  describe('Back Links', () => {
    function addBackLinkToPage() {
      const elem = document.createElement('a');
      elem.setAttribute('data-module', 'hmrc-back-link');
      document.body.appendChild(elem);
    }

    it('should initialise when a matching element exists on the page', () => {
      addBackLinkToPage();
      HMRCFrontend.initAll();
      expect(BackLinkHelper.prototype.init).toHaveBeenCalled();
    });

    it('should not initialise when there are no matching elements on the page', () => {
      HMRCFrontend.initAll();
      expect(BackLinkHelper.prototype.init).not.toHaveBeenCalled();
    });

    it('should initialise each matching element found on the page', () => {
      addBackLinkToPage();
      addBackLinkToPage();
      HMRCFrontend.initAll();
      expect(BackLinkHelper.prototype.init).toHaveBeenCalledTimes(2);
    });

    it('should initialise correctly configured elements found on the page', () => {
      const logSpy = jest.spyOn(global.console, 'error');
      addBackLinkToPage();
      const brokenTimeoutDialog = document.createElement('meta');
      brokenTimeoutDialog.setAttribute('name', 'hmrc-timeout-dialog');
      brokenTimeoutDialog.setAttribute('content', 'hmrc-timeout-dialog');
      brokenTimeoutDialog.setAttribute('data-timeout', '60');
      brokenTimeoutDialog.setAttribute('data-countdown', '55');
      brokenTimeoutDialog.setAttribute('data-keep-alive-url', '?keepalive');
      brokenTimeoutDialog.setAttribute('data-sign-out-url', ''); // broken configuration of timeout-dialog will error
      brokenTimeoutDialog.setAttribute('data-synchronise-tabs', 'true');
      document.head.appendChild(brokenTimeoutDialog);
      HMRCFrontend.initAll();
      expect(BackLinkHelper.prototype.init).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith('hmrc-frontend component initialisation failed', Error('Missing config item(s): [data-sign-out-url]'));
    });
  });
});
