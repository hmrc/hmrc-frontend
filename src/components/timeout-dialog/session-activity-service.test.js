/* eslint-env jest */
import SessionActivityService from './session-activity-service';

describe('/components/timeout-dialog/session-activity-service', () => {
  let testScope; // an object which is reset between test runs
  const mockBroadcastChannel = {
    postMessage: jest.fn(),
    onmessage: undefined,
  };
  const mockBroadcastChannelFactory = jest.fn().mockImplementation(() => mockBroadcastChannel);

  beforeEach(() => {
    testScope = {
      currentDateTime: 1554196031049, // the time these tests were written
      // - this can change, but it's best not to write randomness into tests
    };
    jest.spyOn(Date, 'now').mockImplementation(() => testScope.currentDateTime);
  });

  afterEach(() => {
    mockBroadcastChannel.postMessage.mockReset();
  });

  describe('logActivity', () => {
    it('should post an event containing the current timestamp to the activity channel', () => {
      const sut = new SessionActivityService(mockBroadcastChannelFactory);
      sut.logActivity();

      expect(mockBroadcastChannel.postMessage)
        .toHaveBeenCalledWith({ timestamp: testScope.currentDateTime });
    });

    describe('when BroadcastChannel is undefined', () => {
      it('should do nothing', () => {
        const sut = new SessionActivityService(undefined);
        expect(() => sut.logActivity()).not.toThrow();
      });
    });
  });

  describe('onActivity', () => {
    it('should register the passed callback fn with the broadcast channel', () => {
      const sut = new SessionActivityService(mockBroadcastChannelFactory);
      const someCallback = jest.fn();

      sut.onActivity(someCallback);

      expect(mockBroadcastChannel.onmessage).toBeDefined();
    });

    it('should call the passed callback fn with the data from the broadcast channel callback', () => {
      const sut = new SessionActivityService(mockBroadcastChannelFactory);
      const clientCallback = jest.fn();

      sut.onActivity(clientCallback);

      const broadcastChannelCallback = mockBroadcastChannel.onmessage;
      const someTimestamp = Date.now();
      broadcastChannelCallback({ data: { timestamp: someTimestamp } });

      expect(clientCallback).toHaveBeenCalledWith({ timestamp: someTimestamp });
    });

    describe('when BroadcastChannel is undefined', () => {
      it('should do nothing', () => {
        const sut = new SessionActivityService(undefined);
        expect(() => sut.onActivity(jest.fn())).not.toThrow();
      });
    });
  });
});
