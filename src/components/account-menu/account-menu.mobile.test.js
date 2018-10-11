/**
 * @jest-environment ./lib/puppeteer/environment.js
 */

/* eslint-env jest */

const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
const configPaths = require('../../../config/paths.json')
const PORT = configPaths.ports.test

let browser
let page
let baseUrl = 'http://localhost:' + PORT

beforeAll(async () => {
  browser = global.__BROWSER__
  page = await browser.newPage()
  await page.emulate(iPhone)
})

afterAll(async () => {
  await page.close()
})

describe('When the page is loaded on mobile', () => {
  const nav = '.hmrc-account-menu'
  const mobileMenuLink = '.hmrc-account-menu__link--menu'
  const mobileSubMenu = '.hmrc-account-menu__main'
  const mobileBack = '.hmrc-account-menu__link--back'
  const yourAccountLink = '#account-menu__main-2'
  const subnavItems = '.hmrc-account-menu__main .hmrc-account-menu__link'

  it('should show the mobile version of the navigation', async () => {
    await page.goto(baseUrl + '/components/account-menu/default/preview')

    const navClasses = await page.$eval(nav, el => el.className)
    expect(navClasses).toContain('is-smaller')

    const mobileMenuLinkIsHidden = await page.$eval(mobileMenuLink, el => el.getAttribute('aria-hidden'))
    expect(mobileMenuLinkIsHidden).toBe('false')

    const mobileMenuLinkClasses = await page.$eval(mobileMenuLink, el => el.className)
    expect(mobileMenuLinkClasses).toContain('js-visible')
    expect(mobileMenuLinkClasses).not.toContain('js-hidden')

    const mobileSubMenuClasses = await page.$eval(mobileSubMenu, el => el.className)
    expect(mobileSubMenuClasses).toContain('js-hidden')

    const mobileBackIsHidden = await page.$eval(mobileBack, el => el.getAttribute('aria-hidden'))
    expect(mobileBackIsHidden).toBe('true')
  })

  it('should show the sub nav when account menu is clicked', async () => {
    await page.goto(baseUrl + '/components/account-menu/default/preview')

    await page.click(mobileMenuLink)

    const mobileMenuLinkClasses = await page.$eval(mobileMenuLink, el => el.className)
    expect(mobileMenuLinkClasses).toContain('account-home--account--is-open')

    const mobileMenuLinkIsExpanded = await page.$eval(mobileMenuLink, el => el.getAttribute('aria-expanded'))
    expect(mobileMenuLinkIsExpanded).toBe('true')

    const mobileSubMenuClasses = await page.$eval(mobileSubMenu, el => el.className)
    expect(mobileSubMenuClasses).toContain('main-nav-is-open')

    const mobileSubMenuIsExpanded = await page.$eval(mobileSubMenu, el => el.getAttribute('aria-expanded'))
    expect(mobileSubMenuIsExpanded).toBe('true')

    const yourAccountLinkIsExpanded = await page.$eval(yourAccountLink, el => el.getAttribute('aria-expanded'))
    expect(yourAccountLinkIsExpanded).toBe('false')
  })

  it('should reveal the Your Account subnav when clicked', async () => {
    await page.goto(baseUrl + '/components/account-menu/default/preview')

    await page.click(mobileMenuLink)
    await page.click(yourAccountLink)

    const navClasses = await page.$eval(nav, el => el.className)
    expect(navClasses).toContain('subnav-is-open')

    const mobileSubMenuClasses = await page.$eval(mobileSubMenu, el => el.className)
    expect(mobileSubMenuClasses).toContain('subnav-is-open')

    const yourAccountLinkIsExpanded = await page.$eval(yourAccountLink, el => el.getAttribute('aria-expanded'))
    expect(yourAccountLinkIsExpanded).toBe('true')

    const yourAccountLinkParentClasses = await page.$eval(yourAccountLink, el => el.parentElement.className)
    expect(yourAccountLinkParentClasses).toContain('active-subnav-parent')

    const mobileBackClasses = await page.$eval(mobileBack, el => el.className)
    expect(mobileBackClasses).not.toContain('hidden')

    const mobileBackIsHidden = await page.$eval(mobileBack, el => el.getAttribute('aria-hidden'))
    expect(mobileBackIsHidden).toBe('false')

    const subnavItemsParentsClasses = await page.$$eval(subnavItems, els => els.map(el => el.parentElement.className))
    subnavItemsParentsClasses.forEach(subnavItemsParentClasses => {
      if ([mobileBack.substr(1), 'active-subnav-parent'].includes(subnavItemsParentClasses)) {
        expect(subnavItemsParentClasses).not.toContain('hidden')
      } else {
        expect(subnavItemsParentClasses).toContain('hidden')
      }
    })
  })

  it('should close the Your Account navigation when clicking back', async () => {
    await page.goto(baseUrl + '/components/account-menu/default/preview')

    await page.click(mobileMenuLink)
    await page.click(yourAccountLink)
    await page.click(`${mobileBack} a`)

    const navClasses = await page.$eval(nav, el => el.className)
    expect(navClasses).not.toContain('hmrc-subnav-is-open')

    const mobileSubMenuClasses = await page.$eval(mobileSubMenu, el => el.className)
    expect(mobileSubMenuClasses).toContain('main-nav-is-open')
    expect(mobileSubMenuClasses).not.toContain('hmrc-subnav-is-open')

    const mobileBackClasses = await page.$eval(mobileBack, el => el.className)
    expect(mobileBackClasses).toContain('hidden')

    const mobileBackIsHidden = await page.$eval(mobileBack, el => el.getAttribute('aria-hidden'))
    expect(mobileBackIsHidden).toBe('true')

    const subnavItemsHidden = await page.$$eval(subnavItems, els => els.filter(el => el.parentElement.className === 'hidden').length)
    expect(subnavItemsHidden).toBe(0)
  })
})
