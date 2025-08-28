# Service Navigation Language Select

Choose between Welsh and English.

This component is intended to be passed into the end slot of a Service Navigation component.

A Service Navigation component containing this language select will need to have the class
`.hmrc-service-navigation--with-language-select` added for it to be displayed correctly, if it's not included then the
language select will appear on a separate line.

## Accessibility

This component should not be used at the same time in a user journey or on a page as the Language Select component which
is displayed in the main area of the page. A journey which contains the language select displayed in both positions,
even if only displayed on separate pages, the inconsistent placement of the language select controls will be an
accessibility failure, according to the WCAG 2.2 Consistent Navigation Success Criteria.

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
