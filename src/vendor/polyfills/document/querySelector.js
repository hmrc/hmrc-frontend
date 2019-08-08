import 'govuk-frontend/govuk/vendor/polyfills/Document'
import 'govuk-frontend/govuk/vendor/polyfills/Element'

(function(undefined) {

  // Detection from https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/document/querySelector/detect.js
  var detect = (
    'document' in this && 'querySelector' in this.document
  )

  if (detect) return

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Event&flags=always
  (function () {
    var
    head = document.getElementsByTagName('head')[0];

    function getElementsByQuery(node, selector, one) {
      var
      generator = document.createElement('div'),
      id = 'qsa' + String(Math.random()).slice(3),
      style, elements;

      generator.innerHTML = 'x<style>' + selector + '{qsa:' + id + ';}';

      style = head.appendChild(generator.lastChild);

      elements = getElements(node, selector, one, id);

      head.removeChild(style);

      return one ? elements[0] : elements;
    }

    function getElements(node, selector, one, id) {
      var
      validNode = /1|9/.test(node.nodeType),
      childNodes = node.childNodes,
      elements = [],
      index = -1,
      childNode;

      if (validNode && node.currentStyle && node.currentStyle.qsa === id) {
        if (elements.push(node) && one) {
          return elements;
        }
      }

      while (childNode = childNodes[++index]) {
        elements = elements.concat(getElements(childNode, selector, one, id));

        if (one && elements.length) {
          return elements;
        }
      }

      return elements;
    }

    Document.prototype.querySelector = Element.prototype.querySelector = function querySelectorAll(selector) {
      return getElementsByQuery(this, selector, true);
    };

    Document.prototype.querySelectorAll = Element.prototype.querySelectorAll = function querySelectorAll(selector) {
      return getElementsByQuery(this, selector, false);
    };
  }());
}).call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
