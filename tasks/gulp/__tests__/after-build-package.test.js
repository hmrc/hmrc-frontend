/* eslint-env jest */

const fs = require('fs')
const path = require('path')
const util = require('util')

const sass = require('node-sass')
const recursive = require('recursive-readdir')

const configPaths = require('../../../config/paths.json')

const sassRender = util.promisify(sass.render)
const readFile = util.promisify(fs.readFile)

describe('package/', () => {
  it('should contain the expected files', () => {
    const filesToIgnore = ['.DS_Store']

    // Build an array of the files that are present in the package directory.
    const actualPackageFiles = () => {
      return recursive(configPaths.package, filesToIgnore).then(
        files => {
          return files
            // Remove /package prefix from filenames
            .map(file => file.replace(/^package\//, ''))
            // Sort to make comparison easier
            .sort()
        },
        error => {
          console.error('Unable to get package files', error)
        }
      )
    }

    // Build an array of files we expect to be found in the package directory,
    // based on the contents of the src directory.
    const expectedPackageFiles = () => {
      const srcFilesToIgnore = [
        'govuk-prototype-kit.config.json',
        '.DS_Store',
        '*.test.js',
        '*.yaml',
        'example.njk',
        'README.njk',
        '*.snap'
      ]

      const additionalFilesNotFromSrc = [
        'check-compatibility.js',
        'govuk-prototype-kit.config.json',
        'package.json',
        'README.md'
      ]

      return recursive(configPaths.src, srcFilesToIgnore).then(
        files => {
          return files
            // Replace src/ prefix in filepaths with hmrc/ package namespace
            .map(file => file.replace(/^src\//, 'hmrc/'))
            // Allow for additional files that are not in src
            .concat(additionalFilesNotFromSrc)
            // Sort to make comparison easier
            .sort()
        },
        error => {
          console.error('Unable to get package files', error)
        }
      )
    }

    // Compare the expected directory listing with the files we expect
    // to be present
    Promise.all([actualPackageFiles(), expectedPackageFiles()])
      .then(results => {
        const [actualPackageFiles, expectedPackageFiles] = results

        expect(actualPackageFiles).toEqual(expectedPackageFiles)
      })
  })

  describe('README.md', () => {
    it('is added', () => {
      return readFile(path.join(configPaths.package, 'README.md'), 'utf8')
        .then(contents => {
          // Look for H1 matching 'GOV.UK Frontend' from existing README
          expect(contents).toMatch(/^# HMRC Frontend/)
        }).catch(error => {
          throw error
        })
    })
  })

  describe('all.scss', () => {
    it('should compile without throwing an exeption', async () => {
      const allScssFile = path.join(configPaths.package, 'hmrc/all.scss')
      await sassRender({ file: allScssFile })
    })
  })
})
