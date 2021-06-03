const { series } = require('gulp');
const fs = require('fs');

const groupId = 'uk.gov.hmrc.webjars';
const artifactId = 'govuk-frontend';
const webjarPath = 'govuk-webjar';
const webjarDistPath = 'govuk-webjar-dist';
const packagePath = 'node_modules/govuk-frontend';

const {
  getPackageJson,
  clean,
  copyWebjarPackageFiles,
  createPomDirectory,
  createJar,
  copyPom,
  publishLocalWebjar,
  pomPath,
} = require('./webjar-helpers')(
  {
    groupId,
    artifactId,
    webjarPath,
    webjarDistPath,
    packagePath,
  },
);

const createPom = (cb) => {
  const { version } = getPackageJson();
  const githubUrl = 'https://www.github.com/alphagov/govuk-frontend';
  const githubConnection = `${githubUrl}.git`;

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
</project>`;

  fs.writeFileSync(pomPath, pom);
  cb();
};

const buildWebjar = series(
  clean, copyWebjarPackageFiles, createPomDirectory, createPom, createJar, copyPom,
);

module.exports = { buildGovukWebjar: buildWebjar, publishLocalGovukWebjar: publishLocalWebjar };
