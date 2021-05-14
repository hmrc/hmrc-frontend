# HMRC Account Menu

The HMRC account menu is a component used by personal tax account services. This
version is based on an earlier version implemented in govuk-template and assets-frontend.

## Basic functionality

- if the viewport is small, show the extra menu link (showNavLinkMobile)
- if showNavLinkMobile is triggered, open the main nav (subNav)
- if menusSub is open, add `is-open` to the nav container (nav)
- if a menu link (accountLink) is triggered, close sub-nav (subNav)
- if a menu link with sub-nav (showSubnavLink) is triggered, open it
- if a sub-nav is open, add `is-open` to nav
- if showNavLinkMobile is open, close it when triggered
- if a menu link with sub-nav (showSubnavLink) is open, close it when triggered

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").

## Accessibility features

The 'Your account' menu button uses the `aria-owns` to indicate the relationship between the 
menu button and the sub navigation, the `aria-haspop` to indicate the element triggers the visibility
of the sub navigation, and `aria-expanded` to indicate the expanded or collapsed status of the sub
navigation.

In accessibility testing by DAC, three issues were found with a previous version of the account menu
under WCAG 2.1 Success Criterion 4.1.2 Name, Role, Value (Level A):

1. The 'Your account' link lost focus once selected. This meant "keyboard-only 
   users are unable to close the expanded link initially. It is only when 
   navigating back to the link can users close it.".

   This was caused by Javascript focusing on the sub navigation.
   
1. Following the shift in focus, "the entire contents within the link is 
   conveyed back to screen reader users. Links such as 'Manage your paperless settings'
   and 'Manage your personal details' also announce to the user as being expanded.".

   This was caused by the aria-expanded attribute being
   set to true on the sub navigation as well as the link that initiated the
   opening of the sub navigation.
   
1. "Ensuring that the Design System is followed, in that the link is replaced with a button"

These issues were corrected by replacing the links with standard buttons, removing the focusing code,
and removing the extraneous aria-expanded attributes from the sub navigations themselves.

The latest version of the account menu is based on advice from:
https://www.accessibility-developer-guide.com/examples/widgets/dropdown/

## Notes

The changes made to fix the above accessibility issues do conflict with some published advice
around focusing.

1. On the ARIA best practices section of the W3 website, the menu button [section](https://www.w3.org/TR/wai-aria-practices/#menubutton)
   suggests the button "opens the menu and places focus on the first menu item."

1. On the [Accessibility Guidelines Working Group](https://www.w3.org/WAI/GL/wiki/Main_Page) wiki, 
   there is an [example](https://www.w3.org/WAI/GL/wiki/Using_the_WAI-ARIA_aria-expanded_state_to_mark_expandable_and_collapsible_regions)
   that demonstrates focusing on expanded content.

The removal of the 'Your account' link on mobile was causing issues on iOS voiceover in shifting focus to 'Personal details'

Removed focusout

## References

* [aria-expanded](https://www.w3.org/TR/wai-aria-1.1/#aria-expanded)
* [aria-owns](https://www.w3.org/TR/wai-aria-1.1/#aria-owns)
* [aria-haspopup](https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup)
