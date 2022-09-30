# Accessible Autocomplete

This macro takes a `<select>` and uses progressive enhancement, provided by the govuk accessible-autocomplete enhanceSelectElement function.
It also supports a `<label>` with hint and error message support for the `<select>`

The enhanceSelectElement will transform the `<select>` into an `<input>` with full accessibility support.

## Parameters

```
select
id
hint
errorMessage
describedBy
```

## Parameters for the select input

Look [here](https://www.npmjs.com/package/accessible-autocomplete) for more information on the attributes for the accessible autocomplete component.

## id
Should be the same as the id for this component

## data-default-value
Type: string

Specify a string to prefill the autocomplete with.

## data-auto-select
Type: Boolean

Set to true to highlight the first option when the user types in something and receives results. Pressing enter will select it.

## data-show-all-values
Type: Boolean

If this is set to true, all values are shown when the user clicks the input. This is similar to a default dropdown, so the autocomplete is rendered with a dropdown arrow to convey this behaviour.

## data-module
Should always be set to value `hmrc-accessible-autocomplete` for this component to find the select and apply the enhanceSelectElement function to it.

### Data attributes for the select element
```
id
data-default-value=""
data-auto-select="false"
data-show-all-values="false"
data-module="hmrc-accessible-autocomplete"
```

### Example select input

```
<select id="location-picker" data-show-all-values="false" data-auto-select="false" data-default-value="" data-module="hmrc-accessible-autocomplete">
  <option value="fr">France</option>
  <option value="de">Germany</option>
  <option value="gb">United Kingdom</option>
</select>
```

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
