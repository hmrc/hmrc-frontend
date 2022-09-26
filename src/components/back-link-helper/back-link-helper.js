function BackLinkHelper($module, window, document) {
  this.$module = $module;
  this.window = window;
  this.document = document;
}

BackLinkHelper.prototype.init = function init() {
  // do nothing if History API is absent
  if (this.window.history) {
    // store referrer value to cater for IE
    const docReferrer = this.document.referrer;

    // prevent resubmit warning
    if (this.window.history.replaceState && typeof this.window.history.replaceState === 'function') {
      this.window.history.replaceState(null, null, this.window.location.href);
    }

    // handle 'Back' click, dependent upon presence of referrer & no host change
    this.$module.addEventListener('click', (event) => {
      event.preventDefault();
      if (this.window.history.back && typeof this.window.history.back === 'function') {
        if (docReferrer !== '' && docReferrer.indexOf(this.window.location.host) !== -1) {
          this.window.history.back();
        }
      }
    });
  }
};

export default BackLinkHelper;
