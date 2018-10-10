/**
 * @jest-environment ./lib/puppeteer/environment.js
 */
/* eslint-env jest */

const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

beforeAll(async () => {
  browser = global.__BROWSER__
  page = await browser.newPage()
})

afterAll(async () => {
  await page.close()
  await browser.close()
})

describe('/components/account-menu', () => {
  // Default appearance of Account menu when a page is loaded
  describe('When a page with an account-menu is loaded', () => {
    it('should display with a closed subnav on the page when loaded', async () => {
      await page.goto(baseUrl + '/components/account-menu/default/preview')

      const classList = await page.evaluate(() => document.getElementById('subnav-your-account').className)
      const ariaHidden = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'))
      const ariaExpanded = await page.evaluate(() => document.getElementById('account-menu__main-2').getAttribute('aria-expanded'))

      expect(classList).not.toContain('hmrc-subnav-reveal')
      expect(ariaHidden).toBe('true')
      expect(ariaExpanded).toBe('false')
    })

    it('Should have all mobile elements hidden', async () => {
      await page.goto(baseUrl + '/components/account-menu/default/preview')

      const classList = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].className)
      const ariaHidden = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].getAttribute('aria-hidden'))
      const ariaExpanded = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--menu')[0].getAttribute('aria-expanded'))

      expect(classList).toContain('js-hidden')
      expect(ariaHidden).toBe('true')
      expect(ariaExpanded).toBe('false')
    })

    it('Should have the mobile \'back\' menu item hidden', async () => {
      await page.goto(baseUrl + '/components/account-menu/default/preview')

      const classList = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--back')[0].className)
      const ariaHidden = await page.evaluate(() => document.getElementsByClassName('hmrc-account-menu__link--back')[0].getAttribute('aria-hidden'))

      expect(classList).toContain('hidden')
      expect(ariaHidden).toBe('true')
    })
  })

  // Opening the account menu
  describe('When \'Your account\' link is clicked', () => {
    it('should reveal the subnav', async () => {
      await page.goto(baseUrl + '/components/account-menu/default/preview')

      const yourAccountLink = await page.$('#account-menu__main-2')
      await yourAccountLink.click()

      const classList = await page.evaluate(() => document.getElementById('subnav-your-account').className)
      const ariaHidden = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'))
      const ariaExpanded = await page.evaluate(() => document.getElementById('account-menu__main-2').getAttribute('aria-expanded'))

      expect(classList).toContain('hmrc-subnav-reveal')
      expect(ariaHidden).toBe('false')
      expect(ariaExpanded).toBe('true')
    })

    it('should close the subnav in second click', async () => {
      await page.goto(baseUrl + '/components/account-menu/default/preview')

      const yourAccountLink = await page.$('#account-menu__main-2')
      await yourAccountLink.click()
      await yourAccountLink.click()

      const classList = await page.evaluate(() => document.getElementById('subnav-your-account').className)
      const ariaHidden = await page.evaluate(() => document.getElementById('subnav-your-account').getAttribute('aria-hidden'))
      const ariaExpanded = await page.evaluate(() => document.getElementById('account-menu__main-2').getAttribute('aria-expanded'))

      expect(classList).not.toContain('hmrc-subnav-reveal')
      expect(ariaHidden).toBe('true')
      expect(ariaExpanded).toBe('false')
    })
  })
})
