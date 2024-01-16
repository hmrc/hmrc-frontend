import { debounce } from '../../utils/debounce';
import { getCurrentBreakpoint } from '../../utils/breakpoints';

const isSmall = (element) => element.innerWidth <= 768;

function AccountMenu($module) {
  this.$module = document.querySelector($module);
  this.$moduleBottomMargin = this.$module.style.marginBottom;
  this.$mainNav = this.$module.querySelector('.hmrc-account-menu__main');
  this.$showNavLinkMobile = this.$module.querySelector('.hmrc-account-menu__link--menu');
  this.$currentBreakpoint = getCurrentBreakpoint();
}

AccountMenu.prototype.init = function init() {
  this.setup();

  this.$showNavLinkMobile.addEventListener('click', this.eventHandlers.showNavLinkMobileClick.bind(this));

  window.addEventListener('resize', debounce(this.reinstantiate.bind(this)));
};

AccountMenu.prototype.reinstantiate = function reinstantiate(resizeEvent) {
  const newBreakpoint = getCurrentBreakpoint(resizeEvent.target.innerWidth);
  const hasCrossedBreakpoint = this.$currentBreakpoint !== newBreakpoint;
  if (hasCrossedBreakpoint) {
    this.$currentBreakpoint = newBreakpoint;
    this.setup();
  }
};

AccountMenu.prototype.eventHandlers = {
  showNavLinkMobileClick(event) {
    event.preventDefault();

    if (isSmall(window)) {
      if (this.$mainNav.classList.contains('main-nav-is-open')) {
        this.hideMainNavMobile(event.currentTarget);
      } else {
        this.showMainNavMobile();
      }
    }
  },
};

AccountMenu.prototype.setup = function setup() {
  if (isSmall(window)) {
    this.$module.classList.add('is-smaller');
    this.$showNavLinkMobile.setAttribute('aria-hidden', 'false');
    this.$showNavLinkMobile.removeAttribute('tabindex');
    this.$showNavLinkMobile.classList.remove('js-hidden');

    this.hideMainNavMobile(this.$showNavLinkMobile);
  } else {
    this.$module.classList.remove('is-smaller');
    this.$mainNav.classList.remove('main-nav-is-open', 'js-hidden');
    this.$showNavLinkMobile.setAttribute('aria-hidden', 'true');
    this.$showNavLinkMobile.setAttribute('tabindex', '-1');
    this.$showNavLinkMobile.classList.add('js-hidden');
  }
};

AccountMenu.prototype.showMainNavMobile = function showMainNavMobile() {
  // TODO: shall we add main-nav-is-open to `nav`????
  this.$mainNav.classList.remove('js-hidden');
  this.$mainNav.classList.add('main-nav-is-open');
  this.$mainNav.setAttribute('aria-expanded', 'true');

  this.$showNavLinkMobile.setAttribute('aria-expanded', 'true');
  this.$showNavLinkMobile.classList.add('hmrc-account-home--account--is-open');
};

AccountMenu.prototype.hideMainNavMobile = function hideMainNavMobile(element) {
  this.$mainNav.classList.remove('main-nav-is-open');
  this.$mainNav.setAttribute('aria-expanded', 'false');

  if (element.classList.contains('hmrc-account-menu__link--menu')) {
    this.$mainNav.classList.add('js-hidden');

    this.$showNavLinkMobile.setAttribute('aria-expanded', 'false');
    this.$showNavLinkMobile.classList.remove('hmrc-account-home--account--is-open');
  }
};

export default AccountMenu;
