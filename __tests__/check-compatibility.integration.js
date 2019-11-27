/* eslint-env jest */
import path from 'path'
import { exec } from 'child_process'

describe('Version compatibility check', () => {
  const scriptPath = path.resolve(__dirname, '../check-compatibility.js')
  let logs
  let errors
  let child = exec(`node ${scriptPath}`)
  child.stdout.on('data', (data) => {
    console.log('message: ', data)
    logs.push(data)
  })
  child.stderr.on('data', (error) => errors.push(error))

  beforeEach(() => {
    process.env = { ...process.env, INIT_CWD: './'}
    logs = []
    errors = []
  })

  describe('Installing outside of Prototype kit', () => {
    it('should exit the process with code 0', (done) => {
      jest.mock('__tests__/package.json', () => ({
        name: 'foo'
      }))

      child = exec(`node ${scriptPath}`)

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
        jest.mock('__tests__/package.json', () => ({
          name: 'foo'
        }))

        child = exec(`node ${scriptPath}`)

        child.stdout.on('data', (data) => logs.push(data))
        child.stderr.on('data', (error) => errors.push(error))

        child.on('exit', (code) => {
          expect(code).toBe(0)
          expect(errors.length).toBe(0)
          expect(logs.length).toBe(0)
          done()
        })
      })
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
})


/*
describe('Version compatibility check', () => {
  const consoleSpy = jest.spyOn(console, 'log');

  describe('Installing outside of Prototype kit', () => {
    it('should exit the process with code 0', () => {
      jest.mock('../package.json', () => ({
        name: 'foo'
      }))

      jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit() was called.')
      });

      expect(() => {
        require('../check-compatibility.js');
      }).toThrow('process.exit() was called.');

      expect(process.exit).toHaveBeenCalledWith(0);
      expect(consoleSpy.mock.calls.length).toBe(0);
    })
  })

  describe('Installing inside of Prototype kit', () => {
    describe('Installing a compatible version', () => {
      it('should exit the process with code 0', () => {
        jest.mock('../package.json', () => ({
          name: 'govuk-prototype-kit'
        }))

        jest.spyOn(process, 'exit').mockImplementation(() => {
          throw new Error('process.exit() was called.')
        });

        expect(() => {
          require('../check-compatibility.js');
        }).toThrow('process.exit() was called.');

        expect(process.exit).toHaveBeenCalledWith(0);
        expect(consoleSpy.mock.calls.length).toBe(0);
      })
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
})
*/
