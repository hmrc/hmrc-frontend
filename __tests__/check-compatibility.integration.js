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
