const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const del = require('del');
const AdmZip = require('adm-zip');
const rename = require('gulp-rename');

const configPaths = require('../../config/paths.json');
const getFiles = require('./get-files');

const cwd = process.cwd();
const mavenPath = `${configPaths.webjar}META-INF/resources/maven/uk.gov.hmrc.webjars/hmrc-frontend`;
const pomPath = `${mavenPath}/pom.xml`;

const getPackageJson = () => JSON.parse(fs.readFileSync(`${configPaths.package}package.json`, 'utf8'));

gulp.task('clean-webjar', () => del([
  'webjar',
  'webjar-dist',
]));

gulp.task('copy-webjar-package-files', () => gulp
  .src(`${configPaths.package}/**`)
  .pipe(gulp.dest(`${configPaths.webjar}META-INF/resources/webjars/hmrc-frontend/1.35.2/`)));

gulp.task('create-pom-directory', (cb) => {
  if (!fs.existsSync(mavenPath)) {
    fs.mkdirSync(mavenPath, { recursive: true });
  }
  cb();
});

gulp.task('create-jar', async () => {
  const { version } = getPackageJson();

  const zip = new AdmZip();

  const paths = (await getFiles(configPaths.webjar)).map((thisPath) => thisPath.replace(`${cwd}/webjar/`, ''));

  paths.forEach((localPath) => {
    // addLocalFile is expecting localPath to not include the filename
    zip.addLocalFile(`webjar/${localPath}`, path.dirname(localPath));
  });
  zip.writeZip(`./webjar-dist/hmrc-frontend-${version}.jar`);
});

gulp.task('copy-pom', () => {
  const { version } = getPackageJson();

  return gulp.src(pomPath)
    .pipe(rename(`hmrc-frontend-${version}.pom`))
    .pipe(gulp.dest('webjar-dist/'));
});

gulp.task('create-pom', (cb) => {
  const { version, dependencies: { 'govuk-frontend': govukFrontendVersion } } = getPackageJson();

  const sanitisedGovukFrontendVersion = govukFrontendVersion.replace(/[~^]/, '');
  const artifactId = 'hmrc-frontend';
  const githubUrl = 'https://www.github.com/hmrc/hmrc-frontend';
  const githubConnection = `${githubUrl}.git`;
  const groupId = 'uk.gov.hmrc.webjars';

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

    <licenses>
            <license>
                <name>Apache-2.0</name>
                <distribution>repo</distribution>
            </license>
    </licenses>

    <dependencies>
        <dependency>
            <groupId>${groupId}</groupId>
            <artifactId>govuk-frontend</artifactId>
            <version>${sanitisedGovukFrontendVersion}</version>
        </dependency>
    </dependencies>
</project>`;

  fs.writeFileSync(pomPath, pom);
  cb();
});
