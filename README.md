# HMRC Frontend

HMRC Frontend contains the code and documentation for design patterns used to build digital services for HMRC.

See live examples of HMRC Frontend patterns and guidance on when to use them in your service, in HMRC Design Patterns.

HMRC Frontend provides code for additional patterns designed specifically for HMRC, on top of those in [GOV.UK Frontend](govuk-frontend). 

## Quick Start

### Requirements

* [Node.js](https://nodejs.org/en/) `>= 10.12.0`
* [npm](https://www.npmjs.com/) `>= 6.4.1`

To install multiple versions of Node.js, you may find it easier to use a node version manager:

* [nvm](https://github.com/creationix/nvm)
* [n](https://github.com/tj/n)

### Installation

Clone this repository and install its dependencies:

```bash
git clone https://github.com/hmrc/hmrc-frontend.git
cd hmrc-frontend
npm install
```

### Running

1. Run `npm start`
2. Components are available at the following urls:

| component | url |
|-----------|-----|
| Notification badge | |
| Personal tax account menu  |[http://localhost:3000/components/account-menu/default/preview](http://localhost:3000/components/account-menu/default/preview) |

## Using HMRC Frontend

### Locally

#### Installation into Prototype Kit

To use this preview:

1. Clone the "extensions" version of the prototype kit `git clone -b extensions git@github.com:hmrc/govuk_prototype_kit.git`
2. `cd govuk_prototype_kit`
3. Install the preview of hmrc-frontend `npm install --save https://github.com/hmrc/hmrc-frontend.git#package-latest`
4. Install everything else `npm install`
5. `npm start`

Now you can set up views which use `hmrc-frontend` like this one using the account menu:

```nunjucks
{% from 'account-menu/macro.njk' import hmrcAccountMenu %}
{% extends 'layout.html' %}

{% block content %}
<main id="content">
  {{ hmrcAccountMenu() }}
</main>
{% endblock %}
```
We have a pull request open for GOVUK's prototype kit which will allow `hmrc-frontend` (and other department's frontends) to be used easily with the prototype kit https://github.com/alphagov/govuk-prototype-kit/pull/613

### Frontend microservices

Currently unsupported

### In production services

Currently unsupported

## HMRC Design Patterns

HMRC Design Patterns is available, currently in prototype form, for designers and developers working within HMRC.

## Contributing

### Design Patterns

If you need a pattern that does not appear in the HMRC Design Patterns, you can [contribute a new one](https://github.com/hmrc/assets-frontend/wiki/HMRC-Design-System#contributing-a-design-pattern).

### Features and issues

If you would like to propose a feature or flag up an issue in HMRC Frontend, please create an issue. 

You can also contribute to HMRC Frontend by submitting a pull request. Review our [contribution process and guidelines for HMRC Frontend](CONTRIBUTING.md) before you submit your request.

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
