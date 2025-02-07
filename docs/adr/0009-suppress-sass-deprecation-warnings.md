# Suppress SASS deprecation warnings

* Status: accepted
* Deciders: PlatUI
* Date: 2025-02-06

## Context and Problem Statement

Whenever a deprecation warning pops up for sass, it can take up a lot of room in the console.

## Decision Drivers

* Reduce the noise in the console when using our library
* Free up devs to be able to easier see when there's a more critical error

## Considered Options

* Fix the deprecation warnings by using non-deprecated functions
* Suppress deprecation warnings and try to tidy them up where possible
* Do nothing

## Decision Outcome

Chosen option: Suppress deprecation warnings and try to tidy them up where possible, because fixing the deprecation warnings by using non-deprecated functions may behave differently between sass compilers. We use dartsass, some may be using libsass.

### Positive Consequences

* Less noise in the console leads to an easier time to debug any other issues

### Negative Consequences 

* Adding deprecation suppression can lead to issues when the deprecated feature is removed in a future release
