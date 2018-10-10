/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */
const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

beforeAll(async (done) => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  await page.setViewport(
    { 'width': 320,
      'height': 480,
      'isMobile': true,
      'hasTouch': true,
      'isLandscape': false
    })
  await page.goto(baseUrl + '/components/account-menu/default/preview')
  done()
})

describe('When the page is loaded on mobile', () => {
  it('should show the mobile version of the navigation', () => {
    return Promise.reject(new Error('not implemented'))
    // do stuff
  })
  it('should show the sub nav when account menu is clicked', () => {
    return Promise.reject(new Error('not implemented'))
    // do stuff
  })
  it('should reveal the Your Account subnav when clicked', () => {
    return Promise.reject(new Error('not implemented'))
    // do stuff
  })
  it('should close the your account navigation when clicking back', () => {
    return Promise.reject(new Error('not implemented'))
    // do stuff
  })
})
