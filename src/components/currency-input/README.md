# Currency Input

This macro generates an `<input>` and `<label>`.

## Variables

```
name
id
label
hint
value
error
maxlength
classes
```

## Descriptions of variables

| Name          | Description                                                   |
| ------------- |---------------------------------------------------------------|
| name          | sets the name of the input                                    |
| id            | sets the id of the input, and the for of the label            |
| label         | sets the text of the label                                    |
| hint          | sets hint text within the label                               |
| value         | sets the value of the input                                   |
| error         | sets the error message                                        |
| maxlength     | sets the max length of the input                              |
| classes       | object used for styling elements                              |

With hint, error and maxlength if the values are empty, then they are not displayed in the render.

## Classes

You can add various styles to the elements within the macro.

| Name          | Description                                                   |
| ------------- |---------------------------------------------------------------|
| label         | this overrides the form-label-bold                            |
| input         | adds addtional classes to the input                           |

These are supplied as a string i.e `{label: 'form-label', input: 'new-class new-class-two'}`.

### License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").
