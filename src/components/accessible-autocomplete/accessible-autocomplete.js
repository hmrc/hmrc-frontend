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

    const configurationOptions = {
      selectElement: this.$module,
      showAllValues,
      autoselect,
      defaultValue,
    };

    const language = this.$module.getAttribute('data-language') || 'en';

    if (language === 'cy') {
      configurationOptions.tAssistiveHint = () => 'Pan fydd canlyniadau awtolenwi ar gael defnyddiwch saethau i fyny ac i lawr i adolygu a mynd i mewn i ddewis.'
        + ' Defnyddwyr dyfeisiau cyffwrdd, archwilio trwy gyffwrdd neu gydag ystumiau swipe.';
      configurationOptions.tStatusQueryTooShort = (minQueryLength) => `Teipiwch ${minQueryLength} neu fwy o nodau ar gyfer canlyniadau`;
      configurationOptions.tStatusNoResults = () => 'Heb ganfod canlyniadau';
      configurationOptions.tStatusSelectedOption = (selectedOption, length, index) => `Mae ${selectedOption} ${index + 1} o ${length} wedi'i amlygu`;
      configurationOptions.tStatusResults = (length, contentSelectedOption) => {
        const words = {
          result: (length === 1) ? 'canlyniad' : 'ganlyniad',
          is: (length === 1) ? 'ar' : 'ar',
        };
        return `<span>Mae ${length} ${words.result} ${words.is} gael. ${contentSelectedOption}</span>`;
      };
    }

    window.HMRCAccessibleAutocomplete.enhanceSelectElement(configurationOptions);
  }
};

export default AccessibleAutoComplete;
