# Extract list-with-actions component from add-to-a-list pattern

* Status: accepted
* Deciders: platui, design resources, dias
* Raised: 2021-06-22
* Decided: 2021-07-01
* Components: add-to-a-list, list-with-actions

Technical Story: PLATUI-1212

## Context and Problem Statement

Feedback from service teams that sometimes they need to do things like enforce business rules around the ability to add 
new items when using the add-to-a-list pattern; or to vary the actions for items where currently you are required to 
have both a "change" and a "remove" link; and to be able to add more content for the user, for example after the heading.

## Considered Options

* Extract a list-with-actions component from the add-to-a-list pattern
* Change the API of add-to-a-list to be more flexible based on feedback

## Decision Outcome

Consensus is to extract a list-with-actions component from the add-to-a-list pattern, implemented flexibly so that it
can be potentially used as part of other patterns. We discussed that the original intention of the add-to-a-list pattern
was that it would be more of a suggested composition of components for a common use case (a pattern in the GDS sense)
and not itself be a single component. In the future we may look to deprecate the add-to-a-list component
implementations.

## Pros and Cons of the Options

### Option 1: extract a list-with-actions component from the add-to-a-list pattern

The add-to-a-list pattern is composed of a title, a list with actions, and a form with a radio button group. Currently
the list with actions part of the pattern is implemented inline. This option would extract that inner implementation
into a component of its own that add-to-a-list would then use internally.

* Good, because it makes it possible to compose a variation of this pattern without having to reimplement the parts not 
  being changed
* Good, because we give teams the flexibility to experiment and test changes to this pattern which we can benefit from
* Good, because the list-with-actions component could be useful in other patterns
* Good, because we don't have to change the API for the add-to-a-list component so it's simpler to implement and won't 
  break any existing usages (though not sure there are many)
* Good, because we have more control to change this part of the pattern in the future
* Bad, because we have less control to change the overall pattern in the future if people compose it themselves

### Option 2: change the API of add-to-a-list to be more flexible

Context and problem statement has some examples of changes based on feedback that we've received. To support the changes
we'd have to make some values optional and add some new options.

* Good, because we have more control to change the overall pattern in the future
* Good, because it would be less work for teams to implement these variations (if we have covered their use case)
* Bad, because we haven't got evidence supporting some of these variations of the pattern yet
* Bad, because if their use case wasn't supported then teams might have to reimplement the component if they needed a 
  new variation on a tight deadline

## Links

* [Discussion thread for add-to-a-list pattern](https://github.com/hmrc/design-patterns/issues/31)
* [Documentation for add-to-a-list pattern](https://design.tax.service.gov.uk/hmrc-design-patterns/add-to-a-list/)