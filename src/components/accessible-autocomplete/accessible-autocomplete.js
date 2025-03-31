function AccessibleAutoComplete($module, window, document) {
  this.$module = $module;
  this.window = window;
  this.document = document;
}

AccessibleAutoComplete.prototype.init = function init() {
  if (this.$module) {
    const trimQuery = (values) => (query, syncResults) => {
      const matches = values.filter((r) => r.toLowerCase()
        .indexOf(query.toLowerCase().trim()) !== -1);
      syncResults(matches);
    };
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
      // we don't yet support preserveNullOptions,
      // but if we start then it needs to override this filtering
      // https://github.com/alphagov/accessible-autocomplete/blob/main/src/wrapper.js#L24
      source: trimQuery(Array.from(this.$module.options).filter((a) => a.value)
        .map((a) => a.textContent)),
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
      // needs to be aria-describedby these, which it isn't by default.
      // we need to check if it hasn't already been done to avoid adding
      // them twice if someone has added a separate patch.
      autocompleteElement.setAttribute(
        'aria-describedby',
        `${selectElementAriaDescribedBy} ${autocompleteElementAriaDescribedBy}`,
      );
      // IMPORTANT ACCESSIBILITY NOTE:
      // on interaction, the accessible autocomplete will update the
      // aria-describedby attribute, which will cause the links to hint
      // and error to be removed. After talking with DIAS we've opted
      // not to re-add the links at the moment, because when we do they
      // are re-announced to users too much (after they select an option)
      // we may investigate ways to add the links back after a delay to
      // maintain them without reducing usability in the future.

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
