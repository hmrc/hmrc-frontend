# Supply un-compiled Javascript in NPM package

* Status: accepted
* Date: 2021-07-09

Technical Story: https://github.com/hmrc/hmrc-frontend/issues/96

## Context and Problem Statement

We have received requests from external consumers for providing the Javascript modules
for our frontend components in an un-compiled form. 

Currently, the js:compile-hmrc Gulp task rolls up not just `all.js` but every
single Javascript module, even though it's not intended that these individual modules are
used independently in SCRIPT tags.

Providing the modules in their raw form would provide greater flexibility
for consumers to compile, bundle, tree-shake and minify as they see fit, rather than being forced
to use the all.js bundle.

As such, should we provide all but all.js in an un-compiled form?

## Decision Drivers

* We have only ever documented the inclusion of the `all.js` bundle
  in frontend microservices.
* It is not possible to include the individually rolled up modules in SCRIPT tags because each
  module exports the same `HMRCFrontend` window object, that would overwrite each other.
* The GOV.UK prototype kit's extension framework only generates SCRIPT tags for `all.js` and `init-all.js` as per
  the [configuration](src/govuk-prototype-kit.config.json). Therefore, this change would not affect
  prototypes.
* Providing un-compiled Javascript for components is consistent with how we supply the 
  corresponding Sass modules.

## Considered Options

* Option 1: Do nothing
* Option 2: Stop compiling all but the `all.js` Javascript modules, provide un-compiled instead.

## Decision Outcome

Chosen option: Option 2, to realise the benefits stated below with a major version increment due to the potential risk of 
breaking consumers using hmrc-frontend in non-standard ways.

### Positive Consequences

* hmrc-frontend build is simpler and does not perform unnecessary steps.
* hmrc-frontend is more internally consistent.
* Consumers of hmrc-frontend have more flexibility around optimising and bundling
the required Javascript assets.

### Negative Consequences

* Potential risk of breaking consumers bundling Javascript without babel. We are only aware of one
external consumer and this change was specifically requested by a developer working with this organisation. 
  NPM reports no other packages depending on [hmrc-frontend](https://www.npmjs.com/package/hmrc-frontend). An analysis
  in [GitHub](https://github.com/hmrc/hmrc-frontend/network/dependents)
  showed usages to be either:
  * in GOV.UK prototypes
  * owned by the organisation associated with the original requester or
  * not importing individual modules

## Links

* [Issue reported on GitHub](https://github.com/hmrc/hmrc-frontend/issues/96)

