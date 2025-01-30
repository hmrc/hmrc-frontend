# sca-wrapper Account Menu

The library [sca-wrapper](https://github.com/hmrc/sca-wrapper) contains a PTA implementation of a menu bar that uses
styles from `hmrc-account-menu`. These examples add basic visual regression tests for a manually added copy of the
`PtaMenuBar.scala.html`.

The purpose of this example and visual regression test is to try to spot changes in `hmrc-frontend` which would break
`sca-wrapper` downstream. The `PtaMenuBar.scala.html` should be regularly checked for updates to ensure the code in
`template.njk` still reflects `PtaMenuBar.scala.html`.

**If the visual regression test for sca-wrapper-menu breaks or causes an update to the reference images, PlatUI should
liaise with maintainers of [sca-wrapper](https://github.com/hmrc/sca-wrapper).**
