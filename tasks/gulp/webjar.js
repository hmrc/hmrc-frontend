const { series } = require('gulp');
const fs = require('fs');

const artifactId = 'hmrc-frontend';
const groupId = 'uk.gov.hmrc.webjars';

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
    webjarPath: 'webjar',
    webjarDistPath: 'webjar-dist',
    packagePath: 'package',
  },
);

const createPom = (cb) => {
  const { version, dependencies: { 'govuk-frontend': govukFrontendVersion } } = getPackageJson();
  const githubUrl = 'https://www.github.com/hmrc/hmrc-frontend';
  const githubConnection = `${githubUrl}.git`;
  const govukFrontendArtifactId = 'govuk-frontend';

  const sanitisedGovukFrontendVersion = govukFrontendVersion.replace(/[~^]/, '');

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
        <dependency>
            <groupId>${groupId}</groupId>
            <artifactId>${govukFrontendArtifactId}</artifactId>
            <version>${sanitisedGovukFrontendVersion}</version>
        </dependency>
    </dependencies>
</project>`;

  fs.writeFileSync(`${pomPath}`, pom);
  cb();
};

const buildWebjar = series(
  clean, copyWebjarPackageFiles, createPomDirectory, createPom, createJar, copyPom,
);

module.exports = { buildWebjar, publishLocalWebjar };
