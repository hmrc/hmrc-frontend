# Use better-npm-audit for checking deps for security vulnerabilities

* Status: accepted
* Deciders: platui
* Date: 2022-05-16
* Components: platui maintained nodejs projects

Technical Story: PLATUI-1691

## Context

We need to keep our libraries safe by regularly checking our dependencies for new publicly disclosed vulnerabilities.

We've automated this by periodically running "npm audit" on our nodejs projects. npm audit will compare our list of dependencies against public security disclosure lists and show which of our dependencies contain vulnerabilities.

We review the results of this weekly, and we have a dashboard that shows us an overview of the latest checks that have been run by repository. Any vulnerabilities found cause the repository to be displayed in red on the dashboard.

In our team calendar we have a recurring prompt to review the dashboard and look for failures that need our attention and then try to update our vulnerable dependencies.

Some issues surfaced by npm audit we can't resolve by updating our dependencies. However, we may find that our use case for the dependency isn't one that's impacted by the vulnerability. In that case, although we are still using a vulnerable version, we're safe to keep using it in the current way.

### Problem statement

Over time the number of issues we aren't able to fix has increased, and resulted in our dashboard showing all checks in red all the time. This makes it hard to notice new security vulnerabilities and means we spend time rechecking previous vulnerabilities.

We would like the dashboard entries to not be displayed in red because of known issues that have already been reviewed, so that we can easily see where there are new vulnerabilities and avoid wasting time re-checking the same issues.

## Decision Drivers

* we would like to make a small change, so keep our current process, but improve the mechanism
* we only want to check nodejs dependencies at the moment
* Dependabot does not currently support all our project layouts and languages

## Considered Options

* **Option 1:** do nothing
* **Option 2:** use better-npm-audit
* **Option 3:** review other "software composition analysis" tools
* **Option 4:** re-evaluate using Dependabot from GitHub

## Decision Outcome

We've chosen option 2: use better-npm-audit, because it will be reversible and easy to change in the future, requires minimal work upfront, won't require a change our process much, and resolves our immediate problems.

In the future we might want to re-evaluate using Dependabot.

## Pros and Cons of the Options

### Option 1: do nothing

* Bad, because the work required to migrate to something like better-npm-audit would be small compared to the time lost and risk of missing something by continuing with our current practices

### Option 2: use better-npm-audit

This tool allows us to maintain a list of exceptions in the repository, and optionally to expire the exceptions after a period of time and include a note describing why we've added the exception where we can describe why we think we're not at risk from the vulnerability.

* Good, because it's very close to the workflow of our current npm audit tool and requires few changes to start using
* Good, because we can expire and describe exceptions for specific vulnerabilities
* Bad, because it's maintained by an external individual whereas the built-in npm audit is maintained by npm organisation itself
* Bad, because it just checks node dependencies, we would need something else if we wanted to check other things like our scala dependencies

### Option 3: review other "software composition analysis" tools

For example, owasp-dependency-check is used by some classic services to check their scala dependencies for vulnerabilities

* Good, because we could check all our different types of dependencies with one tool which would allow us to expand our coverage
* Good, because tools from owasp might likely be better supported, have a more assured lifespan, and better supply chain integrity than npm options
* Bad, because this might require significant work to investigate and implement

### Option 4: re-evaluate using Dependabot from GitHub

This is a tool GitHub provides that will check and report potential security problems for you within the GitHub user interface. Previously, we found that not all of our libraries (where some contain more than one language for example) were detected by Dependabot. This gap is what prompted the original custom implementation using npm audit.

Because it has been some time, it may be worth re-evaluating the tool in case the coverage has improved. At this time it still does not support scala, so it would only be an alternative for our nodejs projects. Although we don't rely on it, we do currently have this enabled for the repositories that we can.

* Good, because it's built-in and supported by GitHub so would remove the need for our custom automation to periodically check for vulnerabilities
* Bad, because we would have to change our existing processes
* Bad, because we may still find it's not suitable for our use case and need to have to go with one of the other options as well
