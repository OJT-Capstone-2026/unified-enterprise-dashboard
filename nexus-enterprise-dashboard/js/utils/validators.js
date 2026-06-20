export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isRequired = (value) => value !== null && value !== undefined && String(value).trim() !== '';

export const minLength = (value, min) => String(value).length >= min;

export const maxLength = (value, max) => String(value).length <= max;

export const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);

export const isPositive = (value) => isNumber(value) && parseFloat(value) > 0;

export const validate = (value, rules = []) => {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) return result;
  }
  return true;
};
