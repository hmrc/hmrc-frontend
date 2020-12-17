import '../../vendor/polyfills/Element/prototype/dataset';
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
  this.$currentBreakpoint = getCurrentBreakpoint();
}

AccountMenu.prototype.init = function init() {
  this.setup();

  this.$showSubnavLink.addEventListener('click', this.eventHandlers.showSubnavLinkClick.bind(this));
  this.$showSubnavLink.addEventListener('focusout', this.eventHandlers.showSubnavLinkFocusOut.bind(this));
  this.$showSubnavLink.addEventListener('focusin', this.eventHandlers.showSubnavLinkFocusIn.bind(this));
  this.$backLink.addEventListener('click', this.eventHandlers.backLinkClick.bind(this));
  this.$subNav.addEventListener('focusout', this.eventHandlers.subNavFocusOut.bind(this));
  this.$subNav.addEventListener('focusin', this.eventHandlers.subNavFocusIn.bind(this));
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
  showSubnavLinkClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (isSmall(window)) {
      // TODO: remove redundant check - showSubnavLink appears only when subnav is not expanded
      if (!event.currentTarget.classList.contains('hmrc-account-menu__link--more-expanded')) {
        this.hideMainNavMobile(event.currentTarget);
        this.showSubnavMobile(event.currentTarget);
      }
    } else if (event.currentTarget.classList.contains('hmrc-account-menu__link--more-expanded')) {
      this.hideSubnavDesktop();
    } else {
      this.showSubnavDesktop();
    }
  },
  showSubnavLinkFocusOut(event) {
    if (!isSmall(window)) {
      this.$module.querySelector(event.target.hash).dataset.subMenuTimer = setTimeout(() => {}, 0);
    }
  },
  showSubnavLinkFocusIn(event) {
    if (!isSmall(window)) {
      clearTimeout(this.$module.querySelector(event.target.hash).dataset.subMenuTimer);
    }
  },
  backLinkClick(event) {
    event.preventDefault();

    // TODO: remove redundant check - backlink appears only when subnav is open
    if (this.$mainNav.classList.contains('hmrc-subnav-is-open')) {
      this.hideSubnavMobile();
      this.showMainNavMobile();
    }
  },
  subNavFocusOut(event) {
    if (!isSmall(window)) {
      // eslint-disable-next-line no-param-reassign
      event.currentTarget.dataset.subMenuTimer = setTimeout(this.hideSubnavDesktop.bind(this), 0);
    }
  },
  subNavFocusIn(event) {
    clearTimeout(event.currentTarget.dataset.subMenuTimer);
  },
  showNavLinkMobileClick(event) {
    event.preventDefault();

    if (isSmall(window)) {
      if (this.$mainNav.classList.contains('hmrc-subnav-is-open') || this.$mainNav.classList.contains('main-nav-is-open')) {
        this.hideSubnavMobile();
        this.hideMainNavMobile(event.currentTarget);
      } else {
        this.showMainNavMobile();
      }
    }
  },
};

AccountMenu.prototype.setup = function setup() {
  this.$subNav.setAttribute('aria-hidden', 'true');
  this.$subNav.setAttribute('tabindex', '-1');

  this.$showSubnavLink.setAttribute('aria-controls', this.$showSubnavLink.hash.substr(1));
  this.$showSubnavLink.setAttribute('aria-expanded', 'false');

  if (isSmall(window)) {
    this.$module.classList.add('is-smaller');
    this.$showNavLinkMobile.setAttribute('aria-hidden', 'false');
    this.$showNavLinkMobile.removeAttribute('tabindex');
    this.$showNavLinkMobile.classList.remove('js-hidden');

    this.hideSubnavMobile();
    this.hideMainNavMobile(this.$showNavLinkMobile);
  } else {
    this.$module.classList.remove('is-smaller');
    this.$mainNav.classList.remove('main-nav-is-open', 'js-hidden');
    this.$subNav.classList.remove('js-hidden');
    this.$showNavLinkMobile.setAttribute('aria-hidden', 'true');
    this.$showNavLinkMobile.setAttribute('tabindex', '-1');
    this.$showNavLinkMobile.classList.add('js-hidden');
  }
};

