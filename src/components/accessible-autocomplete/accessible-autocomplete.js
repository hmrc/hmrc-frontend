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
    const showAllValues = (this.$module.getAttribute('data-show-all-values') === 'true');
    const autoselect = (this.$module.getAttribute('data-auto-select') === 'true');
    const defaultValue = this.$module.getAttribute('data-default-value');
    window.HMRCAccessibleAutocomplete.enhanceSelectElement({
      selectElement: this.$module,
      showAllValues,
      autoselect,
      defaultValue,
      source: trimQuery(Array.from(this.$module.options).map((a) => a.innerText)),
    });
  }
};

export default AccessibleAutoComplete;
