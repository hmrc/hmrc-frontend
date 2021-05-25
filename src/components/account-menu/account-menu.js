import { debounce } from '../../utils/debounce';
import { getCurrentBreakpoint } from '../../utils/breakpoints';

const isSmall = (element) => element.innerWidth <= 768;

function AccountMenu($module) {
  this.$module = document.querySelector($module);
  this.$moduleBottomMargin = this.$module.style.marginBottom;
  this.$mainNav = this.$module.querySelector('.hmrc-account-menu__main');
  this.$subNav = this.$module.querySelector('.hmrc-subnav');
  this.$showSubnavLink = this.$module.querySelector('#account-menu__main-2');
  this.$showNavLinkMobile = this.$module.querySelector('.hmrc-account-menu__link--menu');
  this.$currentBreakpoint = getCurrentBreakpoint();
}

AccountMenu.prototype.init = function init() {
  this.setup();

  this.$showSubnavLink.addEventListener('click', this.eventHandlers.showSubnavLinkClick.bind(this));

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

AccountMenu.prototype.isSubNavOpen = function isSubNavOpen() {
  return this.$module.classList.contains('hmrc-subnav-is-open');
};

AccountMenu.prototype.isMainNavOpen = function isSubNavOpen() {
  return this.$module.classList.contains('main-nav-is-open');
};

AccountMenu.prototype.eventHandlers = {
  showSubnavLinkClick(event) {
    event.preventDefault();

    if (this.isSubNavOpen()) {
      this.hideSubnav();
    } else {
      this.showSubnav();
    }
  },
  showNavLinkMobileClick(event) {
    event.preventDefault();

    if (this.isMainNavOpen()) {
      this.hideMainNav();
    } else {
      this.showMainNav();
    }
  },
};

AccountMenu.prototype.setup = function setup() {
  if (isSmall(window)) {
    this.$module.classList.add('is-smaller');
    this.$showNavLinkMobile.removeAttribute('hidden');

    this.hideSubnav();
    this.hideMainNav();
  } else {
    this.$module.classList.remove('is-smaller');
    this.$mainNav.removeAttribute('hidden');
    this.$showNavLinkMobile.setAttribute('hidden', 'hidden');
  }
};

AccountMenu.prototype.showSubnav = function showSubnav() {
  this.$module.classList.add('hmrc-subnav-is-open');
  this.$subNav.removeAttribute('hidden');
  this.$showSubnavLink.setAttribute('aria-expanded', 'true');

  if (!isSmall(window)) {
    this.$module.style.marginBottom = `${this.$subNav.offsetHeight}px`;
  }
};

AccountMenu.prototype.hideSubnav = function hideSubnav() {
  this.$module.classList.remove('hmrc-subnav-is-open');
  this.$subNav.setAttribute('hidden', 'hidden');
  this.$showSubnavLink.setAttribute('aria-expanded', 'false');

  if (!isSmall(window)) {
    this.$module.style.marginBottom = this.$moduleBottomMargin;
  }
};

AccountMenu.prototype.showMainNav = function showMainNavMobile() {
  this.$module.classList.add('main-nav-is-open');
  this.$mainNav.removeAttribute('hidden');
  this.$showNavLinkMobile.setAttribute('aria-expanded', 'true');
};

AccountMenu.prototype.hideMainNav = function hideMainNavMobile() {
  this.hideSubnav();

  this.$module.classList.remove('main-nav-is-open');
  this.$module.classList.remove('hmrc-subnav-is-open');
  this.$mainNav.setAttribute('hidden', 'hidden');
  this.$showNavLinkMobile.setAttribute('aria-expanded', 'false');
};

export default AccountMenu;
