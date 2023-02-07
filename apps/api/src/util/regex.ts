export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&-_#]{8,}$/g;
export const PASSWORD_REGEX_ERROR_MESSAGE = `Password must be at least of 8 characters, have at least 1 lowercase letter, 1 uppercase letter, and one number. Only the following special characters are allowed: ! @ # . $ % & * - _ ?`;
