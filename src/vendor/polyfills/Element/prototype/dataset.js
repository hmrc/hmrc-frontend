import 'govuk-frontend/govuk/vendor/polyfills/Object/defineProperty'
import 'govuk-frontend/govuk/vendor/polyfills/Function/prototype/bind'
import '../../Object/getOwnPropertyDescriptor'
import 'govuk-frontend/govuk/vendor/polyfills/Document'
import 'govuk-frontend/govuk/vendor/polyfills/Element'
import '../../document/querySelector'

(function(undefined) {
  // Detection from https://github.com/Financial-Times/polyfill-library/blob/master/polyfills/Element/prototype/dataset/detect.js
  (function(){
    if (!document.documentElement.dataset) {
      return false;
    }
    var el = document.createElement('div');
    el.setAttribute("data-a-b", "c");
    return el.dataset && el.dataset.aB == "c";
  }())

  // Polyfill from https://cdn.polyfill.io/v2/polyfill.js?features=Element.prototype.dataset&flags=always
  Object.defineProperty(Element.prototype, 'dataset', {
    get: function() {
      var element = this;
      var attributes = this.attributes;
      var map = {};

      for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];

        if (attribute && attribute.name && (/^data-\w[\w\-]*$/).test(attribute.name)) {
          var name = attribute.name;
          var value = attribute.value;

          var propName = name.substr(5).replace(/-./g, function (prop) {
            return prop.charAt(1).toUpperCase();
          });

          Object.defineProperty(map, propName, {
            enumerable: this.enumerable,
            get: function() {
              return this.value;
            }.bind({value: value || ''}),
            set: function setter(name, value) {
              if (typeof value !== 'undefined') {
                this.setAttribute(name, value);
              } else {
                this.removeAttribute(name);
              }
            }.bind(element, name)
          });
        }
      }

      return map;
    }
  });
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
