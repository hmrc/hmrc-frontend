export default class SessionActivityService {
  constructor(BrowserBroadcastChannel) {
    this.activityChannel = BrowserBroadcastChannel && new BrowserBroadcastChannel('session-activity');
  }

  logActivity() {
    if (this.activityChannel) {
      const event = { timestamp: Date.now() };
      this.activityChannel.postMessage(event);
    }
  }

  onActivity(callback) {
    if (this.activityChannel) {
      this.activityChannel.onmessage = (event) => {
        callback(event.data);
      };
    }
  }
}
