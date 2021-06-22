# Change API of add-to-a-list form

* Status: accepted
* Deciders: platui, design resources
* Raised: 2021-06-22
* Decided: 2021-07-01
* Components: add-to-a-list

Technical Story: PLATUI-1212

## Context and Problem Statement

The radio buttons in add-to-a-list are using the translated strings `messages.yes` and `messages.no` for their value.
This means when the form is submitted the handler services must understand and respond correctly to both "Yes/No" and 
"Iawn/Na". For teams this may be easy to forget and miss from test coverage. Maintainers of the implementation may also 
not realise that changing the translation could break handling of the submitted form for services using this pattern.

Code example from nunjucks implementation:
```
  ...
  {{ govukRadios({
    classes: "govuk-radios--inline",
    idPrefix: "add-another",
    name: "add-another",
    fieldset: {
      legend: {
        text:  messages.addAnother.prefix + " " + params.itemType.singular | default(messages.itemTypeDefault.singular) + messages.addAnother.suffix + "?",
        isPageHeading: false,
        classes: "govuk-fieldset__legend govuk-fieldset__legend--m"
      }
    },
    hint: {
      text: params.hintText
    },
    items: [
      { text: messages.yes, value: messages.yes },
      { text: messages.no, value: messages.no }
    ] }) }}
    ...
```

Taken from: https://github.com/hmrc/hmrc-frontend/blob/ed7d1b99009f3e032ec6553bdc6d518b4d1a66f8/src/components/add-to-a-list/template.njk#L82-L83

## Decision Drivers

* we want to have a stable predictable interface for implementers to work to
* reduce chance that the consequences of changes can be missed

## Considered Options

* Option 1: do nothing
* Option 2: change to "true" and "false"
* Option 3: change to "Yes" and "No" (capitalized)

## Decision Outcome

Consensus was to go with option 2 or 3, that this would reduce the work for service teams to use this pattern. There 
wasn't much preference over what the actual values ended up being, and this decision is less important given the choice
made at the same time to extract a list-with-actions component which will allow teams to compose the pattern themselves. 
So we can defer a final choice until the ticket for this change is implemented.

## Pros and Cons of the Options

### Option 1

* Good, we're not breaking any existing usages
* Bad, we're leaving teams exposed to risk that we could avoid, which might undermine teams confidence in the tools

### Option 2

* Good, because it is based on feedback from a user of this pattern
* Good, because it's easy to map to a boolean with scala forms (no possibility for mistakes comparing special strings)
* Bad, because if we wanted to ever introduce another option it would complicate mapping (for example "yes/no/later")
* Bad, because it will require existing form handlers to be updated

### Option 3

* Good, because it might make it easier to add extra optional choices later (yes/no/later)
* Good, because it's (almost) not a breaking change (wouldn't break so long as a service has implemented their handler 
  to allow "Yes/No" regardless of users language preference)
* Bad, because it's possibly less convenient to map into a scala form than a boolean

## Links

* [Discussion thread for add-to-a-list pattern](https://github.com/hmrc/design-patterns/issues/31)
* [Documentation for add-to-a-list pattern](https://design.tax.service.gov.uk/hmrc-design-patterns/add-to-a-list/)