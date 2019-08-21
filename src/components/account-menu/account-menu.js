import '../../vendor/polyfills/Element/prototype/dataset'
import { debounce } from '../../utils/debounce'
import { getCurrentBreakpoint } from '../../utils/breakpoints'

function AccountMenu ($module) {
  this.$module = document.querySelector($module)
  this.$mainNav = this.$module.querySelector('.hmrc-account-menu__main')
  this.$subNav = this.$module.querySelector('.hmrc-subnav')
  this.$showSubnavLink = this.$module.querySelector('#account-menu__main-2')
  this.$showNavLinkMobile = this.$module.querySelector('.hmrc-account-menu__link--menu')
  this.$backLink = this.$module.querySelector('.hmrc-account-menu__link--back a')
  this.$currentBreakpoint = getCurrentBreakpoint()
}

AccountMenu.prototype.init = function () {
  this.setup()

  this.$showSubnavLink.addEventListener('click', this.eventHandlers.showSubnavLinkClick.bind(this))
  this.$showSubnavLink.addEventListener('focusout', this.eventHandlers.showSubnavLinkFocusOut.bind(this))
  this.$showSubnavLink.addEventListener('focusin', this.eventHandlers.showSubnavLinkFocusIn.bind(this))
  this.$backLink.addEventListener('click', this.eventHandlers.backLinkClick.bind(this))
  this.$subNav.addEventListener('focusout', this.eventHandlers.subNavFocusOut.bind(this))
  this.$subNav.addEventListener('focusin', this.eventHandlers.subNavFocusIn.bind(this))
  this.$showNavLinkMobile.addEventListener('click', this.eventHandlers.showNavLinkMobileClick.bind(this))

  window.addEventListener('resize', debounce(this.reinstantiate.bind(this)))
}

AccountMenu.prototype.reinstantiate = function (resizeEvent) {
  const newBreakpoint = getCurrentBreakpoint(resizeEvent.target.innerWidth)
  const hasCrossedBreakpoint = this.$currentBreakpoint !== newBreakpoint
  if (hasCrossedBreakpoint) {
    this.$currentBreakpoint = newBreakpoint
    this.setup()
  }
}

AccountMenu.prototype.eventHandlers = {
  showSubnavLinkClick: function (event) {
    event.preventDefault()
    event.stopPropagation()

    if (isSmall(window)) {
      // TODO: remove redundant check - showSubnavLink appears only when subnav is not expanded
      if (!event.currentTarget.classList.contains('hmrc-account-menu__link--more-expanded')) {
        this.hideMainNavMobile(event.currentTarget)
        this.showSubnavMobile(event.currentTarget)
      }
    } else {
      if (event.currentTarget.classList.contains('hmrc-account-menu__link--more-expanded')) {
        this.hideSubnavDesktop()
      } else {
        this.showSubnavDesktop()
      }
    }
  },
  showSubnavLinkFocusOut: function (event) {
    if (!isSmall(window)) {
      this.$module.querySelector(event.target.hash).dataset.subMenuTimer = setTimeout(function () {}, 0)
    }
  },
  showSubnavLinkFocusIn: function (event) {
    if (!isSmall(window)) {
      clearTimeout(this.$module.querySelector(event.target.hash).dataset.subMenuTimer)
    }
  },
  backLinkClick: function (event) {
    event.preventDefault()

    // TODO: remove redundant check - backlink appears only when subnav is open
    if (this.$mainNav.classList.contains('hmrc-subnav-is-open')) {
      this.hideSubnavMobile()
      this.showMainNavMobile()
    }
  },
  subNavFocusOut: function (event) {
    if (!isSmall(window)) {
      event.currentTarget.dataset.subMenuTimer = setTimeout(this.hideSubnavDesktop.bind(this), 0)
    }
  },
  subNavFocusIn: function (event) {
    clearTimeout(event.currentTarget.dataset.subMenuTimer)
  },
  showNavLinkMobileClick: function (event) {
    event.preventDefault()

    if (isSmall(window)) {
      if (this.$mainNav.classList.contains('hmrc-subnav-is-open') || this.$mainNav.classList.contains('main-nav-is-open')) {
        this.hideSubnavMobile()
        this.hideMainNavMobile(event.currentTarget)
      } else {
        this.showMainNavMobile()
      }
    }
  }
}

AccountMenu.prototype.setup = function () {
  this.$subNav.setAttribute('aria-hidden', 'true')
  this.$subNav.setAttribute('tabindex', '-1')

  this.$showSubnavLink.setAttribute('aria-controls', this.$showSubnavLink.hash.substr(1))
  this.$showSubnavLink.setAttribute('aria-expanded', 'false')

  if (isSmall(window)) {
    this.$module.classList.add('is-smaller')
    this.$showNavLinkMobile.setAttribute('aria-hidden', 'false')
    this.$showNavLinkMobile.classList.remove('js-hidden')

    this.hideSubnavMobile()
    this.hideMainNavMobile(this.$showNavLinkMobile)
  } else {
    this.$module.classList.remove('is-smaller')
    this.$mainNav.classList.remove('main-nav-is-open', 'js-hidden')
    this.$subNav.classList.remove('js-hidden')
    this.$showNavLinkMobile.setAttribute('aria-hidden', 'true')
    this.$showNavLinkMobile.classList.add('js-hidden')
  }
}

