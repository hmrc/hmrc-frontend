/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT
// let subNavId
// let nav

beforeAll(async (done) => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  await page.goto(baseUrl + '/components/account-menu/default/preview')
  const nav = await page.evaluate(() => document.getElementById('secondary-nav'))
  console.log({ ...nav
  })
  done()
})

afterAll(async (done) => {
  await page.close()
  await browser.close()
  done()
})

describe('/components/account-menu', () => {
  // Default appearance of Account menu when a page is loaded
  describe('When a page with an account-menu is loaded', () => {
    it('should display with a closed subnav on the page when loaded', async (done) => {
      // ToDo: wrap all this into a single awaitable function
      /* ToDo: work out how to passs in the id as a variable
            subNavId = await page.evaluate(() => {
                document.getElementById('account-menu__main-2')
                        .getAttribute('aria-owns'))
                } */

      const classList = await page.evaluate(() => {
        return document
          .getElementById('subnav-your-account')
          .className.split(' ')
      })
      const ariaHidden = await page.evaluate(() => {
        return document
          .getElementById('subnav-your-account')
          .getAttribute('aria-hidden')
      })
      const ariaExpanded = await page.evaluate(() => {
        return document
          .getElementById('account-menu__main-2')
          .getAttribute('aria-expanded')
      })

      expect(classList).not.toContain('hmrc-subnav-reveal')
      expect(ariaHidden).toBe('true')
      expect(ariaExpanded).toBe('false')
      done()
    })

    it('Should have all mobile elements hidden', async (done) => {
      const classList = await page.evaluate(() => {
        return document
          .getElementsByClassName('hmrc-account-menu__link--menu')[0]
          .className.split(' ')
      })
      const ariaHidden = await page.evaluate(() => {
        return document
          .getElementsByClassName('hmrc-account-menu__link--menu')[0]
          .getAttribute('aria-hidden')
      })
      const ariaExpanded = await page.evaluate(() => {
        return document
          .getElementsByClassName('hmrc-account-menu__link--menu')[0]
          .getAttribute('aria-expanded')
      })

      expect(classList).toContain('js-hidden')
      expect(ariaHidden).toBe('true')
      expect(ariaExpanded).toBe('false')
      done()
    })

    it('Should have the mobile \'back\' menu item hidden', async (done) => {
      const classList = await page.evaluate(() => {
        return document
          .getElementsByClassName('hmrc-account-menu__link--back')[0]
          .className.split(' ')
      })
      const ariaHidden = await page.evaluate(() => {
        return document
          .getElementsByClassName('hmrc-account-menu__link--back')[0]
          .getAttribute('aria-hidden')
      })

      expect(classList).toContain('hidden')
      expect(ariaHidden).toBe('true')
      done()
    })
  })
  // Opening the account menu
  describe('When \'Your account\' is opened', () => {
    it('should reveal the subnav', () => {
      return Promise.reject(new Error('not implemented'))
    })
    it('should close the subnav in second click', () => {
      return Promise.reject(new Error('not implemented'))
    })
  })
})
