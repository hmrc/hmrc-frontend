/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

// const configPaths = require('../../../config/paths.json')
// const PORT = configPaths.ports.test

let browser
let page
// let baseUrl = 'http://localhost:' + PORT

beforeAll(async (done) => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  done()
})

afterAll(async (done) => {
  await page.close()
  done()
})

describe('/components/account-menu', () => {
  it('Should not error with a not implemented error', () => {
    return Promise.reject(new Error('not implemented'))
  })
})
