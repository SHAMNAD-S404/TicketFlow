export const regexPatterns = {
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
  newPassword: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  nameAndNumber: /^[a-zA-Z0-9 ]+$/,
  phoneNumber: /^[6-9]\d{9}$/,
  name: /^[a-zA-Z][a-zA-Z\s]*$/,
};
