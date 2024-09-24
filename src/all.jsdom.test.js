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
  });
});
