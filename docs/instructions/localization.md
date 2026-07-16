# Инструкция по работе с i18n (переводами)

## Структура проекта

Все переводы находятся в папке `src/lib/i18n/`:

```text
src/lib/i18n/
├── types.ts                 # Общие типы Translation, Language и типы для каждого раздела
├── index.ts                 # Основной экспорт (ru, en, типы)
├── locales/
│   ├── ru/
│   │   ├── index.ts         # Сборка всех русских переводов
│   │   ├── header.ts
│   │   ├── footer.ts
│   │   ├── auth.ts
│   │   ├── viewer.ts
│   │   ├── editor.ts
│   │   ├── history.ts
│   │   ├── about.ts
│   │   └── common.ts
│   └── en/
│       ├── index.ts
│       ├── header.ts
│       ├── ...
```

---

## 1. Как использовать переводы в компонентах

В любом клиентском компоненте (`'use client'`) вызовите хук `useTranslation()`.

**Пример – компонент `Header.tsx`:**

```tsx
'use client';

import { useTranslation } from '@/hooks';

export const Header = () => {
  // Получаем все переводы
  const translations = useTranslation();

  // Или сразу деструктурируем нужный раздел
  const { headerLang } = useTranslation();

  // Используем в разметке
  return (
    <header>
      <h1>{headerLang.logo}</h1>
      <nav>
        <a>{headerLang.nav.editor}</a>
        <a>{headerLang.nav.about}</a>
      </nav>
      <button>{headerLang.auth.signIn}</button>
    </header>
  );
};
```

**Рекомендации:**

- Всегда используйте **деструктуризацию** (например, `{ viewerLang }`), чтобы сразу было понятно, что это объект с переводами для конкретного компонента.
- Не используйте `translations.header` напрямую – так код становится менее читаемым.

---

## 2. Как добавить новый раздел переводов (новый словарь)

Предположим, вы хотите добавить переводы для страницы «Настройки» – раздел `settings`.

### 2.1. Создайте тип для нового раздела в `types.ts`

Откройте `src/lib/i18n/types.ts` и добавьте новый интерфейс:

```typescript
// Например, после существующих интерфейсов
export interface SettingsTranslation {
  title: string;
  theme: string;
  language: string;
  save: string;
}
```

Затем добавьте новое поле в интерфейс `Translation`:

```typescript
export interface Translation {
  // ... существующие поля
  settingsLang: SettingsTranslation; // обратите внимание на суффикс Lang
}
```

### 2.2. Создайте файл перевода для каждого языка

**Для русского языка:** `src/lib/i18n/locales/ru/settings.ts`

```typescript
import type { SettingsTranslation } from '../../types';

export const settings: SettingsTranslation = {
  title: 'Настройки',
  theme: 'Тема',
  language: 'Язык',
  save: 'Сохранить',
};
```

**Для английского языка:** `src/lib/i18n/locales/en/settings.ts`

```typescript
import type { SettingsTranslation } from '../../types';

export const settings: SettingsTranslation = {
  title: 'Settings',
  theme: 'Theme',
  language: 'Language',
  save: 'Save',
};
```

### 2.3. Подключите новый файл в индексные файлы каждого языка

Обновите `src/lib/i18n/locales/ru/index.ts`:

```typescript
import { settings } from './settings'; // добавьте импорт

export const ru: Translation = {
  // ... остальные поля
  settingsLang: settings, // добавьте в объект
};
```

Аналогично для `en/index.ts`.

### 2.4. Используйте новый раздел в компонентах

```typescript
'use client';
import { useTranslation } from '@/hooks';

export const SettingsPage = () => {
  const { settingsLang } = useTranslation();
  return (
    <div>
      <h1>{settingsLang.title}</h1>
      <label>{settingsLang.theme}</label>
      <button>{settingsLang.save}</button>
    </div>
  );
};
```

## 3. Как добавить новое поле в существующий словарь

Предположим, нужно добавить поле `description` в раздел `AboutTranslation`.

### 3.1. Обновите тип в `types.ts`

```typescript
export interface AboutTranslation {
  title: string;
  description: string; // новое поле
}
```

### 3.2. Добавьте перевод в каждый языковой файл

`ru/about.ts`:

```typescript
export const about: AboutTranslation = {
  title: 'О проекте',
  description: 'Это приложение создано в рамках курса RS School',
};
```

`en/about.ts:`

```typescript
export const about: AboutTranslation = {
  title: 'About',
  description: 'This app was built as part of the RS School course',
};
```

### 3.3. Используйте новое поле в компоненте

```typescript
const { aboutLang } = useTranslation();
return <p>{aboutLang.description}</p>;
```

**Важно:** TypeScript теперь требует, чтобы поле было заполнено во всех языковых файлах. Если вы забыли добавить его в одном из языков, получите ошибку компиляции.

---

## Порядок действий при внесении изменений

1. **Всегда сначала обновляйте тип в `types.ts`** – это гарантирует, что все языковые файлы будут приведены к единому контракту.
2. Затем добавляйте/меняйте переводы во всех языковых файлах (`ru/...` и `en/...`).
3. Если вы добавили новый раздел – не забудьте добавить его в `index.ts` каждого языка.
4. Проверьте, что в компонентах используется правильное имя поля (с суффиксом `Lang`).

---

## Проверка

- Запустите проект, переключайте язык – убедитесь, что тексты меняются.
- Если TypeScript показывает ошибку – проверьте, что все необходимые поля добавлены во все языковые файлы.
- Не используйте напрямую объект `translations` без деструктуризации – это усложняет чтение.

---

## Список уже существующих разделов

| Ключ в `Translation` | Назначение                      |
| -------------------- | ------------------------------- |
| `aboutLang`          | Страница «О проекте»            |
| `authLang`           | Формы входа и регистрации       |
| `commonLang`         | Общие строки (ошибки, загрузка) |
| `editorLang`         | Редактор схем                   |
| `headerLang`         | Шапка сайта                     |
| `historyLang`        | Страница истории и аналитики    |
| `viewerLang`         | Просмотрщик эндпоинтов          |

При добавлении нового раздела придерживайтесь суффикса `Lang` для единообразия.
