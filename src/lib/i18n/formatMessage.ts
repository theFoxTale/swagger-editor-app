/** Для замены `{key}` в шаблонах переводов (i18n). */
export const formatMessage = (template: string, values: Record<string, string | number>): string =>
  Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template
  );
