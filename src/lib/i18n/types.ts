export type Language = 'ru' | 'en';

export interface AboutTranslation {
  title: string;
}

// ============ Auth ============
// Общая валидация для полей, общих для обеих форм
export interface AuthValidation {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  passwordRequiresLetter: string;
  passwordRequiresDigit: string;
  passwordRequiresSpecial: string;
}

// Базовый тип для формы аутентификации (общие поля)
export interface AuthFormTranslation {
  title: string;
  email: string;
  password: string;
  submit: string;
  validation: AuthValidation;
}

export interface SignUpTranslation extends AuthFormTranslation {
  confirmPassword: string;
  validation: AuthValidation & {
    confirmPasswordRequired: string;
    passwordsMustMatch: string;
  };
}

export interface AuthTranslation {
  signIn: AuthFormTranslation;
  signUp: SignUpTranslation;
}

export interface CommonTranslation {
  error: string;
  loading: string;
}

export interface EditorTranslation {
  title: string;
}

export interface HeaderTranslation {
  logo: string;
  description: string;
  nav: {
    editor: string;
    about: string;
    history: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    logout: string;
  };
  language: {
    ru: string;
    en: string;
  };
}

export interface HistoryTranslation {
  title: string;
  empty: string;
}

export interface ViewerTranslation {
  title: string;
}

// Полный объект перевода для всего приложения
export interface Translation {
  aboutLang: AboutTranslation;
  authLang: AuthTranslation;
  commonLang: CommonTranslation;
  editorLang: EditorTranslation;
  headerLang: HeaderTranslation;
  historyLang: HistoryTranslation;
  viewerLang: ViewerTranslation;
}
