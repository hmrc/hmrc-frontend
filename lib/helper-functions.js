// Convert component name to macro name
//
// This helper function takes a component name and returns the corresponding
// macro name.
//
// Component names are lowercase, dash-separated strings (button, date-input),
// whilst macro names have a `govuk` prefix and are camel cased (govukButton,
// govukDateInput).
const GOVUK_COMPONENTS_PATH = '/components/';

const componentNameToMacroName = (componentPath) => {
  const [componentName, library = 'hmrc'] = componentPath
    .split(GOVUK_COMPONENTS_PATH)
    .reverse();

  const macroName = componentName
    .toLowerCase()
    .split('-')
    // capitalize each 'word'
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  return `${library}${macroName}`;
};

exports.componentNameToMacroName = componentNameToMacroName;

exports.componentNameToComponentDirectory = (componentName) => [componentName].join('-'
  + '');
