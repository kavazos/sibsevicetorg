# Сибсервисторг — корпоративный сайт с личным кабинетом и админ-панелью

Страница компании ООО «Сибсервисторг» (Омск) с формой обратной связи, авторизацией пользователей, личным кабинетом и простой админкой для обработки заявок.

## Стек технологий

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Prisma** + PostgreSQL
- **Nodemailer** для отправки писем
- **bcryptjs** для хеширования паролей
- **lucide-react** для иконок

## Основные возможности

- Главная страница с информационными блоками, услугами и обратной связью
- Контактная форма с валидацией, созданием заявки в базе и отправкой писем по SMTP
- Личный кабинет пользователя:
  - регистрация и вход
  - просмотр всех своих заявок
  - фильтрация по статусу
  - детальный просмотр заявки
  - экспорт заявки в JSON
  - редактирование профиля и смена пароля
- Админ-панель:
  - вход через `ADMIN_USER`/`ADMIN_PASSWORD`
  - просмотр списка заявок
  - обновление статуса заявки
  - удаление заявки
  - экспорт CSV

## Структура проекта

```
src/
├── app/
│   ├── api/
│   │   ├── admin/            # API для админ-панели
│   │   ├── auth/             # регистрация, вход, выход, профиль
│   │   ├── account/          # экспорт заявки в JSON
│   │   └── contact/          # контактная форма и подтверждение email
│   ├── admin/                # интерфейс админа
│   ├── auth/                 # страницы входа и регистрации
│   ├── account/              # личный кабинет и профиль
│   ├── privacy/              # политика конфиденциальности
│   ├── offer/                # коммерческое предложение
│   ├── sitemap.xml/          # sitemap route
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # главная страница
├── components/
│   ├── account/              # список заявок, профиль
│   ├── admin/                # табличка заявок, кнопки выхода
│   ├── sections/             # блоки главной страницы
│   └── ui/                   # Navbar, Footer, Toast
├── lib/
│   ├── auth.ts               # управление сессиями cookie
│   ├── prisma.ts             # Prisma client
│   └── utils.ts              # вспомогательный cn()
prisma/
├── schema.prisma             # схема базы данных
```

## Схема базы данных

В проекте используется PostgreSQL с моделями:

- `User` — регистрация и авторизация
- `ContactSubmission` — заявки с полем `status` (`NEW`, `IN_PROGRESS`, `PROCESSED`)

## Запуск локально

1. Установите зависимости:

```bash
npm install
```

2. Настройте `.env.local` с нужными переменными окружения.

3. Сгенерируйте Prisma Client и примените миграции:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Запустите приложение:

```bash
npm run dev
```

5. Откройте [http://localhost:3000](http://localhost:3000)

## Переменные окружения

Обязательные переменные:

- `DATABASE_URL` — подключение к PostgreSQL (можно использовать Supabase Postgres URL или Neon URL)
- `SESSION_SECRET` — секрет для пользовательских сессий
- `ADMIN_USER` — логин администратора
- `ADMIN_PASSWORD` — пароль администратора
- `SMTP_HOST` — SMTP-сервер
- `SMTP_PORT` — порт SMTP
- `SMTP_SECURE` — `true`/`false`
- `SMTP_USER` — SMTP логин (если требуется)
- `SMTP_PASS` — SMTP пароль (если требуется)
- `SMTP_FROM` — email отправителя
- `CONTACT_EMAIL` — email, на который отправляются уведомления о заявках
- `SITE_URL` — базовый URL сайта (например, `https://example.com`)
- `SITE_NAME` — название сайта в письмах

## Neon (альтернатива Supabase)

Если вы хотите использовать Neon вместо Supabase, то настройка проекта остаётся стандартной для Prisma.

1. Создайте проект в Neon и получите строку подключения PostgreSQL.
2. Вставьте её в `DATABASE_URL` в `.env`:

```env
DATABASE_URL="postgresql://<user>:<password>@<project>.<region>.neon.tech/<database>?sslmode=require"
```

3. Примените миграции и сгенерируйте Prisma Client:

```bash
npx prisma migrate deploy
npx prisma generate
```

4. Для разработки можно также использовать:

```bash
npx prisma migrate dev --name init
```

> Важно: у Neon подключение обычно работает без дополнительных `external_id` или SNI-параметров, в отличие от некоторых pooler-URL Supabase.

## Админ-панель

Адрес: `/admin`

Логин производится по `ADMIN_USER` и `ADMIN_PASSWORD`. После входа администратор может просматривать, фильтровать и обрабатывать заявки.

## Пользовательский кабинет

Доступны страницы:

- `/auth/register` — регистрация
- `/auth/login` — вход
- `/account` — личный кабинет с заявками
- `/account/profile` — редактирование профиля
- `/account/submissions/[id]` — подробности заявки

## Комментарии по коду

- `src/app/api/contact/route.ts` содержит логику создания заявки, проверки deliverability email и отправки писем по SMTP
- `src/lib/auth.ts` обеспечивает простой cookie-based login для пользователей
- `src/components/admin/AdminSubmissionsTable.tsx` отвечает за управление заявками в админке

## Деплой

Для продакшн-сборки:

```bash
npm run build
npm start
```

Для Vercel можно подключить репозиторий напрямую, но обязательно задайте все переменные окружения.

## Полезные команды

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:db:push
```
