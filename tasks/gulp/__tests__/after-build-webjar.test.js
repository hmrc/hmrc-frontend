/* eslint-env jest */
const fs = require('fs');
const AdmZip = require('adm-zip');
const getFiles = require('./get-files');
const getPomField = require('./get-pom-field');

const { readFileSync, existsSync } = fs;
const getHmrcPomField = async (xpath) => getPomField('webjar/META-INF/maven/uk.gov.hmrc.webjars/hmrc-frontend/pom.xml', xpath);

describe('webjar/', () => {
  let packagePackageJson;

  const cwd = process.cwd();
  const jarPath = './webjar-dist/uk/gov/hmrc/webjars/hmrc-frontend/';

  beforeAll(() => {
    packagePackageJson = JSON.parse(readFileSync('package/package.json', 'utf8'));
  });

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

    expect(existsSync(`${jarPath}/${version}/hmrc-frontend-${version}.jar`)).toEqual(true);
  });

  it('should generate a pom file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`${jarPath}/${version}/hmrc-frontend-${version}.pom`)).toEqual(true);
  });

  it('should generate a pom hash file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`${jarPath}/${version}/hmrc-frontend-${version}.pom.sha1`)).toEqual(true);
  });

  it('should generate a pom md5 file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`${jarPath}/${version}/hmrc-frontend-${version}.pom.md5`)).toEqual(true);
  });

  it('should generate a jar hash file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`${jarPath}/${version}/hmrc-frontend-${version}.jar.sha1`)).toEqual(true);
  });

  it('should generate a jar md5 file with the correct name', () => {
    const { version } = packagePackageJson;

    expect(existsSync(`${jarPath}/${version}/hmrc-frontend-${version}.jar.md5`)).toEqual(true);
  });

  it('should generate a jar file containing the correct files', async () => {
    const { version } = packagePackageJson;

    const zip = new AdmZip(`${jarPath}/${version}/hmrc-frontend-${version}.jar`);
    const zipEntries = zip.getEntries().map((entry) => entry.entryName).filter((path) => !path.endsWith('/')).sort();
    const webjarFiles = await getFiles('webjar');

    const relativeWebjarFiles = webjarFiles.map((file) => file.replace(`${cwd}/webjar/`, '')).sort();

    expect(zipEntries).toEqual(relativeWebjarFiles);
  });

  it('should generate a POM file', async () => {
    const groupId = await getHmrcPomField('/project/groupId');

    expect(groupId).toEqual('uk.gov.hmrc.webjars');
  });

  it('should generate a POM hash file', async () => {
    const groupId = await getHmrcPomField('/project/groupId');

    expect(groupId).toEqual('uk.gov.hmrc.webjars');
  });

  it('should have the correct version', async () => {
    const version = await getHmrcPomField('/project/version');

    expect(version).toEqual(packagePackageJson.version);
  });

  it('should have the correct tag', async () => {
    const tag = await getHmrcPomField('/project/scm/tag');

    expect(tag).toEqual(`v${packagePackageJson.version}`);
  });

  it('should have the correct name', async () => {
    const name = await getHmrcPomField('/project/name');
    const artifactId = await getHmrcPomField('/project/artifactId');

    expect(name).toEqual('hmrc-frontend');
    expect(artifactId).toEqual('hmrc-frontend');
  });

  it('should have the correct url', async () => {
    const url = await getHmrcPomField('/project/url');
    const githubUrl = await getHmrcPomField('/project/scm/url');

    expect(url).toEqual('https://www.github.com/hmrc/hmrc-frontend');
    expect(githubUrl).toEqual('https://www.github.com/hmrc/hmrc-frontend');
  });

  it('should have the correct govuk-frontend groupId', async () => {
    const govukFrontendGroupId = await getHmrcPomField('/project/dependencies/dependency[1]/groupId');

    expect(govukFrontendGroupId).toEqual('org.webjars.npm');
  });

  it('should have the correct govuk-frontend artifactId', async () => {
    const govukFrontendArtifactId = await getHmrcPomField('/project/dependencies/dependency[1]/artifactId');

    expect(govukFrontendArtifactId).toEqual('govuk-frontend');
  });

  it('should have the correct govuk-frontend version, ignoring any ~ or ^ qualifiers', async () => {
    const expectedGovUkVersion = packagePackageJson.dependencies['govuk-frontend']
      .replace(/[^~]/, '');

    const govukFrontendVersion = await getHmrcPomField('/project/dependencies/dependency[1]/version');

    expect(govukFrontendVersion).toEqual(expectedGovUkVersion);
  });

  it('should have the correct accessible-autocompleted groupId', async () => {
    const govukFrontendGroupId = await getHmrcPomField('/project/dependencies/dependency[2]/groupId');

    expect(govukFrontendGroupId).toEqual('org.webjars.npm');
  });

  it('should have the correct accessible-autocomplete artifactId', async () => {
    const accessibleAutocomplete = await getHmrcPomField('/project/dependencies/dependency[2]/artifactId');

    expect(accessibleAutocomplete).toEqual('accessible-autocomplete');
  });

  it('should have the correct accessible-autocomplete version, ignoring any ~ or ^ qualifiers', async () => {
    const expectedAutocompleteVersion = packagePackageJson.dependencies['accessible-autocomplete']
      .replace(/[^~]/, '');

    const autocompleteVersion = await getHmrcPomField('/project/dependencies/dependency[2]/version');

    expect(autocompleteVersion).toEqual(expectedAutocompleteVersion);
  });
});
