# Investigating linters that could be used instead of eslint

* Status: accepted
* Deciders: PlatUI Devs + Design Resources
* Date: 2026-10-20
* Components: N/A,

Technical Story: [PLATUI-4472](https://jira.tools.tax.service.gov.uk/browse/PLATUI-4472)

## Context and Problem Statement

We wanted to take a look at upgrading ESLint to the newer version as the version used within `hmrc-frontend` was `v8.x.x`.
The newest ESLint is version 10. We tried bumping the version to the `v9.x.x` and then to `v10.x.x`, but
one of the dependencies that is used by `eslint` (`eslint-config-airbnb-base`) does not support those versions.
Last supported version is `v8.x.x.` `eslint-config-airbnb-base` is providing the list of rules for doing the checks
within the codebase.

Additionally, within `hmrc-frontend` we have `standard` dependency which is not really used, but pulls `eslint`.
This dependency can be removed either way, but without getting rid of `eslint`, we won't reduce that huge amount of dependencies.

## Decision Drivers

* `eslint` upgrade to the newest version blocked by `eslint-config-airbnb-base` compatibility
* `eslint` + other required plugins are pulling a huge amount of dependencies
* there are faster options

## Considered Options

* Upgrade `eslint` and lose `eslint-config-airbnb-base`
* Keep `v8.x.x` for `eslint` to be able to keep `eslint-config-airbnb-base`
* Switch to `oxlint`
* Consider other options e.g. `biome`

## Decision Outcome

Chosen option: "Switch to `oxlint`", because it's fast and reliable option which does not pull a huge amount of dependencies.
With `oxlint` we are able to almost reproduce the previous settings used with `eslint`

### Positive Consequences

* Amount of pulled dependencies reduced drastically
* Linting is so much faster
* `eslint` version we have is deprecated and blocked from being upgraded due to other dependencies

### Negative Consequences

* There are few rules that were in the previous configuration that we cannot reproduce in `oxlint`

## Pros and Cons of the Options

### Upgrade `eslint` and lose `eslint-config-airbnb-base`

`eslint-config-airbnb-base` does not support eslint `v9` or `v10`, so we need to drop it to be able to upgrade `eslint`

* Good, because we use the newer/newest version of `eslint`
* Bad, because we lose most of the rules or we need to add them manually
* Bad, because `eslint` pulls a huge amount of dependencies

### Keep `v8.x.x` for `eslint` to be able to keep `eslint-config-airbnb-base`

It's a valid option to do not do anything. This approach allows us to keep using the `eslint-config-airbnb-base`.

* Good, because we keep linter rules that we have in application
* Good, because no work is required
* Bad, because we cannot use the newest version of `eslint`

### Switch to `oxlint`

`Oxlint` is Rust based linter which is very fast and have possibility of reproducing the previous rules almost one to one.
The similar rules are coming from `oxlint-config-presets`.

`Oxlint` comparing to eslint pulls a small amount of dependencies and is so much faster achieving similar effect.
Additionally, switching to `oxlint` with configuration close to what we had with eslint flagged a few problems that
sounds like a valid things to consider and fix.

* Good, because we reduce amount of dependencies pulled by `hmrc-frontend`
* Good, because it's very fast linter
* Good, because we can almost reproduce the rules from `eslint`
* Bad, because there are few rules that we had in `eslint`, but are not supported in `oxlint`

### Consider other options e.g. `biome`

`biome` linter has been considered, but following that we are coming from `eslint`, the `oxlint` was recommended instead
of `biome` as it's easier to be able to reproduce the rules.

There are other linters, but we didn't investigate any others. Most of the linters except the `oxlint` required much more
changes to be able to reproduce the current configuration.

## Links
Below you can find npm graphs links for existing configuration and proposed configuration, so you can see
the change in the amount of dependencies.

Current dependencies:
[eslint](https://npmgraph.js.org/?q=eslint)
[eslint-config-airbnb-base](https://npmgraph.js.org/?q=eslint-config-airbnb-base)
[eslint-plugin-import](https://npmgraph.js.org/?q=eslint-plugin-import)
[standard](https://npmgraph.js.org/?q=standard)

Proposed oxlint solution:
[oxlint](https://npmgraph.js.org/?q=oxlint)
[oxlint-config-presets](https://npmgraph.js.org/?q=oxlint-config-presets)
