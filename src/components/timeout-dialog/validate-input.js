function ValidateInput() {
}

ValidateInput.int = (stringToValidate) => {
  const parsedInt = parseInt(stringToValidate, 10);
  // eslint-disable-next-line no-restricted-globals
  return typeof parsedInt === 'number' && isNaN(parsedInt) ? undefined : parsedInt;
};

ValidateInput.string = (stringToValidate) => stringToValidate && ((`${stringToValidate}`) || undefined);

export default ValidateInput;
