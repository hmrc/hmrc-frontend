/* eslint-env jest */
import BackLinkHelper from './back-link-helper';

describe('/components/back-link-helper', () => {
  const mockWindow = {
    history: {
      replaceState: jest.fn(),
      back: jest.fn(),
    },
    location: {
      href: 'https://tax.service.gov.uk/current/url',
      host: 'https://tax.service.gov.uk',
    },
  };

  const mockDocument = {
    referrer: 'https://tax.service.gov.uk/some/referrer',
  };

  const mockAnchorTag = {
    addEventListener: jest.fn(),
    classList: {
      add: jest.fn(),
    },
  };

  const mockEvent = {
    preventDefault: jest.fn(),
  };

  beforeEach(() => {
    mockWindow.history.back.mockReset();
    mockWindow.history.replaceState.mockReset();
    mockAnchorTag.addEventListener.mockReset();
    mockEvent.preventDefault.mockReset();
  });

  describe('init', () => {
    it('updates the window history with the current URL', () => {
      const sut = new BackLinkHelper(mockAnchorTag, mockWindow, mockDocument);
      sut.init();

      expect(mockWindow.history.replaceState)
        .toHaveBeenCalledWith(null, null, 'https://tax.service.gov.uk/current/url');
    });

    it('does not throw if window.history API is absent', () => {
      const ancientBrowser = {};
      const sut = new BackLinkHelper(mockAnchorTag, ancientBrowser, mockDocument);
      expect(() => sut.init()).not.toThrow();
    });

    it('does not throw if window.history.replaceState is not implemented', () => {
      const ancientBrowser = { history: {}, location: { host: 'https://tax.service.gov.uk' } };
      const sut = new BackLinkHelper(mockAnchorTag, ancientBrowser, mockDocument);
      expect(() => sut.init()).not.toThrow();
    });

    it('adds a click event handler which delegates to window.history.back()', () => {
      const sut = new BackLinkHelper(mockAnchorTag, mockWindow, mockDocument);
      sut.init();

      expect(mockAnchorTag.addEventListener)
        .toHaveBeenCalledWith('click', expect.any(Function));
      expect(mockWindow.history.back).not.toHaveBeenCalled();

      const callbackFn = mockAnchorTag.addEventListener.mock.calls[0][1];
      callbackFn(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockWindow.history.back).toHaveBeenCalled();
    });

    it('does not add .hmrc-hidden-backlink class to backlink when document referer is empty', () => {
      const sut = new BackLinkHelper(mockAnchorTag, mockWindow, { referrer: '' });
      sut.init();

      expect(mockAnchorTag.classList.add.mock.calls).toHaveLength(0);
    });

    it('adds .hmrc-hidden-backlink class to backlink if document referer is on a different domain', () => {
      const sut = new BackLinkHelper(mockAnchorTag, mockWindow, { referrer: 'https://some.other.site/some/referrer' });
      sut.init();

      expect(mockAnchorTag.classList.add.mock.calls[0][0]).toBe('hmrc-hidden-backlink');
    });

    it('does not throw if window.history.back() is not implemented', () => {
      const ancientBrowser = { history: {}, location: { host: 'https://tax.service.gov.uk' } };
      const sut = new BackLinkHelper(mockAnchorTag, ancientBrowser, mockDocument);
      sut.init();

      const callbackFn = mockAnchorTag.addEventListener.mock.calls[0][1];
      expect(() => callbackFn(mockEvent)).not.toThrow();
    });
  });
});
