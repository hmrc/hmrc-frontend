const app = require('../../app/app.js')({
  nunjucks: { watch: false }
})

// Jest Setup.js expects promises, using callbacks results in a race condition.
const appListen = (port) => {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      resolve(server)
    })
  })
}

module.exports = appListen
