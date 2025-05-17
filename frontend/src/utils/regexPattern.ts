type TregexPatterns = {
  name: RegExp;
  nameAndNumber: RegExp;
  email: RegExp;
  phoneNumber: RegExp;
  password: RegExp;
  corporateId: RegExp;
  textWithSpaceAndCommas : RegExp;
  textAreaValidation : RegExp;
  textAndNumberWithoutSpace : RegExp,
  resolutionInputField : RegExp,
  newPasswordValidation : RegExp,
  newLoginPassValidation : RegExp
};

const regexPatterns: TregexPatterns = {
  name: /^[a-zA-Z][a-zA-Z\s]*$/, // Only alphabets and spaces
  nameAndNumber: /^[a-zA-Z0-9 ]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Standard email validation
  phoneNumber: /^(\+?\d{1,3}[- ]?)?(6|7|8|9)\d{9}$/ , // Numbers only, supports optional "+" prefix
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, // 8-15 chars, must contain letters and numbers
  corporateId: /^[A-Za-z0-9]+$/, // Alphanumeric
  textWithSpaceAndCommas: /^[a-zA-Z][a-zA-Z\s,]*$/,
  textAreaValidation:/^[a-zA-Z0-9"'.(),/:\-\s]+(?<![().])$/,
  textAndNumberWithoutSpace : /^[a-zA-Z0-9]+$/,
  resolutionInputField : /^[a-zA-Z0-9.,'"\:(\)\s-]+$/,
  newPasswordValidation : /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  newLoginPassValidation : /^[A-Za-z0-9@#*&%]+$/,


};




type regexPatternMessages = {
  nameRegexMessage : string;
  nameAndNumberRegexMessage : string;
  emailRegexMessage : string;
  phoneNumberRegexMessage : string;
  passwordRegexMessage : string;
  corporateIdRegexMessage : string;
  textWithSpaceAndCommasRegexMessage : string;
  FEILD_REQUIRED : string;
  MAXIMUM_LIMIT_REACHED : string;
  MINIMUM_LIMIT : string;
  text_area_validation : string;
  newPassValidationMssg : string;
}




export const RegexMessages : regexPatternMessages = {

  nameRegexMessage : "Only alphabates and spaces allowed.Enter valid name",
  emailRegexMessage : "Enter a valid email id!!",
  phoneNumberRegexMessage : "Enter a valid phone number !!",
  nameAndNumberRegexMessage : " alphabates , number  are only allowed .",
  passwordRegexMessage : "must contain letter and number length should we between 8-15 .",
  corporateIdRegexMessage: " Alphates and number only allowed",
  textWithSpaceAndCommasRegexMessage : "Alphabates ,space and commas only allowed",
  FEILD_REQUIRED : "This is field is required",
  MAXIMUM_LIMIT_REACHED : "Input Maximun limit reached !",
  MINIMUM_LIMIT : "Enter atleast minimum Limit",
  text_area_validation : "This field only allow alphabates , numbers , allowed symbols ',.(,), text end with ()  not allowed ",
  newPassValidationMssg : "Password: 8-15 chars, alphanumeric & special chars required"
  

}

export default regexPatterns;
