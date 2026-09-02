// Validation functions

export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const required = (value) => {
  if (!value && value !== 0) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const validatePassword = (password) => {
  const result = { isValid: false, errors: [] };
  
  if (!password) {
    result.errors.push('Password is required');
    return result;
  }
  
  if (password.length < 6) {
    result.errors.push('Password must be at least 6 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    result.errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    result.errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    result.errors.push('Password must contain at least one number');
  }
  
  result.isValid = result.errors.length === 0;
  return result;
};

export const validateAmount = (amount) => {
  const result = { isValid: false, errors: [] };
  
  if (!amount && amount !== 0) {
    result.errors.push('Amount is required');
    return result;
  }
  
  if (Number(amount) < 100) {
    result.errors.push('Minimum amount is ₦100');
  }
  
  if (Number(amount) > 10000000) {
    result.errors.push('Maximum amount is ₦10,000,000');
  }
  
  result.isValid = result.errors.length === 0;
  return result;
};
