/* global XMLHttpRequest, ActiveXObject */

import { nodeListForEach } from '../../common'

var utils = {
  generateDomElementFromString: function (str) {
    var abc = document.createElement('div')
    abc.innerHTML = str
    return abc.firstChild
  },

  generateDomElementFromStringAndAppendText: function (str, text) {
    var $tmp = utils.generateDomElementFromString(str)
    $tmp.innerText = text
    return $tmp
  },

  hasClass: function (selector, className) {
    return document.querySelector(selector).classList.contains(className)
  },

  addClass: function (selector, className) {
    var elements = document.querySelectorAll(selector)
    nodeListForEach(elements, function (i) { i.classList.add(className) })
  },

  removeClass: function (selector, className) {
    var elements = document.querySelectorAll(selector)
    nodeListForEach(elements, function (i) { i.classList.remove(className) })
  },

  removeElement: function ($elem) {
    var parent = $elem.parentNode
    if (parent) {
      parent.removeChild($elem)
    } else {
      console.warn("couldn't find parent for elem", $elem)
    }
  },

  ajaxGet: function (url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
    xhr.open('GET', url)
    xhr.onreadystatechange = function () {
      if (xhr.readyState > 3 && xhr.status === 200) success(xhr.responseText)
    }
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.send()
    return xhr
  }
}

export default utils
