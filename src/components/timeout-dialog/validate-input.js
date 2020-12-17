function ValidateInput() {
}

ValidateInput.int = (stringToValidate) => {
  const parsedInt = parseInt(stringToValidate, 10);
  return Number.isNaN(parsedInt) ? undefined : parsedInt;
};

ValidateInput.string = (stringToValidate) => stringToValidate && ((`${stringToValidate}`) || undefined);

export default ValidateInput;
