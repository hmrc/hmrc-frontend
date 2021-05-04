// Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
Number.isNaN = Number.isNaN || function isNaN(input) {
  return typeof input === 'number' && input !== input;
}
