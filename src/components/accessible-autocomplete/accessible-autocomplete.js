function AccessibleAutoComplete($module, window, document) {
  this.$module = $module;
  this.window = window;
  this.document = document;
}

AccessibleAutoComplete.prototype.init = function init() {
  if (this.$module) {
    const selectElement = this.$module;
    const selectOptions = Array.from(selectElement.options);
    const showAllValues = (this.$module.getAttribute('data-show-all-values') === 'true');
    const autoselect = (this.$module.getAttribute('data-auto-select') === 'true');
    const defaultValue = this.$module.getAttribute('data-default-value');
    const minLength = this.$module.getAttribute('data-min-length');

    const configurationOptions = {
      selectElement,
      showAllValues,
      autoselect,
      defaultValue,
      minLength,
      onConfirm: (val) => {
        // if you try commenting out the following line you will get a failing test
        // this triggers on blur of the field (so regardless of auto select)
        selectElement.value = ''; // deselect currently selected option, so we don't retain previous answer if new one doesn't match any option
        const selectedOption = [].filter.call(
          selectOptions,
          (option) => (option.textContent || option.innerText) === val,
        )[0];
        if (selectedOption) selectedOption.selected = true;
      },
    };

    const language = selectElement.getAttribute('data-language') || 'en';

    if (language === 'cy') {
      configurationOptions.tAssistiveHint = () => 'Pan fydd canlyniadau awtogwblhau ar gael, defnyddiwch y saethau i fyny ac i lawr i’w hadolygu a phwyswch y fysell ’enter’ i’w dewis.'
        + ' Gall defnyddwyr dyfeisiau cyffwrdd, archwilio drwy gyffwrdd â’r sgrin neu drwy sweipio.';
      configurationOptions.tStatusQueryTooShort = (minQueryLength) => `Ysgrifennwch ${minQueryLength} neu fwy o gymeriadau am ganlyniadau`;
      configurationOptions.tNoResults = () => 'Dim canlyniadau wedi’u darganfod';
      configurationOptions.tStatusNoResults = () => 'Dim canlyniadau chwilio';
      configurationOptions.tStatusSelectedOption = (selectedOption, length, index) => `Mae ${selectedOption} ${index + 1} o ${length} wedi’i amlygu`;
      configurationOptions.tStatusResults = (length, contentSelectedOption) => {
        const resultOrResults = (length === 1) ? 'canlyniad' : 'o ganlyniadau';
        return `${length} ${resultOrResults} ar gael. ${contentSelectedOption}`;
      };
    }

    const selectElementOriginalId = selectElement.id;
    const selectElementAriaDescribedBy = selectElement.getAttribute('aria-describedby') || '';

    window.HMRCAccessibleAutocomplete.enhanceSelectElement(configurationOptions);

    const autocompleteElement = document.getElementById(selectElementOriginalId);
    const autocompleteElementAriaDescribedBy = (autocompleteElement && autocompleteElement.getAttribute('aria-describedby')) || '';

    const autocompleteElementMissingAriaDescribedAttrs = (
      autocompleteElement
      && autocompleteElement.tagName !== 'select'
      && !autocompleteElementAriaDescribedBy.includes(selectElementAriaDescribedBy)
    );
    if (autocompleteElementMissingAriaDescribedAttrs) {
      // if there is a hint and/or error then the autocomplete element
      // needs to be aria-describedby these, which it isn't be default
      // we need to check if it hasn't already been done to avoid
      autocompleteElement.setAttribute(
        'aria-describedby',
        `${selectElementAriaDescribedBy} ${autocompleteElementAriaDescribedBy}`,
      );
      // and in case page is still using adam's patch, this should stop
      // the select elements aria described by being added to the
      // autocomplete element twice when that runs (though unsure if a
      // screen reader would actually announce the elements twice if same
      // element was listed twice in the aria-describedby attribute)
      selectElement.setAttribute('aria-describedby', '');
    }
  }
};

export default AccessibleAutoComplete;
