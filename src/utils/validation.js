/**
 * Validation utilities for Candidate and Admin forms
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const re = /^[0-9+\s-]{8,15}$/;
  return re.test(phone.trim());
}

export function validateCandidateForm(formData) {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number (8-15 digits)';
  }

  if (!formData.age || Number(formData.age) < 16 || Number(formData.age) > 100) {
    errors.age = 'Age must be between 16 and 100';
  }

  if (!formData.qualification) {
    errors.qualification = 'Highest qualification is required';
  }

  if (!formData.city || !formData.city.trim()) {
    errors.city = 'City is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
