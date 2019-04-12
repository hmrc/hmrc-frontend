function ValidateInput ($module) {
}

ValidateInput.int = function (stringToValidate) {
  var parsedInt = parseInt(stringToValidate, 10)
  return isNaN(parsedInt) ? undefined : parsedInt
}

ValidateInput.string = function (stringToValidate) {
  return ('' + stringToValidate) || undefined
}

export default ValidateInput
