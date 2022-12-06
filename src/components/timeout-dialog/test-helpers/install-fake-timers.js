// This gets packaged up so it can be loaded inside a browser to fake the timeout functions during
// a test, the tool that we are using to package this for a browser environment only takes a file
// as input - we can't just pass this as a string instead.

const FakeTimers = require('@sinonjs/fake-timers');

window.clock = FakeTimers.install();
