# Utility class to hide stuff when javascript is disabled 

It assumes that you are using the GOV.UK template that adds the js-enabled class to the body element 

If the js-enabled class is not added to the body element of the page with javascript then the element will always be hidden

The elements are hidden using `display: none;` so will not be read aloud by screen readers or navigable by keyboard when hidden