# HMRC Account Header

## Introduction

The account header component is used at the top of HMRC pages where a user is logged in, to help users navigate around their account.

## Prototype Kit Usage

To use the Account header in a view you will need to extend 'hmrc-layout-account-header.html'

```
{% extends 'hmrc-layout-account-header.html' %}

{% set currentLanguage = 'cy' %}

{% block content %}
<main id="content">
  <h1>your content goes here</h1>
  <p>etc.</p>
</main>
{% endblock %}
```
The page will then have a variation of the GOVUK page header which includes a language toggle, and the Account Menu 

### Decision Log

* 2018-01-28
Implemented via a Layout file. `hmrc-layout-account-menu`. This layout file extends the GOVUK default layout file and overrides the _header_ and _main_ blocks.

  * The Header block is overridden to include the HMRC Header variation with a language selector on the right hand side.
    * We have been able to parameterise the `hmrc-header` component to allow a single macro to provide all the necessary variants.

  * The main block is overridden to insert the HMRC Account Menu between the header and the _beforeContent_ block.
    * We have decided to use this method as it seems the least worst option of the methods that we have considered.

  * Other options considered:

    * We aren't using the _beforeContent_ block as we don't know if teams are already using _beforeContent_ with something incompatible.
    * We have discounted the use of the `super()` nunjucks function as we think this may confuse some users.
    * We have considered whether other nunjucks features could allow us to access the child's block content before redefining the block, we couldn't find a way to do this.
