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
  emptySchemaTitle: string;
  emptySchema: string;
  invalidSchemaTitle: string;
  invalidSchema: string;
  invalidSchemaHint: string;
  baseUrl: string;
  baseUrlLinkLabel: string;
  noBaseUrl: string;
  noDescription: string;
  versionLabel: string;
  endpointsLabel: string;
  emptyEndpoints: string;
  requiresAuth: string;
  tagGroupLabel: string;
  operationsCount: string;
  expandEndpoint: string;
  collapseEndpoint: string;
  tryItOut: string;
  cancelTryItOut: string;
  tryItOutPanel: string;
  tryItOutPlaceholder: string;
  tryItOutParametersTitle: string;
  tryItOutParametersEmpty: string;
  tryItOutRequired: string;
  tryItOutUnset: string;
  tryItOutBooleanTrue: string;
  tryItOutBooleanFalse: string;
  tryItOutArrayHint: string;
  tryItOutObjectHint: string;
  tryItOutHeadersTitle: string;
  tryItOutHeaderName: string;
  tryItOutHeaderValue: string;
  tryItOutAddHeader: string;
  tryItOutRemoveHeader: string;
  tryItOutCustomHeader: string;
  tryItOutAcceptPlaceholder: string;
  tryItOutAuthorizationPlaceholder: string;
  tryItOutBodyTitle: string;
  tryItOutBodyEmpty: string;
  tryItOutBodyContentType: string;
  tryItOutBodyEditor: string;
  tryItOutBodyInvalidJson: string;
  parametersTitle: string;
  parametersEmpty: string;
  parametersPath: string;
  parametersQuery: string;
  parametersHeader: string;
  parametersCookie: string;
  parameterName: string;
  parameterType: string;
  parameterRequired: string;
  parameterRequiredYes: string;
  parameterRequiredNo: string;
  parameterDescription: string;
  parameterNoDescription: string;
  parameterExample: string;
  deprecated: string;
  requestBodyTitle: string;
  requestBodyEmpty: string;
  requestBodyRequired: string;
  requestBodyOptional: string;
  requestBodyContentType: string;
  requestBodySchema: string;
  requestBodyExample: string;
  requestBodyNoExample: string;
  responsesTitle: string;
  responsesEmpty: string;
  responseNoDescription: string;
  responseContentType: string;
  responseSchema: string;
  responseExample: string;
  responseNoExample: string;
  responseNoSchema: string;
  responseNoContent: string;
  responseHeaders: string;
  schemaEmpty: string;
  schemaRequired: string;
  schemaOptional: string;
  schemaEnum: string;
  schemaItems: string;
  schemaAllOf: string;
  schemaAnyOf: string;
  schemaOneOf: string;
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
