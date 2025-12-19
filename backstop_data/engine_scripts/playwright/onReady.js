module.exports = async (page, scenario, viewport, isReference, browserContext) => {
  console.log('SCENARIO > ' + scenario.label);
  await require('./beforeTakingScreenshotHelper')(page, scenario);

  // add more ready handlers here...
};
