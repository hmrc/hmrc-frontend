// TODO
// Retrieve breakpoints from Sass vars?
export const breakpoints = {
  xs: 0,
  mobile: 320,
  tablet: 641,
  desktop: 769,
};

export function getCurrentBreakpoint(windowWidth) {
  const reducer = (acc, curr) => {
    const windowInsideBreakpoint = (windowWidth || window.innerWidth) >= breakpoints[curr];
    return windowInsideBreakpoint ? curr : acc;
  };
  return Object.keys(breakpoints).reduce(reducer);
}
