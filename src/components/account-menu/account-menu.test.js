/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT
// ToDo: learn how to pre-select the page element that we need to use
// let nav
// let subNavId
let yourAccountLink

beforeAll(async (done) => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  await page.goto(baseUrl + '/components/account-menu/default/preview')
  // ToDo: learn how to pre-select the page element that we need to use
  // nav = await page.$('#secondary-nav')
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
  describe('When \'Your account\' link is clicked', () => {
    beforeEach(async (done) => {
      await page.goto(baseUrl + '/components/account-menu/default/preview')
      yourAccountLink = await page.$('#account-menu__main-2')
      await yourAccountLink.click()
      done()
    })

    it('should reveal the subnav', async (done) => {
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

      expect(classList).toContain('hmrc-subnav-reveal')
      expect(ariaHidden).toBe('false')
      expect(ariaExpanded).toBe('true')
      done()
    })
    it('should close the subnav in second click', async (done) => {
      await yourAccountLink.click()

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
  })
})
