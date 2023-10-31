function HmrcPrintLink($module, window) {
  this.$module = $module;
  this.window = window;
}

HmrcPrintLink.prototype.init = function init() {
  this.$module.addEventListener('click', (event) => {
    event.preventDefault();
    this.window.print();
  });
};

export default HmrcPrintLink;
