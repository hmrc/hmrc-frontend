const { warn } = console;

const utils = {
  generateDomElementFromString(str) {
    const abc = document.createElement('div');
    abc.innerHTML = str;
    return abc.firstChild;
  },

  generateDomElementFromStringAndAppendText(str, text) {
    const $tmp = utils.generateDomElementFromString(str);
    $tmp.innerText = text;
    return $tmp;
  },

  hasClass(selector, className) {
    return document.querySelector(selector).classList.contains(className);
  },

  addClass(selector, className) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((i) => { i.classList.add(className); });
  },

  removeClass(selector, className) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((i) => { i.classList.remove(className); });
  },

  removeElement($elem) {
    const parent = $elem.parentNode;
    if (parent) {
      parent.removeChild($elem);
    } else {
      warn("couldn't find parent for elem", $elem);
    }
  },

  ajaxGet(url, success) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState > 3 && xhr.status === 200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    return xhr;
  },
};

export default utils;
