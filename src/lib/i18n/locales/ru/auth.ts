import type { AuthTranslation } from '../../types';

// Общие сообщения валидации
const validation = {
  emailRequired: 'Email обязателен',
  emailInvalid: 'Введите корректный email',
  passwordRequired: 'Пароль обязателен',
  passwordMinLength: 'Пароль должен быть не менее 8 символов',
  passwordRequiresLetter: 'Пароль должен содержать хотя бы одну букву',
  passwordRequiresDigit: 'Пароль должен содержать хотя бы одну цифру',
  passwordRequiresSpecial: 'Пароль должен содержать хотя бы один специальный символ',
};

export const auth: AuthTranslation = {
  signIn: {
    title: 'Вход',
    email: 'Email',
    password: 'Пароль',
    submit: 'Войти',
    validation,
  },
  signUp: {
    title: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтверждение пароля',
    submit: 'Зарегистрироваться',
    validation: {
      ...validation,
      confirmPasswordRequired: 'Подтверждение пароля обязательно',
      passwordsMustMatch: 'Пароли должны совпадать',
    },
  },
};
