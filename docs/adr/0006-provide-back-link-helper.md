# Provide a common back link helper

* Status: accepted
* Deciders: platui
* Date: 2022-09-21
* Components: [back-link-helper](/src/components/back-link-helper)

## Context and Problem Statement

A recurring question to PlatUI from service teams was how to implement a Back link without providing an explicit URL.

We have seen various teams solve this problem either by cutting and pasting a couple of Javascript (JS) snippets into their service
and loading these as additional scripts on each page, or by including inline JS that achieves the same effect.

## Decision Drivers

* Teams continue to approach us for a solution, and we continue to point them at examples in other services
* Teams have to copy and paste JS code into their service and ensure it is loaded correctly, or add inline JS
* Proliferation of custom JS increases technical debt - if the implementation had to change then many services would need to manually update
* Existence of inline JS may hamper adoption of stricter Content Security Policies across services

## Considered Options

* Do nothing, and continue to point teams at existing solutions
* Create a common JS helper that teams can opt in to

## Decision Outcome

Chosen option: "Create a common JS helper that teams can opt in to",
because it provides a centrally-maintained solution.

### Positive Consequences

* Teams have a canonical, tested solution that works by adding a single attribute
* Teams don't need to copy/paste JS code into their service, or add inline scripts
* The implementation can be centrally maintained, e.g. to cope with future browser API changes
* Teams that are already using custom JS can, in time, remove it and use the new helper
* The attack surface area of custom JS and inline scripts is reduced

### Negative Consequences

* Additional JS packaged and loaded for services that may not need it
* By adding into the library, we are providing a tacit approval of using the Javascript back functionality,
rather than encouraging teams to bind a bespoke URL within their service, which slightly negates the point of a back button
