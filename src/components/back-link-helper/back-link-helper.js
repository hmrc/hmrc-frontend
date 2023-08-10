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

    // hide the backlink if the referrer is on a different domain or the referrer is not set
    if (docReferrer === '' || docReferrer.indexOf(this.window.location.host) === -1) {
      this.$module.classList.add('hmrc-hidden-backlink');
    } else {
      // prevent resubmit warning
      if (this.window.history.replaceState && typeof this.window.history.replaceState === 'function') {
        this.window.history.replaceState(null, null, this.window.location.href);
      }

      this.$module.addEventListener('click', (event) => {
        event.preventDefault();
        if (this.window.history.back && typeof this.window.history.back === 'function') {
          this.window.history.back();
        }
      });
    }
  }
};

export default BackLinkHelper;
