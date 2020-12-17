/* eslint-env jest */

const fs = require('fs');
const path = require('path');
const util = require('util');

const sass = require('node-sass');
const recursive = require('recursive-readdir');

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
        'check-compatibility.js',
        'govuk-prototype-kit.config.json',
        'package.json',
        'README.md',
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
