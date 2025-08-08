/* eslint-env jest */
const { writeFileSync, promises: { rm, mkdtemp } } = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { tmpdir } = require('os');

describe('govuk-frontend version compatibility check', () => {
  const compatibilityCheckScript = path.resolve(__dirname, '../../../check-compatibility-with-govuk-frontend-version.js');

  let tmpDir;

  beforeEach(async () => {
    tmpDir = await mkdtemp(path.join(tmpdir(), 'hmrc-frontend-unit-tests-'));
  });

  afterEach(async () => {
    await rm(tmpDir, {
      recursive: true,
      force: true, // ignores exceptions if target doesn't exist
    });
    jest.resetAllMocks();
  });

  const createMockPackage = (contents) => writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify(contents));

  const runCompatibilityCheck = (extraEnv = {}) => exec(`node ${compatibilityCheckScript}`, {
    cwd: tmpDir,
    env: {
      ...process.env, // because we need to inherit PATH
      INIT_CWD: tmpDir,
      ...extraEnv,
    },
  });

  describe('Installing outside of a Prototype kit project', () => {
    it('should not run the check', (done) => {
      createMockPackage({
        dependencies: {
          'govuk-frontend': '4.4.0',
          'hmrc-frontend': '6.79.0',
        },
      });
      runCompatibilityCheck().on('exit', (code) => {
        try {
          expect(code).toBe(0);
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });

  describe('Installing inside of a Prototype kit project', () => {
    describe('Installing with a compatible version', () => {
      it('should exit the process with code 0', (done) => {
        createMockPackage({
          dependencies: {
            'govuk-prototype-kit': '13.0.0',
            'govuk-frontend': '5.11.0',
            'hmrc-frontend': '6.79.0',
          },
        });
        runCompatibilityCheck().on('exit', (code) => {
          try {
            expect(code).toBe(0);
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });

    describe('Installing with a compatible version and different characters in the version', () => {
      it('should exit the process with code 0', (done) => {
        createMockPackage({
          dependencies: {
            'govuk-prototype-kit': '^13.0.0',
            'govuk-frontend': '^5.11.0-rc.1',
            'hmrc-frontend': '^6.79.0',
          },
        });
        runCompatibilityCheck().on('exit', (code) => {
          try {
            expect(code).toBe(0);
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });

    describe('Installing with an incompatible version', () => {
      it('should exit the process with code 1', (done) => {
        createMockPackage({
          dependencies: {
            'govuk-prototype-kit': '13.0.0',
            'govuk-frontend': '4.4.0',
            'hmrc-frontend': '6.79.0',
          },
        });
        runCompatibilityCheck().on('exit', (code) => {
          try {
            expect(code).toBe(1);
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });

    describe('Installing with an incompatible version and different characters in the version', () => {
      it('should exit the process with code 1', (done) => {
        createMockPackage({
          dependencies: {
            'govuk-prototype-kit': '^13.0.0',
            'govuk-frontend': '^4.4.0-rc.1',
            'hmrc-frontend': '^6.79.0',
          },
        });
        runCompatibilityCheck().on('exit', (code) => {
          try {
            expect(code).toBe(1);
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });

    describe('when \'env.HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK\' is set', () => {
      it('should exit the process with code 0 when set to true', (done) => {
        createMockPackage({
          dependencies: {
            'govuk-prototype-kit': '13.0.0',
            'govuk-frontend': '4.4.0',
            'hmrc-frontend': '6.79.0',
          },
        });
        runCompatibilityCheck({
          HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK: 'true',
        }).on('exit', (code) => {
          try {
            expect(code).toBe(0);
            done();
          } catch (error) {
            done(error);
          }
        });
      });

      it('should exit the process with code 1 when set with a value other than true and incompatible version', (done) => {
        createMockPackage({
          dependencies: {
            'govuk-prototype-kit': '13.0.0',
            'govuk-frontend': '4.4.0',
            'hmrc-frontend': '6.79.0',
          },
        });
        runCompatibilityCheck({
          HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK: 'blue',
        }).on('exit', (code) => {
          try {
            expect(code).toBe(1);
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });
    describe('when \'npm_config_hmrc_frontend_disable_compatibility_check\' is set', () => {
      it('should exit the process with code 0 when set to true', (done) => {
        createMockPackage({
          dependencies: {
            'govuk-prototype-kit': '13.0.0',
            'govuk-frontend': '4.4.0',
            'hmrc-frontend': '6.79.0',
          },
        });
        runCompatibilityCheck({
          npm_config_hmrc_frontend_disable_compatibility_check: 'true',
        }).on('exit', (code) => {
          try {
            expect(code).toBe(0);
            done();
          } catch (error) {
            done(error);
          }
        });
      });

      it('should exit the process with code 1 when set with a value other than true and incompatible version', (done) => {
        createMockPackage({
          dependencies: {
            'govuk-prototype-kit': '13.0.0',
            'govuk-frontend': '4.4.0',
            'hmrc-frontend': '6.79.0',
          },
        });
        runCompatibilityCheck({
          npm_config_hmrc_frontend_disable_compatibility_check: 'blue',
        }).on('exit', (code) => {
          try {
            expect(code).toBe(1);
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });
  });
});
