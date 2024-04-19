export const phoneRegexp = {
  NORMAL: /^\d{3}-\d{2}-\d{2}$/, // Matches XXX-XX-XX
  EXPANDED: /^\((\d{3})\)\s?\d{3}-\d{4}$/, // Matches (XXX) XXX-XXXX
};