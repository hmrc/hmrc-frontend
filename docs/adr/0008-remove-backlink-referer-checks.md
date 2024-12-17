# Remove Backlink referrer checks

* Status: accepted
* Deciders: PlatUI
* Date: 2024-12-17
* Components: [back-link-helper](/src/components/back-link-helper/)

## Context and Problem Statement

As part of the back link helper, we offered the ability to ensure that the back link won't appear in certain scenarios:
* When the referrer is not on an allow-list
* When there is no referrer

This hasn't been adding much value - and in some cases, has caused issues and confusion. We have taken the decision to remove these checks.

## Decision Drivers

* A link from other government domains cause the back link to not appear.
* The security checks are not used widely by services that use JavaScript to make their back links behave like the browser back button.

## Considered Options

* Keeping the checks in place as the checks were based on another implementation on the platform.
* Removing the checks altogether.

## Decision Outcome

Chosen option: "Removing the checks altogether."

### Positive Consequences

* This reduces any potential issues from other government services linking to our services.
* Simpler user experience.

### Negative Consequences

* Users may be sent back to services and sites not in our domain
