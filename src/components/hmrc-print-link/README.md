# HMRC Print Link

> **Warning**
> The hmrc-print-link data module attribute will only work for links, if you try add it to a button you may have unexpected behaviour.


When triggered through the attribute `data-module="hmrc-print-link"`, 
this action associates a click event with a link, initiating a window.print() command that prompts the browser to display the print dialog.

We've added this because a lot of services had implemented print links using inline javascript in html attributes that isn't compatible with some new default CSP security config that is recommended for HMRC services. Rather that everyone move the JS to different places / possibly introduce mistakes - this gives us something people can migrate to a bit more easily, and we now have people depending on an interface we can tweak later in one place in the remote chance we need.

There is one caveat and that is the link will not be hidden automatically if javascript is disabled, if you wish to hide it you can add the `hmrc-!-js-visible` class.