AccountMenu.prototype.showSubnavDesktop = function () {
  var _this = this

  this.$module.classList.add('hmrc-subnav-is-open')

  this.$mainNav.classList.add('hmrc-subnav-is-open')

  this.$subNav.classList.add('hmrc-subnav-reveal')
  this.$subNav.setAttribute('aria-hidden', 'false')
  this.$subNav.setAttribute('aria-expanded', 'true')

  setTimeout(function () {
    _this.$subNav.focus()
  }, 500)

  this.$showSubnavLink.classList.add('hmrc-account-menu__link--more-expanded')
  this.$showSubnavLink.setAttribute('aria-hidden', 'false')
  this.$showSubnavLink.setAttribute('aria-expanded', 'true')
}

AccountMenu.prototype.hideSubnavDesktop = function () {
  this.$module.classList.remove('main-nav-is-open', 'hmrc-subnav-is-open')

  this.$mainNav.classList.remove('hmrc-subnav-is-open')

  this.$subNav.classList.remove('hmrc-subnav-reveal')
  this.$subNav.setAttribute('aria-hidden', 'true')
  this.$subNav.setAttribute('aria-expanded', 'false')

  this.$showSubnavLink.classList.remove('hmrc-account-menu__link--more-expanded')
  this.$showSubnavLink.setAttribute('aria-hidden', 'true')
  this.$showSubnavLink.setAttribute('aria-expanded', 'false')
}

AccountMenu.prototype.showMainNavMobile = function () {
  // TODO: shall we add main-nav-is-open to `nav`????
  this.$mainNav.classList.remove('js-hidden')
  this.$mainNav.classList.add('main-nav-is-open')
  this.$mainNav.setAttribute('aria-expanded', 'true')

  this.$showNavLinkMobile.setAttribute('aria-expanded', 'true')
  this.$showNavLinkMobile.classList.add('hmrc-account-home--account--is-open')
}

AccountMenu.prototype.hideMainNavMobile = function (element) {
  this.$mainNav.classList.remove('main-nav-is-open')
  this.$mainNav.setAttribute('aria-expanded', 'false')

  if (element.classList.contains('hmrc-account-menu__link--menu')) {
    this.$mainNav.classList.remove('hmrc-subnav-is-open')
    this.$mainNav.classList.add('js-hidden')

    this.$showNavLinkMobile.setAttribute('aria-expanded', 'false')
    this.$showNavLinkMobile.classList.remove('hmrc-account-home--account--is-open')
  } else if (element.classList.contains('hmrc-account-menu__link--more')) {
    this.$mainNav.classList.add('hmrc-subnav-is-open')
  }
}

AccountMenu.prototype.showSubnavMobile = function (element) {
  this.$module.classList.add('hmrc-subnav-is-open')

  this.$mainNav.classList.remove('main-nav-is-open')
  this.$mainNav.classList.add('hmrc-subnav-is-open')

  this.$subNav.classList.remove('js-hidden')
  this.$subNav.classList.add('hmrc-subnav-reveal')
  this.$subNav.setAttribute('aria-hidden', 'false')
  this.$subNav.setAttribute('aria-expanded', 'true')

  this.$showSubnavLink.classList.add('hmrc-account-menu__link--more-expanded')
  this.$showSubnavLink.setAttribute('aria-hidden', 'false')
  this.$showSubnavLink.setAttribute('aria-expanded', 'true')

  this.$backLink.parentNode.setAttribute('aria-hidden', 'false')
  this.$backLink.parentNode.classList.remove('hidden')

  element.parentNode.classList.add('active-subnav-parent')

  // TODO: modernise the following and polyfill it for IE8
  var $elementSiblings = element.parentNode.parentNode.children
  for (var i = 0; i < $elementSiblings.length; i++) {
    var sibling = $elementSiblings[i]
    if (sibling !== this.$backLink.parentNode && sibling !== element.parentNode) {
      sibling.classList.add('hidden')
    }
  }
}

AccountMenu.prototype.hideSubnavMobile = function () {
  this.$module.classList.remove('hmrc-subnav-is-open')

  this.$mainNav.classList.remove('hmrc-subnav-is-open')
  this.$mainNav.classList.add('main-nav-is-open')

  this.$subNav.classList.add('js-hidden')
  this.$subNav.classList.remove('hmrc-subnav-reveal')
  this.$subNav.setAttribute('aria-hidden', 'true')
  this.$subNav.setAttribute('aria-expanded', 'false')

  this.$showSubnavLink.classList.remove('hmrc-account-menu__link--more-expanded')
  this.$showSubnavLink.setAttribute('aria-hidden', 'true')
  this.$showSubnavLink.setAttribute('aria-expanded', 'false')

  this.$backLink.parentNode.setAttribute('aria-hidden', 'true')
  this.$backLink.parentNode.classList.add('hidden')

  this.$showSubnavLink.parentNode.classList.remove('active-subnav-parent')

  // TODO: modernise the following and polyfill it for IE8
  var $backLinkSiblings = this.$backLink.parentNode.parentNode.children
  for (var i = 0; i < $backLinkSiblings.length; i++) {
    var sibling = $backLinkSiblings[i]
    if (sibling !== this.$backLink.parentNode) {
      sibling.classList.remove('hidden')
    }
  }

  // TODO: change to
  // mainNav.children().not(backLink).removeClass('js-hidden')
}

function isSmall (element) {
  return element.innerWidth <= 768
}

export default AccountMenu
