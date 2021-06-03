/* eslint-env jest */
const { readFile } = require('fs').promises;
const { existsSync } = require('fs');
const AdmZip = require('adm-zip');
const packagePackageJson = require('../../../package/package.json');
const getFiles = require('./get-files');

const parser = new DOMParser();

const getPomField = async (xpath) => {
  const pom = await readFile('webjar/META-INF/maven/uk.gov.hmrc.webjars/hmrc-frontend/pom.xml', 'utf8');

  const dom = parser.parseFromString(pom, 'application/xml');

  return dom.evaluate(xpath, dom, null, XPathResult.ANY_TYPE).iterateNext().textContent;
};

describe('webjar/', () => {
  const cwd = process.cwd();

  it('should copy the contents of the package directory into webjar/META-INF/resources/webjars/hmrc-frontend/X.Y.Z', async () => {
    const { version } = packagePackageJson;

    const webjarFiles = await getFiles(`webjar/META-INF/resources/webjars/hmrc-frontend/${version}`);
    const packageFiles = await getFiles('package');

    const relativeWebjarFiles = webjarFiles.map((file) => file.replace(`${cwd}/webjar/META-INF/resources/webjars/hmrc-frontend/${version}`, ''));
    const relativePackageFiles = packageFiles.map((file) => file.replace(`${cwd}/package`, ''));

    expect(relativeWebjarFiles).toEqual(relativePackageFiles);
  });

  it('should generate a jar file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`./webjar-dist/hmrc-frontend-${version}.jar`)).toEqual(true);
  });

  it('should generate a pom file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`./webjar-dist/hmrc-frontend-${version}.pom`)).toEqual(true);
  });

  it('should generate a jar file containing the correct files', async () => {
    const { version } = packagePackageJson;

    const zip = new AdmZip(`./webjar-dist/hmrc-frontend-${version}.jar`);
    const zipEntries = zip.getEntries().map((entry) => entry.entryName).filter((path) => !path.endsWith('/')).sort();
    const webjarFiles = await getFiles('webjar');

    const relativeWebjarFiles = webjarFiles.map((file) => file.replace(`${cwd}/webjar/`, '')).sort();

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

    expect(name).toEqual('hmrc-frontend');
    expect(artifactId).toEqual('hmrc-frontend');
  });

  it('should have the correct url', async () => {
    const url = await getPomField('/project/url');
    const githubUrl = await getPomField('/project/scm/url');

    expect(url).toEqual('https://www.github.com/hmrc/hmrc-frontend');
    expect(githubUrl).toEqual('https://www.github.com/hmrc/hmrc-frontend');
  });

  it('should have the correct govuk-frontend groupId', async () => {
    const govukFrontendGroupId = await getPomField('/project/dependencies/dependency/groupId');

    expect(govukFrontendGroupId).toEqual('uk.gov.hmrc.webjars');
  });

  it('should have the correct govuk-frontend artifactId', async () => {
    const govukFrontendArtifactId = await getPomField('/project/dependencies/dependency/artifactId');

    expect(govukFrontendArtifactId).toEqual('govuk-frontend');
  });

  it('should have the correct govuk-frontend version, ignoring any ~ or ^ qualifiers', async () => {
    const expectedGovUkVersion = packagePackageJson.dependencies['govuk-frontend']
      .replace(/[^~]/, '');

    const govukFrontendVersion = await getPomField('/project/dependencies/dependency/version');

    expect(govukFrontendVersion).toEqual(expectedGovUkVersion);
  });
});
