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
  unauthorized: {
    title: string;
    description: string;
    goHome: string;
    signIn: string;
  };
}

export interface EditorTranslation {
  title: string;
  tab: string;
  format: string;
  validate: string;
  saveSchema: string;
  savedAgo: string;
  savedJustNow: string;
  yaml: string;
  json: string;
  valid: string;
  invalid: string;
  line: string;
  column: string;
  spaces: string;
  encoding: string;
  lineEnding: string;
  loginToSave: string;
  errorsTitle: string;
  newTab: string;
  closeTab: string;
  tabsLabel: string;
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
  theme: {
    switchToLight: string;
    switchToDark: string;
  };
}

export interface HistoryTranslation {
  title: string;
  empty: string;
}

export interface ViewerTranslation {
  title: string;
  emptySchema: string;
  baseUrl: string;
  endpointsLabel: string;
  emptyEndpoints: string;
  requiresAuth: string;
  tagGroupLabel: string;
  operationsCount: string;
  expandEndpoint: string;
  collapseEndpoint: string;
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
