(function(undefined) {

  // Detection from https://github.com/Financial-Times/polyfill-library/blob/987630a085e29226da16b5dc542042c687560191/polyfills/Date/now/detect.js
  var detect = (
    'Date' in this && 'now' in this.Date && 'getTime' in this.Date.prototype
  )

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Array.prototype.forEach&flags=always
  Date.now = function now() {
    return new Date().getTime();
  };
}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
