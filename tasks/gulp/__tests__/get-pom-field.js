const fs = require('fs');

const { readFile } = fs.promises;
const parser = new DOMParser();

const getPomField = async (pomFilePath, xpath) => {
  const pom = await readFile(pomFilePath, 'utf8');

  const dom = parser.parseFromString(pom, 'application/xml');

  return dom.evaluate(xpath, dom, null, XPathResult.ANY_TYPE).iterateNext().textContent;
};

module.exports = getPomField;
