const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });

const configMatchesAllowedSchema = ajv.compile(require('./visual-regression-testing-config-schema.json'));

const validateConfig = (component, { visualRegressionTests: config = {} }) => {
  if (!configMatchesAllowedSchema(config)) {
    throw Error(`Invalid visualRegressionTests config within ${component}.yaml, see JSON schema`);
  }

  return {
    ...config,
    ...(config.alternateStates && { alternateStates: Object.entries(config.alternateStates) }),
  };
};

const backstopScenarioDefaults = {};

const buildScenarioList = (host, port, components) => components.flatMap(({
  componentsPath,
  componentsConfig,
}) => {
  const {
    alternateStates: componentsAlternateStates = [],
    backstopScenarioOptions: componentsBackstopScenarioOptions,
  } = validateConfig(componentsPath, componentsConfig);

  return componentsConfig.examples.flatMap((examplesConfig) => {
    const {
      examplesPath = examplesConfig.name.replace(/ /g, '-'),
      alternateStates: examplesAlternateStates = componentsAlternateStates,
      backstopScenarioOptions: examplesBackstopScenarioOptions,
    } = validateConfig(componentsPath, examplesConfig);

    const scenarioForThisExample = {
      ...backstopScenarioDefaults,
      label: `${componentsPath} (${examplesConfig.name} example)`,
      url: `http://${host}:${port}/components/${componentsPath}/${examplesPath}/preview`,
      ...componentsBackstopScenarioOptions,
      ...examplesBackstopScenarioOptions,
    };

    const scenariosForAlternateStates = examplesAlternateStates.map(
      ([alternateState, alternateStateBackstopScenarioOptions]) => ({
        ...scenarioForThisExample,
        label: `${scenarioForThisExample.label} (${alternateState})`,
        ...alternateStateBackstopScenarioOptions,
      }),
    );

    return [scenarioForThisExample, ...scenariosForAlternateStates];
  });
});

module.exports = ({ host, port, components }) => ({
  id: 'backstop_default',
  viewports: [
    {
      label: 'phone',
      width: 320,
      height: 480,
    },
    {
      label: 'tablet',
      width: 1024,
      height: 768,
    },
  ],
  onBeforeScript: 'puppet/onBefore.js',
  onReadyScript: 'puppet/onReady.js',
  scenarios: buildScenarioList(host, port, components).flatMap((scenario) => [
    // this means we have twice as many VRT which might increase test time a lot...
    scenario, { ...scenario, label: `${scenario.label} (using rebrand)`, url: `${scenario.url}?rebrand=true` },
  ]),
  paths: {
    bitmaps_reference: 'backstop_data/bitmaps_reference',
    bitmaps_test: 'backstop_data/bitmaps_test',
    engine_scripts: 'backstop_data/engine_scripts',
    html_report: 'backstop_data/html_report',
    ci_report: 'backstop_data/ci_report',
  },
  report: ['browser'],
  engine: 'playwright',
  engineOptions: {
    args: ['--no-sandbox'],
  },
  // if running locally, and either stage hangs, try reducing these limits
  asyncCaptureLimit: 3,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
  misMatchThreshold: 0,
  dockerCommandTemplate: 'docker run --rm -it --network host --mount type=bind,source="{cwd}",target=/src backstopjs/backstopjs:{version} {backstopCommand} {args}',
  resembleOutputOptions: {
    ignoreAntialiasing: true,
    usePreciseMatching: true,
  },
});
