/* eslint-env jest */

const fs = require('fs');
const path = require('path');
const util = require('util');
const sass = require('node-sass');
const recursive = require('recursive-readdir');
const pkg = require('../../../package.json');

const configPaths = require('../../../config/paths.json');

const sassRender = util.promisify(sass.render);
const readFile = util.promisify(fs.readFile);

describe('package/', () => {
  it('should contain the expected files', () => {
    const filesToIgnore = ['.DS_Store'];

    // Build an array of the files that are present in the package directory.
    const getActualPackageFiles = () => recursive(configPaths.package, filesToIgnore).then(
      (files) => files
      // Remove /package prefix from filenames
        .map((file) => file.replace(/^package\//, ''))
      // Sort to make comparison easier
        .sort(),
      (error) => {
        console.error('Unable to get package files', error);
      },
    );

    // Build an array of files we expect to be found in the package directory,
    // based on the contents of the src directory.
    const getExpectedPackageFiles = () => {
      const srcFilesToIgnore = [
        'govuk-prototype-kit.config.json',
        '.DS_Store',
        '*.test.js',
        '*.yaml',
        'example.njk',
        'README.njk',
        '*.snap',
      ];

      const additionalFilesNotFromSrc = [
        'govuk-prototype-kit.config.json',
        'package.json',
        'README.md',
        'LICENSE',
        `hmrc/accessible-autocomplete-${pkg.version}.js`,
        `hmrc/accessible-autocomplete-${pkg.version}.css`,
        `hmrc/maps/accessible-autocomplete-${pkg.version}.css.map`,
        'hmrc/govuk/fonts/bold-affa96571d-v2.woff',
        'hmrc/govuk/fonts/bold-b542beb274-v2.woff2',
        'hmrc/govuk/fonts/light-94a07e06a1-v2.woff2',
        'hmrc/govuk/fonts/light-f591b13f7d-v2.woff',
        'hmrc/govuk/images/favicon.ico',
        'hmrc/govuk/images/govuk-apple-touch-icon-152x152.png',
        'hmrc/govuk/images/govuk-apple-touch-icon-167x167.png',
        'hmrc/govuk/images/govuk-apple-touch-icon-180x180.png',
        'hmrc/govuk/images/govuk-apple-touch-icon.png',
        'hmrc/govuk/images/govuk-crest-2x.png',
        'hmrc/govuk/images/govuk-crest.png',
        // 'hmrc/govuk/images/govuk-logotype-crown.png',
        'hmrc/govuk/images/govuk-mask-icon.svg',
        'hmrc/govuk/images/govuk-opengraph-image.png',
        `hmrc/hmrc-frontend-${pkg.version}.min.css`,
        `hmrc/hmrc-frontend-${pkg.version}.min.js`,
        `hmrc/hmrc-frontend-ie8-${pkg.version}.min.css`,
        `hmrc/maps/hmrc-frontend-${pkg.version}.min.css.map`,
        `hmrc/maps/hmrc-frontend-${pkg.version}.min.js.map`,
        `hmrc/maps/hmrc-frontend-ie8-${pkg.version}.min.css.map`,
        'hmrc/vendor/html5shiv.min.js',
        'hmrc/VERSION.txt',
      ];

      return recursive(configPaths.src, srcFilesToIgnore).then(
        (files) => files
        // Replace src/ prefix in filepaths with hmrc/ package namespace
          .map((file) => file.replace(/^src\//, 'hmrc/'))
        // Allow for additional files that are not in src
          .concat(additionalFilesNotFromSrc)
        // Sort to make comparison easier
          .sort(),
        (error) => {
          console.error('Unable to get package files', error);
        },
      );
    };

    // Compare the expected directory listing with the files we expect
    // to be present
    Promise.all([getActualPackageFiles(), getExpectedPackageFiles()])
      .then((results) => {
        const [actualPackageFiles, expectedPackageFiles] = results;

        expect(actualPackageFiles).toEqual(expectedPackageFiles);
      });
  });

  describe('README.md', () => {
    it('is added', () => readFile(path.join(configPaths.package, 'README.md'), 'utf8')
      .then((contents) => {
        // Look for H1 matching 'GOV.UK Frontend' from existing README
        expect(contents).toMatch(/^# HMRC Frontend/);
      }).catch((error) => {
        throw error;
      }));
  });

  describe('LICENSE', () => {
    it('is added', () => readFile(path.join(configPaths.package, 'LICENSE'), 'utf8')
      .then((contents) => {
        // Look for H1 matching 'GOV.UK Frontend' from existing README
        expect(contents).toMatch(/^ {33}Apache License/);
      }).catch((error) => {
        throw error;
      }));
  });

  describe('all.scss', () => {
    const govukLink = path.join(configPaths.packageTest, 'govuk-frontend');
    const hmrcLink = path.join(configPaths.packageTest, 'hmrc-frontend');
    const removeSymLinksIfPresent = async () => {
      try {
        await fs.promises.unlink(govukLink);
      } catch (e) {
        // empty
      }
      try {
        await fs.promises.unlink(hmrcLink);
      } catch (e) {
        // empty
      }
    };
    const createSymlinks = async () => {
      await fs.promises.mkdir(path.join(configPaths.packageTest), { recursive: true });
      await removeSymLinksIfPresent();
      const projectRoot = path.join(__dirname, '../../..');
      await fs.promises.symlink(path.join(projectRoot, configPaths.govukFrontend), govukLink);
      await fs.promises.symlink(path.join(projectRoot, configPaths.package), hmrcLink);
    };

    it('should compile without throwing an exception', async () => {
      await createSymlinks();
      try {
        const allScssFile = path.join(configPaths.packageTest, 'hmrc-frontend/hmrc/all.scss');
        await sassRender({ file: allScssFile });
      } catch (e) {
        await removeSymLinksIfPresent();
        console.error(e.messageFormatted || e);
        throw e;
      }
      await removeSymLinksIfPresent();
    });
  });
});
