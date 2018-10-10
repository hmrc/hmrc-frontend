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
    var nav = $('.hmrc-account-menu')
    var mainNav = $('.hmrc-account-menu__main')
    var subNav = $('.hmrc-subnav')
    var showSubnavLink = $('#account-menu__main-2')
    var showNavLinkMobile = $('.hmrc-account-menu__link--menu')
    var backLink = $('.hmrc-account-menu__link--back a')

    subNav.attr({
      'aria-hidden': 'true',
      'tabindex': -1
    })

    showSubnavLink.attr({
      'aria-controls': $(this).hash,
      'aria-expanded': 'false'
    })

    showSubnavLink.on({
      click: function (e) {
        if (isSmall(global)) {
          // TODO: remove redundant check - showSubnavLink appears only when subnav is not expanded
          if (!$(this).hasClass('hmrc-account-menu__link--more-expanded')) {
            hideMainNavMobile($(this))
            showSubnavMobile($(this))
          }
        } else {
          if ($(this).hasClass('hmrc-account-menu__link--more-expanded')) {
            hideSubnavDesktop()
          } else {
            showSubnavDesktop()
          }
        }

        e.preventDefault()
        e.stopPropagation()
      },

      focusout: function () {
        if (!isSmall(global)) {
          $(this.hash).data('subMenuTimer', setTimeout(0))
        }
      },

      focusin: function () {
        if (!isSmall(global)) {
          clearTimeout($(this.hash).data('subMenuTimer'))
        }
      }
    })

    backLink.on('click', function (e) {
      // TODO: remove redundant check - backlink appears only when subnav is open
      if (mainNav.hasClass('hmrc-subnav-is-open')) {
        hideSubnavMobile()
        showMainNavMobile()
      }

      e.preventDefault()
    })

    subNav.on({
      focusout: function () {
        if (!isSmall(global)) {
          $(this).data('subMenuTimer', setTimeout(function () {
            hideSubnavDesktop()
          }, 0))
        }
      },

      focusin: function () {
        clearTimeout($(this).data('subMenuTimer'))
      }
    })

    showNavLinkMobile.on('click', function (e) {
      if (isSmall(global)) {
        if (mainNav.hasClass('hmrc-subnav-is-open') || mainNav.hasClass('main-nav-is-open')) {
          hideSubnavMobile()
          hideMainNavMobile($(this))
        } else {
          showMainNavMobile()
        }

        e.preventDefault()
      }
    })

    function init () {
      if (isSmall(global)) {
        nav.addClass('is-smaller')
        showNavLinkMobile
          .attr('aria-hidden', 'false')
          .removeClass('js-hidden')
        hideSubnavMobile()
        hideMainNavMobile(showNavLinkMobile)
      } else {
        nav.removeClass('is-smaller')
        showNavLinkMobile
          .attr('aria-hidden', 'true')
          .addClass('js-hidden')
        mainNav
          .removeClass('main-nav-is-open')
          .removeClass('js-hidden')
        subNav.removeClass('js-hidden')
      }
    }

    var resizeHandler = debounce(init, 250)

    function showMainNavMobile () {
      // TODO: shall we add main-nav-is-open to `nav`????
      mainNav
        .addClass('main-nav-is-open')
        .removeClass('js-hidden')
        .attr('aria-expanded', 'true')

      showNavLinkMobile
        .attr('aria-expanded', 'true')
        .addClass('hmrc-account-home--account--is-open')
    }

    function hideMainNavMobile (e) {
      mainNav
        .removeClass('main-nav-is-open')
        .attr('aria-expanded', 'false')

      if (e.hasClass('hmrc-account-menu__link--menu')) {
        mainNav
          .removeClass('hmrc-subnav-is-open')
          .addClass('js-hidden')

        showNavLinkMobile
          .attr('aria-expanded', 'false')
          .removeClass('hmrc-account-home--account--is-open')
      } else if (e.hasClass('hmrc-account-menu__link--more')) {
        mainNav
          .addClass('hmrc-subnav-is-open')
      }
    }

    function showSubnavMobile (e) {
      nav
        .addClass('hmrc-subnav-is-open')

      mainNav
        .removeClass('main-nav-is-open')
        .addClass('hmrc-subnav-is-open')

      subNav
        .addClass('hmrc-subnav-reveal')
        .attr({
          'aria-hidden': 'false',
          'aria-expanded': 'true'
        })

      showSubnavLink
        .addClass('hmrc-account-menu__link--more-expanded')
        .attr({
          'aria-hidden': 'false',
          'aria-expanded': 'true'
        })

      backLink.parent()
        .attr('aria-hidden', 'false')
        .removeClass('hidden')

      e.closest('li').addClass('active-subnav-parent')

      subNav.removeClass('js-hidden')

      e.parent().siblings().not(backLink.parent()).addClass('hidden')
    }

    function hideSubnavMobile () {
      nav
        .removeClass('hmrc-subnav-is-open')

      mainNav
        .addClass('main-nav-is-open')
        .removeClass('hmrc-subnav-is-open')

      subNav
        .removeClass('hmrc-subnav-reveal')
        .attr({
          'aria-hidden': 'true',
          'aria-expanded': 'false'
        })

      showSubnavLink
        .removeClass('hmrc-account-menu__link--more-expanded')
        .attr({
          'aria-hidden': 'true',
          'aria-expanded': 'false'
        })

      backLink.parent()
        .attr('aria-hidden', 'true')
        .addClass('hidden')

      showSubnavLink.closest('li').removeClass('active-subnav-parent')

      subNav.addClass('js-hidden')

      backLink.parent().siblings().not(backLink.parent()).removeClass('hidden')
      // TODO: change to
      // mainNav.children().not(backLink).removeClass('js-hidden')
    }

    function showSubnavDesktop () {
      nav
        .addClass('hmrc-subnav-is-open')

      mainNav
        .addClass('hmrc-subnav-is-open')

      subNav
        .addClass('hmrc-subnav-reveal')
        .attr({
          'aria-hidden': 'false',
          'aria-expanded': 'true'
        })
      setTimeout(function () {
        subNav.focus()
      }, 500)

      showSubnavLink
        .addClass('hmrc-account-menu__link--more-expanded')
        .attr({
          'aria-hidden': 'false',
          'aria-expanded': 'true'
        })
    }

    function hideSubnavDesktop () {
      nav
        .removeClass('main-nav-is-open')
        .removeClass('hmrc-subnav-is-open')

      mainNav
        .removeClass('hmrc-subnav-is-open')

      subNav
        .removeClass('hmrc-subnav-reveal')
        .attr({
          'aria-hidden': 'true',
          'aria-expanded': 'false'
        })

      showSubnavLink
        .removeClass('hmrc-account-menu__link--more-expanded')
        .attr({
          'aria-hidden': 'true',
          'aria-expanded': 'false'
        })
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
  $(window).resize(HMRC.accountMenu.onresize)
})(window)
// debugger
// initialize
window.HMRC.accountMenu.init()
