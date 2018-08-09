/* eslint-env jest */
const path = require('path')
const lib = require('../../../lib/file-helper')
const configPaths = require('../../../config/paths.json')

describe('dist/', () => {
  let version = require(path.join('../../../package.json')).version

  describe(`hmrc-frontend-${version}.min.css`, () => {
    const stylesheet = lib.readFileContents(path.join(configPaths.dist, `hmrc-frontend-${version}.min.css`))

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })
  })

  describe(`hmrc-frontend-ie8-${version}.min.css`, () => {
    const stylesheet = lib.readFileContents(path.join(configPaths.dist, `hmrc-frontend-ie8-${version}.min.css`))

    it('should not contain current media query displayed on body element', () => {
      expect(stylesheet).not.toMatch(/body:before{content:/)
    })
  })
})
