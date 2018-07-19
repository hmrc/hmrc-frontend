# Notification badge

## Introduction

A button is an element that allows users to carry out an action on a GOV.UK page. Common use cases include allowing a user to **Start** an application or **Save and continue** their progress. A button should have a short text snippet that describes what it will do.

## Guidance

Find out when to use the Notification badge component in your service in the [GOV.UK Design System](https://govuk-design-system-production.cloudapps.digital/components/notification-badge).

## Quick start examples

Buttons are configured to perform an action and they can have a different look. For example, they can be disabled until a valid action has been performed by the user.

### Component default

[Preview the notification-badge component](http://govuk-frontend-review.herokuapp.com/components/notification-badge/preview)

#### Markup

    <span class="hmrc-notification-badge">3</span>

#### Macro

    {% from 'notification-badge/macro.njk' import govukNotificationBadge %}

    {{ govukNotificationBadge({
      "badgeText": 3
    }) }}

### Notification-badge--with-text

[Preview the notification-badge--with-text example](http://govuk-frontend-review.herokuapp.com/components/notification-badge/with-text/preview)

#### Markup

    <span class="hmrc-notification-badge">New</span>

#### Macro

    {% from 'notification-badge/macro.njk' import govukNotificationBadge %}

    {{ govukNotificationBadge({
      "badgeText": "New"
    }) }}

## Requirements

### Build tool configuration

When compiling the Sass files you'll need to define includePaths to reference the node_modules directory. Below is a sample configuration using gulp

    .pipe(sass({
      includePaths: 'node_modules/'
    }))

### Static asset path configuration

In order to include the images used in the components, you need to configure your app to show these assets. Below is a sample configuration using Express js:

    app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')))

## Component arguments

If you are using Nunjucks,then macros take the following arguments

<table class="govuk-table">

<thead class="govuk-table__head">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="col">Name</th>

<th class="govuk-table__header" scope="col">Type</th>

<th class="govuk-table__header" scope="col">Required</th>

<th class="govuk-table__header" scope="col">Description</th>

</tr>

</thead>

<tbody class="govuk-table__body">

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">element</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether to use an `input`, `button` or `a` element to create the button. In most cases you will not need to set this as it will be configured automatically if you use `href` or `html`.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">text (or) html</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Text or HTML for the button or link. If `html` is provided, the `text` argument will be ignored and `element` will be automatically set to `button` unless `href` is also set, or it has already been defined. This argument has no effect if `element` is set to `input`.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">name</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Name for the `input` or `button`. This has no effect on `a` elements.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">type</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Type of `input` or `button` – `button`, `submit` or `reset`. Defaults to `submit`. This has no effect on `a` elements.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">value</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">Yes</td>

<td class="govuk-table__cell ">Value for the `button` tag. This has no effect on `a` or `input` elements.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">disabled</th>

<td class="govuk-table__cell ">boolean</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Whether the button should be disabled. For button and input elements, `disabled` and `aria-disabled` attributes will be set automatically.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">href</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">The URL that the button should link to. If this is set, `element` will be automatically set to `a` if it has not already been defined.</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">classes</th>

<td class="govuk-table__cell ">string</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Optional additional classes</td>

</tr>

<tr class="govuk-table__row">

<th class="govuk-table__header" scope="row">attributes</th>

<td class="govuk-table__cell ">object</td>

<td class="govuk-table__cell ">No</td>

<td class="govuk-table__cell ">Any extra HTML attributes (for example data attributes) to add to the button component.</td>

</tr>

</tbody>

</table>

### Setting up Nunjucks views and paths

Below is an example setup using express configure views:

    nunjucks.configure('node_modules/govuk-frontend/components', {
      autoescape: true,
      cache: false,
      express: app
    })

## Contribution

Guidelines can be found at [on our Github repository.](https://github.com/alphagov/govuk-frontend/blob/master/CONTRIBUTING.md "link to contributing guidelines on our github repository")

## License

MIT
