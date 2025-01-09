function AccessibleAutoComplete($module, window, document) {
  this.$module = $module;
  this.window = window;
  this.document = document;
}

AccessibleAutoComplete.prototype.init = function init() {
  if (this.$module) {
    const selectElement = this.$module;
    const selectOptions = Array.from(selectElement.options);
    const autocompleteId = selectElement.id;
    const showAllValues = (selectElement.getAttribute('data-show-all-values') === 'true');
    const autoselect = (selectElement.getAttribute('data-auto-select') === 'true');
    const defaultValue = selectElement.getAttribute('data-default-value');
    const minLength = selectElement.getAttribute('data-min-length');

    const configurationOptions = {
      selectElement,
      showAllValues,
      autoselect,
      defaultValue,
      minLength,
      onConfirm: (chosenOption) => {
        selectElement.value = '';
        const chosenOptionOrCurrentValue = (typeof chosenOption !== 'undefined')
          ? chosenOption
          : document.getElementById(autocompleteId)?.value;
        const selectedOption = [].filter.call(
          selectOptions,
          (option) => (option.textContent || option.innerText) === chosenOptionOrCurrentValue,
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

    window.HMRCAccessibleAutocomplete.enhanceSelectElement(configurationOptions);

    const selectElementAriaDescribedBy = selectElement.getAttribute('aria-describedby') || '';
    const autocompleteElement = document.getElementById(autocompleteId);
    const autocompleteElementAriaDescribedBy = (autocompleteElement?.getAttribute('aria-describedby')) || '';
    const autocompleteElementMissingAriaDescribedAttrs = (
      autocompleteElement
      && autocompleteElement.tagName !== 'select'
      && !autocompleteElementAriaDescribedBy.includes(selectElementAriaDescribedBy)
    );
    if (autocompleteElementMissingAriaDescribedAttrs) {
      // if there is a hint and/or error then the autocomplete element
      // needs to be aria-describedby these, which it isn't be default.
      // we need to check if it hasn't already been done to avoid adding
      // them twice if someone has added a separate patch.
      autocompleteElement.setAttribute(
        'aria-describedby',
        `${selectElementAriaDescribedBy} ${autocompleteElementAriaDescribedBy}`,
      );

      if (window.MutationObserver != null) {
        // when the input is empty, the autocomplete adds a link to a hint
        // that explains how to interact with the input via aria-describedby
        // and when it's not empty it removes it. These changes cause the
        // removal of the links to the error and hint, so we need to add
        // those links back, as well as maintain the link to the hint if it
        // was present because the input is empty.
        new MutationObserver(() => {
          const currentAriaDescribedBy = autocompleteElement.getAttribute('aria-describedby') || '';
          if (!currentAriaDescribedBy?.includes(selectElementAriaDescribedBy)) {
            autocompleteElement.setAttribute('aria-describedby', `${selectElementAriaDescribedBy} ${currentAriaDescribedBy}`);
          }
        }).observe(autocompleteElement, {
          attributes: true,
          attributeFilter: ['aria-describedby'],
        });
      }

      // and in case page is still using adam's patch, this should stop
      // the select elements aria-describedby from being added to the
      // autocomplete element twice when that runs (though unsure if a
      // screen reader would actually announce the elements twice if same
      // element was listed twice in the aria-describedby attribute)
      selectElement.setAttribute('aria-describedby', '');
    }
  }
};

export default AccessibleAutoComplete;
