/* eslint-env jest */
const { readFile } = require('fs').promises;
const { existsSync } = require('fs');
const AdmZip = require('adm-zip');
const packagePackageJson = require('../../../node_modules/govuk-frontend/package.json');
const getFiles = require('./get-files');

const parser = new DOMParser();

const getPomField = async (xpath) => {
  const pom = await readFile('govuk-webjar/META-INF/maven/uk.gov.hmrc.webjars/govuk-frontend/pom.xml', 'utf8');

  const dom = parser.parseFromString(pom, 'application/xml');

  return dom.evaluate(xpath, dom, null, XPathResult.ANY_TYPE).iterateNext().textContent;
};

describe('govuk-webjar/', () => {
  const cwd = process.cwd();

  it('should copy the contents of the govuk-frontend package directory into webjar/META-INF/resources/webjars/govuk-frontend/X.Y.Z', async () => {
    const { version } = packagePackageJson;

    const webjarFiles = await getFiles(`govuk-webjar/META-INF/resources/webjars/govuk-frontend/${version}`);
    const packageFiles = await getFiles('node_modules/govuk-frontend');

    const relativeWebjarFiles = webjarFiles.map((file) => file.replace(`${cwd}/govuk-webjar/META-INF/resources/webjars/govuk-frontend/${version}`, ''));
    const relativePackageFiles = packageFiles.map((file) => file.replace(`${cwd}/node_modules/govuk-frontend`, ''));

    expect(relativeWebjarFiles).toEqual(relativePackageFiles);
  });

  it('should generate a jar file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`./govuk-webjar-dist/govuk-frontend-${version}.jar`)).toEqual(true);
  });

  it('should generate a pom file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`./govuk-webjar-dist/govuk-frontend-${version}.pom`)).toEqual(true);
  });

  it('should generate a jar file containing the correct files', async () => {
    const { version } = packagePackageJson;

    const zip = new AdmZip(`./govuk-webjar-dist/govuk-frontend-${version}.jar`);
    const zipEntries = zip.getEntries().map((entry) => entry.entryName).filter((path) => !path.endsWith('/')).sort();
    const webjarFiles = await getFiles('govuk-webjar');

    const relativeWebjarFiles = webjarFiles.map((file) => file.replace(`${cwd}/govuk-webjar/`, '')).sort();

    expect(zipEntries).toEqual(relativeWebjarFiles);
  });

  it('should generate a POM file', async () => {
    const groupId = await getPomField('/project/groupId');

    expect(groupId).toEqual('uk.gov.hmrc.webjars');
  });

  it('should have the correct version', async () => {
    const version = await getPomField('/project/version');

    expect(version).toEqual(packagePackageJson.version);
  });

  it('should have the correct tag', async () => {
    const tag = await getPomField('/project/scm/tag');

    expect(tag).toEqual(`v${packagePackageJson.version}`);
  });

  it('should have the correct name', async () => {
    const name = await getPomField('/project/name');
    const artifactId = await getPomField('/project/artifactId');

    expect(name).toEqual('govuk-frontend');
    expect(artifactId).toEqual('govuk-frontend');
  });

  it('should have the correct url', async () => {
    const url = await getPomField('/project/url');
    const githubUrl = await getPomField('/project/scm/url');

    expect(url).toEqual('https://www.github.com/alphagov/govuk-frontend');
    expect(githubUrl).toEqual('https://www.github.com/alphagov/govuk-frontend');
  });
});
