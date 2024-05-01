export const phoneRegexp = {
  NORMAL: /^\d{3}-\d{2}-\d{2}$/, // Matches XXX-XX-XX
  EXPANDED: /^\((\d{3})\)\s?\d{3}-\d{4}$/, // Matches (XXX) XXX-XXXX
  BOTH: /^(?:\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{2}-\d{2})$/, // Combines both patterns
};

export const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_\\$%\\^&\\*])(?=.{8,128})/;
