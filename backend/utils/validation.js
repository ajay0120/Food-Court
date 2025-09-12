const validator = require('validator');
const mongoose = require('mongoose');

function validateEmail(email) {
  return typeof email === 'string' && validator.isEmail(email.trim());
}

function sanitizeEmail(email) {
  return email.trim().toLowerCase();
}

function validateRequiredString(value, { min = 1, max = 200 } = {}) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  return v.length >= min && v.length <= max;
}

function sanitizeString(value) {
  return typeof value === 'string' ? validator.escape(value.trim()) : value;
}

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function validatePositiveInt(num, { min = 1, max = 1_000_000 } = {}) {
  if (typeof num === 'string' && num.trim() !== '') num = Number(num);
  return Number.isInteger(num) && num >= min && num <= max;
}

function buildValidationError(message, fields = {}) {
  return { message, errors: fields };
}

module.exports = {
  validateEmail,
  sanitizeEmail,
  validateRequiredString,
  sanitizeString,
  validateObjectId,
  validatePositiveInt,
  buildValidationError
};