AccountMenu.prototype.showSubnavDesktop = function showSubnavDesktop() {
  const self = this;

  this.$module.classList.add('hmrc-subnav-is-open');

  this.$mainNav.classList.add('hmrc-subnav-is-open');

  this.$subNav.classList.add('hmrc-subnav-reveal');
  this.$subNav.setAttribute('aria-hidden', 'false');
  this.$subNav.setAttribute('aria-expanded', 'true');

  const subNavHeight = this.$subNav.offsetHeight;
  this.$module.style.marginBottom = `${subNavHeight}px`;

  setTimeout(() => {
    self.$subNav.focus();
  }, 500);

  this.$showSubnavLink.classList.add('hmrc-account-menu__link--more-expanded');
  this.$showSubnavLink.setAttribute('aria-expanded', 'true');
};

AccountMenu.prototype.hideSubnavDesktop = function hideSubnavDesktop() {
  this.$module.classList.remove('main-nav-is-open', 'hmrc-subnav-is-open');

  this.$mainNav.classList.remove('hmrc-subnav-is-open');

  this.$subNav.classList.remove('hmrc-subnav-reveal');
  this.$subNav.setAttribute('aria-hidden', 'true');
  this.$subNav.setAttribute('aria-expanded', 'false');

  this.$showSubnavLink.classList.remove('hmrc-account-menu__link--more-expanded');
  this.$showSubnavLink.setAttribute('aria-expanded', 'false');

  this.$module.style.marginBottom = this.$moduleBottomMargin;
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
    this.$mainNav.classList.remove('hmrc-subnav-is-open');
    this.$mainNav.classList.add('js-hidden');

    this.$showNavLinkMobile.setAttribute('aria-expanded', 'false');
    this.$showNavLinkMobile.classList.remove('hmrc-account-home--account--is-open');
  } else if (element.classList.contains('hmrc-account-menu__link--more')) {
    this.$mainNav.classList.add('hmrc-subnav-is-open');
  }
};

AccountMenu.prototype.showSubnavMobile = function showSubnavMobile(element) {
  this.$module.classList.add('hmrc-subnav-is-open');

  this.$mainNav.classList.remove('main-nav-is-open');
  this.$mainNav.classList.add('hmrc-subnav-is-open');

  this.$subNav.classList.remove('js-hidden');
  this.$subNav.classList.add('hmrc-subnav-reveal');
  this.$subNav.setAttribute('aria-hidden', 'false');
  this.$subNav.setAttribute('aria-expanded', 'true');

  this.$showSubnavLink.classList.add('hmrc-account-menu__link--more-expanded');
  this.$showSubnavLink.setAttribute('aria-expanded', 'true');

  this.$backLink.parentNode.setAttribute('aria-hidden', 'false');
  this.$backLink.removeAttribute('tabindex');
  this.$backLink.parentNode.classList.remove('hidden');

  element.parentNode.classList.add('active-subnav-parent');

  // TODO: modernise the following and polyfill it for IE8
  const $elementSiblings = element.parentNode.parentNode.children;
  for (let i = 0; i < $elementSiblings.length; i += 1) {
    const sibling = $elementSiblings[i];
    if (sibling !== this.$backLink.parentNode && sibling !== element.parentNode) {
      sibling.classList.add('hidden');
    }
  }
};

AccountMenu.prototype.hideSubnavMobile = function hideSubnavMobile() {
  this.$module.classList.remove('hmrc-subnav-is-open');

  this.$mainNav.classList.remove('hmrc-subnav-is-open');
  this.$mainNav.classList.add('main-nav-is-open');

  this.$subNav.classList.add('js-hidden');
  this.$subNav.classList.remove('hmrc-subnav-reveal');
  this.$subNav.setAttribute('aria-hidden', 'true');
  this.$subNav.setAttribute('aria-expanded', 'false');

  this.$showSubnavLink.classList.remove('hmrc-account-menu__link--more-expanded');
  this.$showSubnavLink.setAttribute('aria-expanded', 'false');

  this.$backLink.parentNode.setAttribute('aria-hidden', 'true');
  this.$backLink.setAttribute('tabindex', '-1');
  this.$backLink.parentNode.classList.add('hidden');

  this.$showSubnavLink.parentNode.classList.remove('active-subnav-parent');

  // TODO: modernise the following and polyfill it for IE8
  const $backLinkSiblings = this.$backLink.parentNode.parentNode.children;
  for (let i = 0; i < $backLinkSiblings.length; i += 1) {
    const sibling = $backLinkSiblings[i];
    if (sibling !== this.$backLink.parentNode) {
      sibling.classList.remove('hidden');
    }
  }
};

export default AccountMenu;
