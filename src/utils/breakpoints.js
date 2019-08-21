// TODO
// Retrieve breakpoints from Sass vars?
const breakpoints = {
  xs: 0,
  mobile: 320,
  tablet: 641,
  desktop: 769
}

function getCurrentBreakpoint (windowWidth = window.innerWidth) {
  const reducer = function (acc, curr) {
    const windowInsideBreakpoint = windowWidth >= breakpoints[curr]
    return windowInsideBreakpoint ? curr : acc
  }
  return Object.keys(breakpoints).reduce(reducer)
}

module.exports = {
  breakpoints,
  getCurrentBreakpoint
}
