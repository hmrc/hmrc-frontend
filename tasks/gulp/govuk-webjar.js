const {
  buildWebjar,
  publishLocalWebjar,
} = require('./webjar-helpers')(
  {
    artifactId: 'govuk-frontend',
    webjarPath: 'govuk-webjar',
    webjarDistPath: 'govuk-webjar-dist',
    packagePath: 'node_modules/govuk-frontend',
    githubUrl: 'https://www.github.com/alphagov/govuk-frontend',
  },
);

module.exports = { buildGovukWebjar: buildWebjar, publishLocalGovukWebjar: publishLocalWebjar };
