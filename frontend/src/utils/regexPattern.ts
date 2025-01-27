type TregexPatterns = {
  name: RegExp;
  nameAndNumber: RegExp;
  email: RegExp;
  phoneNumber: RegExp;
  password: RegExp;
  corporateId: RegExp;
  textWithSpaceAndCommas : RegExp;
};

const regexPatterns: TregexPatterns = {
  name: /^[a-zA-Z][a-zA-Z\s]*$/, // Only alphabets and spaces
  nameAndNumber: /^[a-zA-Z0-9 ]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Standard email validation
  phoneNumber: /^\+?[0-9]{10,14}$/, // Numbers only, supports optional "+" prefix
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/, // 8-15 chars, must contain letters and numbers
  corporateId: /^[A-Za-z0-9]+$/, // Alphanumeric
  textWithSpaceAndCommas: /^[a-zA-Z][a-zA-Z\s,]*$/,
};

export default regexPatterns;
