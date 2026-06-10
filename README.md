# Сибсервисторг — Корпоративный сайт-визитка

Сайт-визитка для ООО «Сибсервисторг» (Омск) — компании в сфере обработки данных и IT-инфраструктуры.

## Стек технологий

- **Next.js 14** (App Router)
- **TypeScript** — типобезопасность
- **Tailwind CSS** — утилитарная стилизация
- **DM Sans + DM Serif Display** — типографика

## Структура проекта

```
src/
├── app/
│   ├── api/contact/route.ts   # API-роут для формы обратной связи
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Главная страница
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx    # Первый экран
│   │   ├── ServicesSection.tsx # Услуги + счётчики
│   │   ├── AboutSection.tsx   # О компании / преимущества
│   │   ├── HowSection.tsx     # Схема работы
│   │   ├── TrustSection.tsx   # Прозрачность / реквизиты
│   │   └── ContactSection.tsx # Форма контакта
│   └── ui/
│       ├── Navbar.tsx
│       └── Footer.tsx
└── lib/
    └── utils.ts               # cn() helper
```

## Запуск

```bash
# Установить зависимости
npm install

# Режим разработки
npm run dev

# Сборка для продакшна
npm run build
npm start
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Настройка формы обратной связи

Скопируйте `.env.example` в `.env.local` и заполните переменные.

### Вариант 1: Telegram-бот

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите `TELEGRAM_BOT_TOKEN`
3. Узнайте свой `TELEGRAM_CHAT_ID` через [@userinfobot](https://t.me/userinfobot)
4. Раскомментируйте код в `src/app/api/contact/route.ts`

### Вариант 2: Email через Resend

```bash
npm install resend
```

Используйте `RESEND_API_KEY` и интегрируйте в API-роут.

## Деплой на Vercel

```bash
npm install -g vercel
vercel --prod
```

Или подключите репозиторий напрямую в [vercel.com](https://vercel.com).

## Админ-панель

Админка доступна по адресу:

```text
/admin
```

При первом обращении браузер покажет окно логина. Используйте значения из `.env.local`:

- `ADMIN_USER`
- `ADMIN_PASSWORD`

Если хотите сменить логин и пароль, редактируйте эти переменные.

## Кастомизация

- **Контактные данные**: `src/components/sections/ContactSection.tsx` и `src/components/ui/Footer.tsx`
- **Реквизиты**: `src/components/sections/TrustSection.tsx`
- **Цены на услуги**: `src/components/sections/ServicesSection.tsx`
- **Цвета и шрифты**: `tailwind.config.ts` и `src/app/globals.css`
