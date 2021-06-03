const {
  buildWebjar,
  publishLocalWebjar,
} = require('./webjar-helpers')(
  {
    artifactId: 'hmrc-frontend',
    webjarPath: 'webjar',
    webjarDistPath: 'webjar-dist',
    packagePath: 'package',
    githubUrl: 'https://www.github.com/hmrc/hmrc-frontend',
  },
);

module.exports = { buildWebjar, publishLocalWebjar };
