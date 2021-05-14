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
  this.$backLink = this.$module.querySelector('.hmrc-account-menu__link--back a');
  this.$messagesLink = this.$module.querySelector('.hmrc-account-menu__messages');
  this.$signOutLink = this.$module.querySelector('.hmrc-account-menu__sign-out');
  this.$checkProgressLink = this.$module.querySelector('.hmrc-account-menu__check-progress');
  this.$currentBreakpoint = getCurrentBreakpoint();
}

AccountMenu.prototype.init = function init() {
  this.setup();

  this.$showSubnavLink.addEventListener('click', this.eventHandlers.showSubnavLinkClick.bind(this));

  // FIXME: consider removing this functionality for better accessibility
  this.$backLink.addEventListener('click', this.eventHandlers.backLinkClick.bind(this));

  // FIXME: consider removing this functionality for better accessibility
  this.$subNav.addEventListener('focusout', this.eventHandlers.subNavFocusOut.bind(this));

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
  backLinkClick(event) {
    event.preventDefault();

    this.hideSubnav();
  },
  subNavFocusOut(event) {
    const { relatedTarget } = event;

    // Element.closest is polyfilled for IE by govuk-frontend:
    // https://github.com/alphagov/govuk-frontend/blob/4b5ed0ada3b64722ae2074dfa0db5d4d3a45cb79/src/govuk/vendor/polyfills/Element/prototype/closest.js
    const isInSubNav = relatedTarget && relatedTarget.closest('.hmrc-subnav') !== null;
    const isOnShowSubNavLink = relatedTarget && relatedTarget.closest('#account-menu__main-2') !== null;

    if (!isSmall(window) && !isInSubNav && !isOnShowSubNavLink) {
      this.hideSubnav();
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

  if (isSmall(window)) {
    // FIXME: consider removing this functionality for better accessibility
    this.$backLink.parentNode.removeAttribute('hidden');
    this.$messagesLink.setAttribute('hidden', 'hidden');
    this.$signOutLink.setAttribute('hidden', 'hidden');
    this.$checkProgressLink.setAttribute('hidden', 'hidden');
    // FIXME: end
  } else {
    this.$module.style.marginBottom = `${this.$subNav.offsetHeight}px`;
  }
};

AccountMenu.prototype.hideSubnav = function hideSubnav() {
  this.$module.classList.remove('hmrc-subnav-is-open');
  this.$subNav.setAttribute('hidden', 'hidden');
  this.$showSubnavLink.setAttribute('aria-expanded', 'false');

  if (isSmall(window)) {
    // FIXME: consider removing this functionality for better accessibility
    this.$backLink.parentNode.setAttribute('hidden', 'hidden');
    this.$messagesLink.removeAttribute('hidden');
    this.$signOutLink.removeAttribute('hidden');
    this.$checkProgressLink.removeAttribute('hidden');
    // FIXME: end
  } else {
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
