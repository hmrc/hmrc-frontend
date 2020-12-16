/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
// eslint-disable-next-line consistent-return
function nodeListForEach(nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback);
  }
  for (let i = 0; i < nodes.length; i += 1) {
    callback.call(window, nodes[i], i, nodes);
  }
}

// eslint-disable-next-line import/prefer-default-export
export { nodeListForEach };
