/* eslint-env jest */
const { writeFileSync, unlink } = require('fs');
const path = require('path');
const { exec } = require('child_process');

describe('govuk-frontend version compatibility check', () => {
  const scriptPath = path.resolve(__dirname, '../../../check-compatibility-with-govuk-frontend-version.js');
  const mockPackagePath = path.resolve(__dirname, 'package.json');
  const createMockPackage = (contents) => writeFileSync(mockPackagePath, JSON.stringify(contents));

  afterAll(() => {
    unlink(mockPackagePath, () => {});
  });

  beforeAll(() => {
    process.env.HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK = '';
    process.env.INIT_CWD = path.join(process.env.INIT_CWD, 'tasks/gulp/__tests__');
  });

  describe('Installing outside of a Prototype kit project', () => {
    it('should exit the process with code 0', (done) => {
      createMockPackage({
        name: 'foo',
      });

      const child = exec(`node ${scriptPath}`);
      child.on('exit', (code) => {
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
            'govuk-frontend': '5.11.0',
            'hmrc-frontend': '6.79.0',
          },
        });

        const child = exec(`node ${scriptPath}`);
        child.on('exit', (code) => {
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
            'govuk-frontend': '4.4.0',
            'hmrc-frontend': '6.79.0',
          },
        });
        const child = exec(`node ${scriptPath}`, { env: process.env.INIT_CWD });
        child.on('exit', (code) => {
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
        process.env.HMRC_FRONTEND_DISABLE_COMPATIBILITY_CHECK = 'true';
        const child = exec(`node ${scriptPath}`);
        child.on('exit', (code) => {
          try {
            expect(code).toBe(0);
            done();
          } catch (error) {
            done(error);
          }
        });
      });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
