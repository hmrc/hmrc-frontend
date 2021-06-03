const { src, series, dest } = require('gulp');
const fs = require('fs');
const del = require('del');
const rename = require('gulp-rename');
const { exec } = require('child_process');

const groupId = 'uk.gov.hmrc.webjars';

const webJarHelpers = ({
  artifactId, webjarPath, webjarDistPath, packagePath, githubUrl,
}) => {
  const mavenPath = `${webjarPath}/META-INF/maven/${groupId}/${artifactId}`;
  const pomPath = `${mavenPath}/pom.xml`;

  const getPackageJson = () => JSON.parse(fs.readFileSync(`${packagePath}/package.json`, 'utf8'));

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

    return src(`${packagePath}/**`)
      .pipe(dest(`${webjarPath}/META-INF/resources/webjars/${artifactId}/${version}/`));
  };

  const createJar = () => {
    const { version } = getPackageJson();

    if (!fs.existsSync(webjarDistPath)) {
      fs.mkdirSync(webjarDistPath);
    }

    return exec(`jar cMf ${webjarDistPath}/${artifactId}-${version}.jar -C ${webjarPath} .`);
  };

  const createPomDirectory = (cb) => {
    if (!fs.existsSync(mavenPath)) {
      fs.mkdirSync(mavenPath, { recursive: true });
    }
    cb();
  };

  const createPom = (cb) => {
    const { version, dependencies = {} } = getPackageJson();

    const githubConnection = `${githubUrl}.git`;

    const entryToDependency = ([name, dependencyVersion]) => {
      const sanitisedDependencyVersion = dependencyVersion.replace(/[~^]/, '');
      return `<dependency>
            <groupId>${groupId}</groupId>
            <artifactId>${name}</artifactId>
            <version>${sanitisedDependencyVersion}</version>
        </dependency>`;
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
        ${Object.entries(dependencies).map(entryToDependency)}
    </dependencies>
</project>`;

    fs.writeFileSync(`${pomPath}`, pom);

    cb();
  };

  const copyPom = () => {
    const { version } = getPackageJson();

    return src(pomPath)
      .pipe(rename(`${artifactId}-${version}.pom`))
      .pipe(dest(`${webjarDistPath}/`));
  };

  const buildWebjar = series(
    clean, copyWebjarPackageFiles, createPomDirectory, createPom, createJar, copyPom,
  );

  const publishLocalWebjar = () => {
    const { version } = getPackageJson();

    return exec(`mvn install:install-file -Dfile=${webjarDistPath}/${artifactId}-${version}.jar -DpomFile=${webjarDistPath}/${artifactId}-${version}.pom`);
  };

  return {
    buildWebjar,
    publishLocalWebjar,
  };
};

module.exports = webJarHelpers;
