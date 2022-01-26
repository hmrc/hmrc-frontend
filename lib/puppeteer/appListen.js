const app = require('../../app/app')({
  nunjucks: { watch: false },
});

// Jest Setup.js expects promises, using callbacks results in a race condition.
const appListen = (port) => new Promise((resolve) => {
  const server = app.listen(port, () => {
    resolve(server);
  });
});

module.exports = appListen;
