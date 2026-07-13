export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return 'Invalid email';
  }

  return '';
};

export const validatePassword = (password: string): string => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must contain at least 8 characters';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain an uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain a lowercase letter';
  }

  if (!/\d/.test(password)) {
    return 'Password must contain a number';
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain a special character';
  }

  return '';
};
