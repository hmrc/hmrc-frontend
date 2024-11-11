const { src, series, dest } = require('gulp');
const {
  existsSync, copyFileSync, readFileSync, writeFileSync, mkdirSync,
} = require('fs');
const del = require('del');
const { exec } = require('child_process');
const crypto = require('crypto');

const groupId = 'uk.gov.hmrc.webjars';

const webjarsToPackage = ['govuk-frontend'];

const webJarHelpers = ({
  artifactId, webjarPath, webjarDistPath, packagePath, githubUrl,
}) => {
  const mavenPath = `${webjarPath}/META-INF/maven/${groupId}/${artifactId}`;
  const pomPath = `${mavenPath}/pom.xml`;

  const getPackageJson = () => JSON.parse(readFileSync(`${packagePath}/package.json`, 'utf8'));

  const getArtifactDirectory = () => {
    const { version } = getPackageJson();

    return `${webjarDistPath}/${groupId.replace(/\./g, '/')}/${artifactId}/${version}`;
  };

  const clean = () => del([
    webjarPath,
    webjarDistPath,
  ]);

  /*
   For now, copy files from package directory rather than fetching from NPM

   If fetching from NPM after publishing, we need to consider
     * the possibility of npm publish being eventually consistent (not synchronous)
     * the possibility of timeouts and the retry mechanism
     * how we allow the possibility for testing the webjar locally without needing to publish to NPM
   */
  const copyWebjarPackageFiles = () => {
    const { version } = getPackageJson();

    return src(`${packagePath}/**`, { encoding: false })
      .pipe(dest(`${webjarPath}/META-INF/resources/webjars/${artifactId}/${version}/`));
  };

  const createArtifactDirectory = async () => {
    const artifactPath = getArtifactDirectory();

    if (!existsSync(artifactPath)) {
      mkdirSync(artifactPath, { recursive: true });
    }
  };

  const getArtifactPathPrefix = () => {
    const { version } = getPackageJson();

    return `${getArtifactDirectory()}/${artifactId}-${version}`;
  };

  const getJarArtifactPath = () => `${getArtifactPathPrefix()}.jar`;

  const createJar = () => exec(`jar cMf ${getJarArtifactPath()} -C ${webjarPath} .`);

  const createChecksumFile = (path, algorithm) => {
    const fileBuffer = readFileSync(path);
    const hashSum = crypto.createHash(algorithm);
    hashSum.update(fileBuffer);

    writeFileSync(`${path}.${algorithm}`, hashSum.digest('hex'));
  };

  const createJarSha = async () => {
    createChecksumFile(getJarArtifactPath(), 'sha1');
  };

  const createJarMd5 = async () => {
    createChecksumFile(getJarArtifactPath(), 'md5');
  };

  const createPomDirectory = async () => {
    if (!existsSync(mavenPath)) {
      mkdirSync(mavenPath, { recursive: true });
    }
  };

  const createPom = async () => {
    const { version, dependencies = {} } = getPackageJson();

    const githubConnection = `${githubUrl}.git`;

    const entriesToDependencies = () => {
      const entryToDependency = ([name, dependencyVersion]) => {
        const sanitisedDependencyVersion = dependencyVersion.replace(/[~^]/, '');
        return `<dependency>
            <groupId>org.webjars.npm</groupId>
            <artifactId>${name}</artifactId>
            <version>${sanitisedDependencyVersion}</version>
        </dependency>`;
      };

      const entriesToIncludeInWebjar = Object.entries(dependencies).filter(
        ([entryName]) => webjarsToPackage.includes(entryName),
      );
      const entriesAsDependencies = entriesToIncludeInWebjar.map(entryToDependency);
      return entriesAsDependencies.toString().split(',').join('\n\t');
    };

    const pom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <packaging>jar</packaging>
    <groupId>${groupId}</groupId>
    <artifactId>${artifactId}</artifactId>
    <version>${version}</version>
    <name>${artifactId}</name>
    <description>WebJar for ${artifactId}</description>
    <url>${githubUrl}</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <scm>
        <url>${githubUrl}</url>
        <connection>${githubConnection}</connection>
        <developerConnection>${githubConnection}</developerConnection>
        <tag>v${version}</tag>
    </scm>

    <dependencies>
        ${entriesToDependencies()}
    </dependencies>
</project>`;

    writeFileSync(pomPath, pom);
  };

  const getPomArtifactPath = () => `${getArtifactPathPrefix()}.pom`;

  const copyPom = async () => {
    copyFileSync(pomPath, getPomArtifactPath());
  };

  const createPomSha = async () => {
    createChecksumFile(getPomArtifactPath(), 'sha1');
  };

  const createPomMd5 = async () => {
    createChecksumFile(getPomArtifactPath(), 'md5');
  };

  const buildWebjar = series(
    clean,
    copyWebjarPackageFiles,
    createPomDirectory,
    createPom,
    createArtifactDirectory,
    createJar,
    createJarSha,
    createJarMd5,
    copyPom,
    createPomSha,
    createPomMd5,
  );

  const publishLocalWebjar = () => exec(`mvn install:install-file -Dfile=${getJarArtifactPath()} -DpomFile=${getPomArtifactPath()}`);

  return {
    buildWebjar,
    publishLocalWebjar,
  };
};

module.exports = webJarHelpers;
