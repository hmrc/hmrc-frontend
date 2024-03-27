function BackLinkHelper($module, window, document) {
  this.$module = $module;
  this.window = window;
  this.document = document;
}

BackLinkHelper.prototype.init = function init() {
  const isReferrerExternal = () => {
    // If there is no referrer, consider it on the same domain
    if (!this.document.referrer) {
      return false;
    }

    try {
      const currentDomain = new URL(this.window.location.href).hostname;
      const referrerDomain = new URL(this.document.referrer).hostname;

      // Check if the referrer is not the same as the current domain
      return currentDomain !== referrerDomain;
    } catch (err) {
      return false;
    }
  };

  // do nothing if History API is absent
  if (this.window.history) {
    // hide the backlink if the referrer is on a different domain
    if (isReferrerExternal()) {
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
