const { src, dest } = require('gulp');
const fs = require('fs');
const del = require('del');
const rename = require('gulp-rename');
const { exec } = require('child_process');

const webJarHelpers = ({
  groupId, artifactId, webjarPath, webjarDistPath, packagePath,
}) => {
  const mavenPath = `${webjarPath}/META-INF/maven/${groupId}/${artifactId}`;
  const pomPath = `${mavenPath}/pom.xml`;

  const getPackageJson = () => JSON.parse(fs.readFileSync(`${packagePath}/package.json`, 'utf8'));

  const clean = () => del([
    webjarPath,
    webjarDistPath,
  ]);

  const copyWebjarPackageFiles = () => {
    const { version } = getPackageJson();

    return src(`${packagePath}/**`)
      .pipe(dest(`${webjarPath}/META-INF/resources/webjars/${artifactId}/${version}/`));
  };

  const createPomDirectory = (cb) => {
    if (!fs.existsSync(mavenPath)) {
      fs.mkdirSync(mavenPath, { recursive: true });
    }
    cb();
  };

  const createJar = (cb) => {
    const { version } = getPackageJson();

    if (!fs.existsSync(webjarDistPath)) {
      fs.mkdirSync(webjarDistPath);
    }

    exec(`jar cMf ${webjarDistPath}/${artifactId}-${version}.jar -C ${webjarPath} .`, (err) => {
      cb(err);
    });
  };

  const copyPom = () => {
    const { version } = getPackageJson();

    return src(pomPath)
      .pipe(rename(`${artifactId}-${version}.pom`))
      .pipe(dest(`${webjarDistPath}/`));
  };

  const publishLocalWebjar = (cb) => {
    const { version } = getPackageJson();

    exec(`mvn install:install-file -Dfile=${webjarDistPath}/${artifactId}-${version}.jar -DpomFile=${webjarDistPath}/${artifactId}-${version}.pom`, (err) => {
      cb(err);
    });
  };

  return {
    clean,
    getPackageJson,
    copyWebjarPackageFiles,
    createPomDirectory,
    createJar,
    copyPom,
    publishLocalWebjar,
    pomPath,
  };
};

module.exports = webJarHelpers;
