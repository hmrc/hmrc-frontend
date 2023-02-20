# Header

## Installation

See the [main README quick start guide](https://github.com/alphagov/govuk-frontend#quick-start) for how to install this component.

## Guidance and Examples

Find out when to use the header component in your service in the [GOV.UK Design System](https://design-system.service.gov.uk/components/header).

## Component options

Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.

See [options table](https://design-system.service.gov.uk/components/header/#options-example-default) for details.

### Decision Log

* **2019-01-28** In order to simplify the use and maintenance of HMRC header variants we have combined the HMRC specific variants into a single Nunjucks Macro. This macro will display the variant with a sign out link when the parameter object contains a `signOutHref` value. If no `signOutHref` value is present but a `languageToggle` parameter is present then a language selector is present instead. The variation with a language selector is intended to be used alongside the HMRC Account Menu component.

  * Other options considered
    * We considered and discounted maintaining a different macro for the two major variations of the Header.
