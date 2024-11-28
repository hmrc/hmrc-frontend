function BackLinkHelper($module, window, document) {
  this.$module = $module;
  this.window = window;
  this.document = document;
}

BackLinkHelper.prototype.init = function init() {
  // do nothing if History API is absent
  if (this.window.history) {
    // eslint-disable-next-line max-len
    /* TODO: It remains unclear whether a check for the same domain is necessary for security reasons.
       There may be user research suggesting considerations regarding the visibility of the
       back link on refresh.
       Currently, a page refresh sets the referer to empty, leading to the back link being hidden
       under our existing logic.
     */
    const invalidDomain = () => {
      const ref = this.document.referrer;
      const noRef = !ref;
      const diffDom = (ref) ? ref.indexOf(this.window.location.host) === -1 : false;

      // Allow PEGA domains
      const allowList = ['maccount-np.hmrc.gov.uk', 'account.hmrc.gov.uk','https://jira.tools.tax.service.gov.uk/'];
      const allowed = (diffDom && !noRef) ? allowList.some((e) => ref.includes(e)) : false;

      return !allowed;
    };

    // hide the backlink if the referrer is on a different domain or the referrer is not set
    if (invalidDomain()) {
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
