// TODO: move this to utils
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce (func, wait, immediate) {
  var timeout

  return function () {
    var context = this
    var args = arguments

    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    var callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

;(function (global) {
  'use strict'

  var $ = global.jQuery
  var HMRC = global.HMRC || {}

  HMRC.accountMenu = (function (global) {
    var $nav = document.querySelector('.hmrc-account-menu')
    var $mainNav = document.querySelector('.hmrc-account-menu__main')
    var $subNav = document.querySelector('.hmrc-subnav')
    var $showSubnavLink = document.querySelector('#account-menu__main-2')
    var $showNavLinkMobile = document.querySelector('.hmrc-account-menu__link--menu')
    var $backLink = document.querySelector('.hmrc-account-menu__link--back a')

    $subNav.setAttribute('aria-hidden', 'true')
    $subNav.setAttribute('tabindex', '-1')

    $showSubnavLink.setAttribute('aria-controls', $showSubnavLink.hash.substr(1))
    $showSubnavLink.setAttribute('aria-expanded', 'false')

    $showSubnavLink.addEventListener('click', function (event) {
      if (isSmall(global)) {
        // TODO: remove redundant check - showSubnavLink appears only when subnav is not expanded
        if (!event.currentTarget.classList.contains('hmrc-account-menu__link--more-expanded')) {
          hideMainNavMobile($(event.currentTarget))
          showSubnavMobile($(event.currentTarget))
        }
      } else {
        if (event.currentTarget.classList.contains('hmrc-account-menu__link--more-expanded')) {
          hideSubnavDesktop()
        } else {
          showSubnavDesktop()
        }
      }

      event.preventDefault()
      event.stopPropagation()
    })

    $showSubnavLink.addEventListener('focusout', function () {
      if (!isSmall(global)) {
        document.querySelector(this.hash).dataset.subMenuTimer = setTimeout(0)
      }
    })

    $showSubnavLink.addEventListener('focusin', function (event) {
      if (!isSmall(global)) {
        clearTimeout(document.querySelector(this.hash).dataset.subMenuTimer)
      }
    })

    $backLink.addEventListener('click', function (event) {
      // TODO: remove redundant check - backlink appears only when subnav is open
      if ($mainNav.classList.contains('hmrc-subnav-is-open')) {
        hideSubnavMobile()
        showMainNavMobile()
      }

      event.preventDefault()
    })

    $subNav.addEventListener('focusout', function (event) {
      if (!isSmall(global)) {
        event.currentTarget.dataset.subMenuTimer = setTimeout(function () {
          hideSubnavDesktop()
        }, 0)
      }
    })

    $subNav.addEventListener('focusin', function (event) {
      clearTimeout(event.currentTarget.dataset.subMenuTimer)
    })

    $showNavLinkMobile.addEventListener('click', function (event) {
      if (isSmall(global)) {
        if ($mainNav.classList.contains('hmrc-subnav-is-open') || $mainNav.classList.contains('main-nav-is-open')) {
          hideSubnavMobile()
          hideMainNavMobile($(event.currentTarget))
        } else {
          showMainNavMobile()
        }

        event.preventDefault()
      }
    })

    function init () {
      if (isSmall(global)) {
        $nav.classList.add('is-smaller')
        $showNavLinkMobile.setAttribute('aria-hidden', 'false')
        $showNavLinkMobile.classList.remove('js-hidden')
        hideSubnavMobile()
        hideMainNavMobile($($showNavLinkMobile))
      } else {
        $nav.classList.remove('is-smaller')
        $showNavLinkMobile.setAttribute('aria-hidden', 'true')
        $showNavLinkMobile.classList.add('js-hidden')
        $mainNav.classList.remove('main-nav-is-open', 'js-hidden')
        $subNav.classList.remove('js-hidden')
      }
    }

    var resizeHandler = debounce(init, 250)

    function showMainNavMobile () {
      // TODO: shall we add main-nav-is-open to `nav`????
      $mainNav.classList.remove('js-hidden')
      $mainNav.classList.add('main-nav-is-open')
      $mainNav.setAttribute('aria-expanded', 'true')

      $showNavLinkMobile.setAttribute('aria-expanded', 'true')
      $showNavLinkMobile.classList.add('hmrc-account-home--account--is-open')
    }

    function hideMainNavMobile (e) {
      $mainNav.classList.remove('main-nav-is-open')
      $mainNav.setAttribute('aria-expanded', 'false')

      if (e.hasClass('hmrc-account-menu__link--menu')) {
        $mainNav.classList.remove('hmrc-subnav-is-open')
        $mainNav.classList.add('js-hidden')

        $showNavLinkMobile.setAttribute('aria-expanded', 'false')
        $showNavLinkMobile.classList.remove('hmrc-account-home--account--is-open')
      } else if (e.hasClass('hmrc-account-menu__link--more')) {
        $mainNav.classList.add('hmrc-subnav-is-open')
      }
    }

    function showSubnavMobile (e) {
      $nav.classList.add('hmrc-subnav-is-open')

      $mainNav.classList.remove('main-nav-is-open')
      $mainNav.classList.add('hmrc-subnav-is-open')

      $subNav.classList.add('hmrc-subnav-reveal')
      $subNav.setAttribute('aria-hidden', 'false')
      $subNav.setAttribute('aria-expanded', 'true')

      $showSubnavLink.classList.add('hmrc-account-menu__link--more-expanded')
      $showSubnavLink.setAttribute('aria-hidden', 'false')
      $showSubnavLink.setAttribute('aria-expanded', 'true')

      $backLink.parentNode.setAttribute('aria-hidden', 'false')
      $backLink.parentNode.classList.remove('hidden')

      e.closest('li').addClass('active-subnav-parent')

      $subNav.classList.remove('js-hidden')

      e.parent().siblings().not($backLink.parentNode).addClass('hidden')
    }

    function hideSubnavMobile () {
      $nav.classList.remove('hmrc-subnav-is-open')

      $mainNav.classList.remove('hmrc-subnav-is-open')
      $mainNav.classList.add('main-nav-is-open')

      $subNav.classList.remove('hmrc-subnav-reveal')
      $subNav.setAttribute('aria-hidden', 'true')
      $subNav.setAttribute('aria-expanded', 'false')

      $showSubnavLink.classList.remove('hmrc-account-menu__link--more-expanded')
      $showSubnavLink.setAttribute('aria-hidden', 'true')
      $showSubnavLink.setAttribute('aria-expanded', 'false')

      $backLink.parentNode.setAttribute('aria-hidden', 'true')
      $backLink.parentNode.classList.add('hidden')

      $showSubnavLink.parentNode.classList.remove('active-subnav-parent')

      $subNav.classList.add('js-hidden')

      var $backLinkSiblings = $backLink.parentNode.parentNode.children

      // TODO: modernise the following and polyfill it for IE8
      for (let i = 0; i < $backLinkSiblings.length; i++) {
        const sibling = $backLinkSiblings[i]
        if (sibling !== $backLink.parentNode) {
          sibling.classList.remove('hidden')
        }
      }

      // TODO: change to
      // mainNav.children().not(backLink).removeClass('js-hidden')
    }

    function showSubnavDesktop () {
      $nav.classList.add('hmrc-subnav-is-open')

      $mainNav.classList.add('hmrc-subnav-is-open')

      $subNav.classList.add('hmrc-subnav-reveal')
      $subNav.setAttribute('aria-hidden', 'false')
      $subNav.setAttribute('aria-expanded', 'true')

      setTimeout(function () {
        $($subNav).focus()
      }, 500)

      $showSubnavLink.classList.add('hmrc-account-menu__link--more-expanded')
      $showSubnavLink.setAttribute('aria-hidden', 'false')
      $showSubnavLink.setAttribute('aria-expanded', 'true')
    }

    function hideSubnavDesktop () {
      $nav.classList.remove('main-nav-is-open', 'hmrc-subnav-is-open')

      $mainNav.classList.remove('hmrc-subnav-is-open')

      $subNav.classList.remove('hmrc-subnav-reveal')
      $subNav.setAttribute('aria-hidden', 'true')
      $subNav.setAttribute('aria-expanded', 'false')

      $showSubnavLink.classList.remove('hmrc-account-menu__link--more-expanded')
      $showSubnavLink.setAttribute('aria-hidden', 'true')
      $showSubnavLink.setAttribute('aria-expanded', 'false')
    }

    function isSmall (element) {
      return ($(element).width() <= 768)
    }

    return {
      'init': init,
      'onresize': resizeHandler
    }
  })(global)

  global.HMRC = HMRC

  window.addEventListener('resize', HMRC.accountMenu.onresize)
})(window)

// initialize
window.HMRC.accountMenu.init()
