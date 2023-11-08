# Accessible Autocomplete

This macro takes a `<select>` and uses progressive enhancement, provided by the govuk accessible-autocomplete enhanceSelectElement function.
It also supports a `<label>` with hint and error message support for the `<select>`

The enhanceSelectElement will transform the `<select>` into an `<input>` with full accessibility support.

See [here](https://www.npmjs.com/package/accessible-autocomplete) for more information on the underlying accessible autocomplete component.

## Data attributes for the select element

### data-module
Should always be set to value `hmrc-accessible-autocomplete` for this component to find the select and apply the `enhanceSelectElement` function to it.

### data-default-value
Type: String

Specify a value with which to prefill the autocomplete input.

### data-auto-select
Type: Boolean

Set to true to highlight the first option when the user types in something and receives results. Pressing enter will select it.

### data-show-all-values
Type: Boolean

Set to true to show all values when the user clicks the input.
This is similar to a default dropdown, so the autocomplete is rendered with a dropdown arrow to convey this behaviour.

### data-min-length
Type: Int

The number of characters the user must enter before any matches are shown.
Defaults to zero.

### data-language
Type: String

By default, English content for various states (eg. "No search results") is provided by the underlying accessible-autocomplete component.
By setting this attribute to `cy`, the component will use the corresponding Welsh content.

## Example select input

```
<select id="location-picker" data-show-all-values="false" data-auto-select="false" data-default-value="" data-module="hmrc-accessible-autocomplete">
  <option value="fr">France</option>
  <option value="de">Germany</option>
  <option value="gb">United Kingdom</option>
</select>
```

## License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
