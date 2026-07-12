import type { AuthTranslation } from '../../types';

// Общие сообщения валидации
const validation = {
  emailRequired: 'Email is required',
  emailInvalid: 'Please enter a valid email',
  passwordRequired: 'Password is required',
  passwordMinLength: 'Password must be at least 8 characters',
  passwordRequiresLetter: 'Password must contain at least one letter',
  passwordRequiresDigit: 'Password must contain at least one digit',
  passwordRequiresSpecial: 'Password must contain at least one special character',
};

export const auth: AuthTranslation = {
  signIn: {
    title: 'Sign In',
    email: 'Email',
    password: 'Password',
    submit: 'Sign In',
    validation,
  },
  signUp: {
    title: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    submit: 'Sign Up',
    validation: {
      ...validation,
      confirmPasswordRequired: 'Password confirmation is required',
      passwordsMustMatch: 'Passwords must match',
    },
  },
};
