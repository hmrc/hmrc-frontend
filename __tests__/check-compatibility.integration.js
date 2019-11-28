/* eslint-env jest */
import { writeFileSync } from 'fs'
import path from 'path'
import { exec } from 'child_process'

describe('Version compatibility check', () => {
  expect.extend({
    toContainPartial(array, str) {
      const pass = array.some(x => x.includes(str))
      return {
        message: () => `expected ${array}${pass ? ' NOT' : ''} to contain an item with ${str}`,
        pass,
      }
    }
  })

  const scriptPath = path.resolve(__dirname, '../check-compatibility.js')
  const mockPackagePath = path.resolve(__dirname, 'package.json')
  const mockEnv = { env: { ...process.env, 'INIT_CWD': './__tests__' } }

  const createMockPackage = (contents) => writeFileSync(mockPackagePath, JSON.stringify(contents))

  let logs
  let errors

  beforeEach(() => {
    logs = []
    errors = []
  })

  describe('Installing outside of Prototype kit', () => {
    it('should exit the process with code 0', (done) => {
      createMockPackage({
        name: 'foo'
      })

      const child = exec(`node ${scriptPath}`, mockEnv)
      child.stdout.on('data', (data) => logs.push(data))
      child.stderr.on('data', (error) => errors.push(error))
      child.on('error', (error) => errors.push(error))

      child.on('exit', (code) => {
        expect(code).toBe(0)
        expect(errors.length).toBe(0)
        expect(logs.length).toBe(0)
        done()
      })
    })
  })

  describe('Installing inside of Prototype kit', () => {
    describe('Installing a compatible version', () => {
      it('should exit the process with code 0', (done) => {
        createMockPackage({
          name: 'govuk-prototype-kit',
          version: '9.4.0'
        })

        const child = exec(`node ${scriptPath}`, mockEnv)
        child.stdout.on('data', (data) => logs.push(data))
        child.stderr.on('data', (error) => errors.push(error))
        child.on('error', (error) => errors.push(error))

        child.on('exit', (code) => {
          expect(code).toBe(0)
          expect(errors.length).toBe(0)
          expect(logs.length).toBe(0)
          done()
        })
      })
    })

    describe('Installing a future version', () => {
      it('should exit the process with code 0', (done) => {
        createMockPackage({
          name: 'govuk-prototype-kit',
          version: '100.0.0'
        })

        const child = exec(`node ${scriptPath}`, mockEnv)
        child.stdout.on('data', (data) => { console.log('data: ', data); logs.push(data) })
        child.stderr.on('data', (error) =>  { console.log('error: ', error); errors.push(error) })
        child.on('error', (error) => errors.push(error))

        child.on('exit', (code) => {
          expect(code).toBe(0)
          expect(errors.length).toBe(0)
          expect(logs.length).toBe(0)
          done()
        })
      })
    })

    describe('Installing a non-compatible version, but a compatible version exists', () => {
      it('should exit the process with code 1 and provide instructions for installing a compatible version if no other steps are required', (done) => {
        createMockPackage({
          name: 'govuk-prototype-kit',
          version: '8.7.2'
        })

        const child = exec(`node ${scriptPath}`, mockEnv)
        child.stdout.on('data', (data) => logs.push(data))
        child.stderr.on('data', (error) => errors.push(error))
        child.on('error', (error) => errors.push(error))

        child.on('exit', (code) => {
          expect(code).toBe(1)
          expect(errors.length).toBe(0)
          expect(logs).toContainPartial('npm install hmrc-frontend@0.6.x')
          done()
        })
      })

      it('should offer information on installing a compaitble version as well as instructions on manual steps required', (done) => {
        createMockPackage({
          name: 'express-prototype',
          version: '7.1.0'
        })

        const child = exec(`node ${scriptPath}`, { env: { ...mockEnv.env, atPrompt: 'y' } })
        child.stdout.on('data', (data) => logs.push(data))
        child.stderr.on('data', (error) => errors.push(error))
        child.on('error', (error) => errors.push(error))

        child.on('exit', (code) => {
          expect(code).toBe(1)
          expect(errors.length).toBe(0)
          expect(logs).toContainPartial('https://design.tax.service.gov.uk/hmrc-design-patterns/install-hmrc-frontend-in-your-prototype/install-hrmc-frontend-in-an-old-version-of-the-govuk-prototype-kit/')
          done()
        })
      })
    })

    describe('Installing a non-compatible version, and a compatible version does not exist', () => {
      beforeEach(() => {
        createMockPackage({
          name: 'express-prototype',
          version: '6.0.0'
        })
      })

      it('should offer information on upgrading the prototype kit', (done) => {
        const child = exec(`node ${scriptPath}`, { env: { ...mockEnv.env, atPrompt: 'y' } })
        child.stdout.on('data', (data) => logs.push(data))
        child.stderr.on('data', (error) => errors.push(error))
        child.on('error', (error) => errors.push(error))

        child.on('exit', () => {
          expect(errors.length).toBe(0)
          expect(logs).toContainPartial('Your prototype is not compatible with HMRC Frontend')
          expect(logs).toContainPartial('https://govuk-prototype-kit.herokuapp.com/docs/updating-the-kit')
          done()
        })
      })

      it('should exit the process with code 0 when user chooses to continue', (done) => {
        const child = exec(`node ${scriptPath}`, { env: { ...mockEnv.env, atPrompt: 'y' } })
        child.stdout.on('data', (data) => logs.push(data))
        child.stderr.on('data', (error) => errors.push(error))
        child.on('error', (error) => errors.push(error))

        child.on('exit', (code) => {
          expect(code).toBe(0)
          done()
        })
      })

      it('should exit the process with code 1 when user chooses NOT to continue', (done) => {
        const child = exec(`node ${scriptPath}`, { env: { ...mockEnv.env, atPrompt: 'n' } })
        child.stdout.on('data', (data) => logs.push(data))
        child.stderr.on('data', (error) => errors.push(error))
        child.on('error', (error) => errors.push(error))

        child.on('exit', (code) => {
          expect(code).toBe(1)
          done()
        })
      })
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
})
