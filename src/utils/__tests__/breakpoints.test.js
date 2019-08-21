/* eslint-env jest */
const { getCurrentBreakpoint } = require('../breakpoints')

describe('getCurrentBreakpoint', () => {
  it('returns the descriptor of the current breakpoint based on window.innerWidth', () => {
    global.innerWidth = 319
    expect(getCurrentBreakpoint()).toBe('xs')
    global.innerWidth = 321
    expect(getCurrentBreakpoint()).toBe('mobile')
    global.innerWidth = 642
    expect(getCurrentBreakpoint()).toBe('tablet')
    global.innerWidth = 770
    expect(getCurrentBreakpoint()).toBe('desktop')
  })

  it('returns the descriptor of the current breakpoint based on passed argument', () => {
    expect(getCurrentBreakpoint(642)).toBe('tablet')
  })
})
