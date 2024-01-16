function ValidateInput() {
}

ValidateInput.int = (stringToValidate) => {
  const parsedInt = parseInt(stringToValidate, 10);
  return Number.isNaN(parsedInt) ? undefined : parsedInt;
};

ValidateInput.string = (stringToValidate) => (typeof stringToValidate === 'string' ? stringToValidate : undefined);

ValidateInput.boolean = (stringToValidate) => String(stringToValidate).toLowerCase() === 'true';

export default ValidateInput;
