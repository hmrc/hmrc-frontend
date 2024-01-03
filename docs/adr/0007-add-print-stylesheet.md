# Add print stylesheet

* Status: accepted
* Deciders: PlatUI
* Date: 2024-01-03
* Components: [hmrc-frontend-print-overrides.scss](/src/hmrc-frontend-print-overrides.scss)

## Context and Problem Statement

In August 2022, CSG Forms (formerly known as Print & Post) opened a support issue with PlatUI asking for various parts
of page components to be hidden from print views. This had been flagged as an issue by an internal accessibility audit.

`govuk-frontend` provides a helper class for hiding elements from print views (`govuk-!-display-none-print`). This was 
applied to the Nunjucks for some `hmrc-frontend` components over time. However, there were technical complexities around
adding the same class to `govuk-frontend` components without breaking library parity between `govuk-frontend` and 
`play-fronted-hmrc`. 

## Decision Drivers

* Internal accessibility audits flagged printing links within components
* `govouk-frontend` does provide as helper CSS class to disable printing (`govuk-!-display-none-print`).
* Asking teams to add the class themselves to all components within a service could be extremely time-consuming compared
  to applying via the centralised libraries
* Some components in `govuk-frontend` do not accept classes being passed in as parameters
* Adding classes into `play-frontend-hmrc` only via either Twirl or Scala viewmodels would diverge from `govuk-frontend`
  which has historically caused issues with our testing and upgrade strategy

## Considered Options

* Add `govuk-!-display-none-print` class to `govuk-frontend` components and break parity with `play-frontend-hmrc` (which
  would impact testing and upgrade strategy)
* Add custom CSS class to `hmrc-frontend` via print stylesheet that can be flagged on or off. Class would need to be 
  added to `govuk-frontend` components. See [PLATUI-2642](https://jira.tools.tax.service.gov.uk/browse/PLATUI-2642) 
* Add in print stylesheet that overrides print styling on components and is always included
* Add in print stylesheet that overrides print styling on components and can be configured on or off by service teams

## Decision Outcome

Chosen option: "Add in print stylesheet that overrides print styling on components and is always included"

### Positive Consequences

* It provides a centrally-maintained solution and service developers do not need to write additional code to include
* It would not break parity between the libraries as the style would be computed in the browser

### Negative Consequences

* It does not provide an opt-out option, but if that is required the stylesheet could be removed from
  `all-govuk-and-hmrc.scss` and added as a configurable optional script in `HmrcScripts` in `play-frontend-hmrc`
