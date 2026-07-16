# Swagger/OpenAPI UI

## О проекте

**Swagger/OpenAPI UI** — веб-приложение для редактирования, просмотра и тестирования API-спецификаций в формате OpenAPI (Swagger). Разделённый вид (редактор + просмотрщик), аутентификация, история запросов с аналитикой, i18n и генерация cURL.

Проект разработан в рамках курса [RS School](https://rs.school/) на Next.js (App Router) с серверным прокси для обхода CORS.

Описание задания:

- [RU](./docs/task/final_ru.md)
- [ENG](./docs/task/final.md)

## Демо

**Деплой:** [ссылка на Vercel](https://swagger-editor-app-nu.vercel.app/)

## Основной функционал

- **Редактор OpenAPI** — вставка и редактирование спецификаций в JSON/YAML, автоопределение формата, валидация, переключение формата.
- **Просмотрщик** — эндпоинты с методами, параметрами, схемами запросов и ответов.
- **Try-It-Out** — выполнение запросов к внешним API через серверный прокси (`/api/proxy`).
- **Генерация cURL** — копирование готовой команды для текущего запроса.
- **Аутентификация** — регистрация и вход через Supabase (email/пароль) с клиентской валидацией.
- **История и аналитика** — для авторизованных пользователей: длительность, статус, размеры, ошибки, URL.
- **Сохранение схем** — авторизованные пользователи могут сохранять схему и восстанавливать её при следующем входе.
- **Мультиязычность** — EN / RU (переключатель в шапке).
- **Адаптивный интерфейс** — ориентация редактора/просмотрщика подстраивается под экран.
- **Липкая шапка** — с анимацией при прокрутке.
- **Страница «О проекте»** — информация о команде и курсе.

## Технологии

- **Фреймворк:** [Next.js 16 (App Router)](https://nextjs.org/docs/app)
- **Язык:** TypeScript
- **UI:** React 19, Monaco Editor, CSS Modules (+ Tailwind CSS)
- **Состояние:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Аутентификация и БД:** [Supabase](https://supabase.com/) (Auth + PostgreSQL, сессия через cookies / `@supabase/ssr`)
- **Тестирование:** Vitest + React Testing Library
- **Линтинг / формат:** ESLint, Stylelint, Prettier
- **Git-хуки:** Husky + lint-staged
- **Деплой:** Vercel

## Команда

| Имя                 | Роль        | GitHub                                       |
| ------------------- | ----------- | -------------------------------------------- |
| **Анна Демьянович** | Team Lead   | [@theFoxTale](https://github.com/theFoxTale) |
| **Ульяна**          | Разработчик | [@Ulya10](https://github.com/Ulya10/)        |
| **Кристина**        | Разработчик | [@Pchyolan](https://github.com/Pchyolan/)    |

## Установка и запуск

### Требования

- Node.js **20+** (рекомендуется LTS)
- npm

### 1. Клонирование репозитория

```bash
git clone https://github.com/theFoxTale/swagger-editor-app.git
cd swagger-editor-app
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Переменные окружения

Скопируйте шаблон и заполните ключи Supabase:

```bash
cp .env.example .env.local
```

| Переменная                      | Описание                         |
| ------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL проекта Supabase             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key проекта Supabase |

Без этих переменных редактор и просмотрщик работают, но вход, история и запись аналитики требуют настроенный Supabase (таблица `request_history` и политики RLS).

### 4. Режим разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

### 5. Продакшен

```bash
npm run build
npm start
```

## Команды разработки

| Команда                 | Описание                                      |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Dev-сервер Next.js с hot reload.              |
| `npm run build`         | Продакшен-сборка Next.js.                     |
| `npm run start`         | Запуск собранного приложения (нужен `build`). |
| `npm run type-check`    | Проверка типов TypeScript (`tsc --noEmit`).   |
| `npm run format`        | Форматирование Prettier (перезапись файлов).  |
| `npm run format:check`  | Проверка форматирования без перезаписи.       |
| `npm run lint`          | ESLint.                                       |
| `npm run lint:fix`      | ESLint с автоисправлением.                    |
| `npm run lint:css`      | Stylelint для CSS/SCSS.                       |
| `npm run test`          | Vitest (один прогон).                         |
| `npm run test:watch`    | Vitest в watch-режиме.                        |
| `npm run test:coverage` | Тесты с отчётом о покрытии.                   |
| `npm run check`         | lint + type-check + format:check.             |
| `npm run check:full`    | `check` + тесты (используется в pre-push).    |

## Покрытие тестами

![coverage](./docs/Screenshot%20-%20Code%20coverage.png)
