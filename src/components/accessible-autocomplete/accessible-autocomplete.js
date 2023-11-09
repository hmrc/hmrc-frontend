function AccessibleAutoComplete($module, window, document) {
  this.$module = $module;
  this.window = window;
  this.document = document;
}

AccessibleAutoComplete.prototype.init = function init() {
  if (this.$module) {
    const showAllValues = (this.$module.getAttribute('data-show-all-values') === 'true');
    const autoselect = (this.$module.getAttribute('data-auto-select') === 'true');
    const defaultValue = this.$module.getAttribute('data-default-value');
    const minLength = this.$module.getAttribute('data-min-length');

    const configurationOptions = {
      selectElement: this.$module,
      showAllValues,
      autoselect,
      defaultValue,
      minLength,
    };

    const language = this.$module.getAttribute('data-language') || 'en';

    if (language === 'cy') {
      configurationOptions.tAssistiveHint = () => 'Pan fydd canlyniadau awtogwblhau ar gael, defnyddiwch y saethau i fyny ac i lawr i’w hadolygu a phwyswch y fysell ’enter’ i’w dewis.'
        + ' Gall defnyddwyr dyfeisiau cyffwrdd, archwilio drwy gyffwrdd â’r sgrin neu drwy sweipio.';
      configurationOptions.tStatusQueryTooShort = (minQueryLength) => `Ysgrifennwch ${minQueryLength} neu fwy o gymeriadau am ganlyniadau`;
      configurationOptions.tNoResults = () => 'Dim canlyniadau wedi’u darganfod';
      configurationOptions.tStatusNoResults = () => 'Dim canlyniadau chwilio';
      configurationOptions.tStatusSelectedOption = (selectedOption, length, index) => `Mae ${selectedOption} ${index + 1} o ${length} wedi’i amlygu`;
      configurationOptions.tStatusResults = (length, contentSelectedOption) => {
        const resultOrResults = (length === 1) ? 'canlyniad' : 'o ganlyniad';
        return `${length} ${resultOrResults} ar gael. ${contentSelectedOption}`;
      };
    }

    window.HMRCAccessibleAutocomplete.enhanceSelectElement(configurationOptions);
  }
};

export default AccessibleAutoComplete;
