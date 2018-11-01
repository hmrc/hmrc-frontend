# HMRC Frontend

[ ![Download](https://api.bintray.com/packages/hmrc/releases/hmrc-frontend/images/download.svg) ](https://bintray.com/hmrc/releases/hmrc-frontend/_latestVersion)

This is a placeholder README.md for a new repository

## Installation into Prototype Kit

To use this preview:

1. Clone the "extensions" version of the prototype kit `git clone -b extensions git@github.com:hmrc/govuk_prototype_kit.git` (this is the subject of a pull request to GOVUK https://github.com/alphagov/govuk-prototype-kit/pull/613)
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
### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
