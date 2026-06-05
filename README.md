# Smart Order — Kiosk Self-Service App

Надстройка над iiko для киосков самообслуживания. Помогает гостю быстро выбрать комбо по сценарию (Быстро / Выгодно / Популярное / На компанию) и создаёт заказ в iiko.

**Стек:** React 18 + Tailwind CSS · Node.js + Express · iiko iikoTransport API · Docker

---

## Структура проекта

```
smart-order/
├── backend/           Express API + iiko-клиент
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/    menu · scenarios · order · stoplist
│   │   └── services/  iikoClient.js (кэш, mock-fallback, токен)
│   └── Dockerfile
├── frontend/          React SPA (5 экранов)
│   ├── src/
│   │   ├── screens/   Welcome · Scenarios · Combos · Confirm · Success
│   │   ├── components/LanguageSwitcher
│   │   ├── store/     Zustand store
│   │   └── i18n/      az · ru · en
│   └── Dockerfile
├── config/
│   └── scenarios.json  ← редактирует менеджер
├── mock/
│   └── menu.json       ← используется если iiko недоступен
├── deploy/
│   ├── start-kiosk.sh
│   ├── smart-order.service
│   └── kiosk-autostart.service
└── docker-compose.yml
```

---

## Подключение к iiko

1. Скопируйте файл конфигурации:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Заполните `backend/.env`:
   ```env
   IIKO_API_URL=https://api-ru.iiko.services/api/1
   IIKO_LOGIN=your_login
   IIKO_PASSWORD=your_password_hash
   IIKO_ORGANIZATION_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
   - `IIKO_LOGIN` / `IIKO_PASSWORD` — учётные данные из iikoOffice → Настройки → Пользователи API.
   - `IIKO_ORGANIZATION_ID` — UUID организации (`GET /api/1/organizations`).

3. Обновите `config/scenarios.json` — замените `mock-*` id на реальные UUID блюд из вашего меню iiko.

> **Если iiko недоступен** — бэкенд автоматически отдаёт данные из `mock/menu.json`. Идеально для демо и тестирования.

---

## Запуск локально (без Docker)

### Требования
- Node.js 20+
- npm 9+

### Backend
```bash
cd backend
npm install
cp .env.example .env   # заполнить .env
npm run dev            # http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm start              # http://localhost:3000 (proxy → 3001)
```

---

## Деплой на киоск (Linux)

### 1. Подготовка сервера
```bash
# Установить Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Скопировать проект
sudo mkdir -p /opt/smart-order
sudo cp -r . /opt/smart-order/
cd /opt/smart-order
```

### 2. Настройка окружения
```bash
cp backend/.env.example backend/.env
nano backend/.env   # вписать iiko credentials
```

### 3. Запуск Docker-стека
```bash
docker compose up -d --build
# Проверить: http://localhost
```

### 4. Systemd — автозапуск стека
```bash
sudo cp deploy/smart-order.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable smart-order
sudo systemctl start smart-order
```

### 5. Kiosk mode — автозапуск браузера

```bash
# Создать системного пользователя kiosk (без пароля входа)
sudo adduser --disabled-password --gecos "" kiosk

# Установить скрипт запуска
sudo cp deploy/start-kiosk.sh /usr/local/bin/start-kiosk.sh
sudo chmod +x /usr/local/bin/start-kiosk.sh

# Подключить systemd unit для браузера
sudo cp deploy/kiosk-autostart.service /etc/systemd/system/kiosk-browser.service
sudo systemctl daemon-reload
sudo systemctl enable kiosk-browser
sudo reboot
```

После перезагрузки Chromium откроется на весь экран в режиме киоска.

### Смена URL киоска
Если приложение доступно по другому адресу:
```bash
# /etc/systemd/system/kiosk-browser.service
Environment=KIOSK_URL=http://192.168.1.100
```

---

## Редактирование сценариев

Менеджер редактирует `config/scenarios.json` без кода:

```json
{
  "type": "fast",
  "label": { "az": "Tez", "ru": "Быстро", "en": "Fast" },
  "icon": "⚡",
  "maxCookingMinutes": 10,
  "combos": [
    {
      "id": "combo-fast-1",
      "name": { "az": "Burger Set", "ru": "Бургер Сет", "en": "Burger Set" },
      "itemIds": ["<iiko-product-uuid-1>", "<iiko-product-uuid-2>"]
    }
  ]
}
```

После сохранения файла — перезапустить бэкенд (или подождать сброса кэша через 5 мин).

---

## API эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/menu` | Полное меню (кэш 5 мин) |
| GET | `/api/scenarios` | Все сценарии с комбо |
| GET | `/api/scenarios?type=fast` | Комбо конкретного сценария |
| GET | `/api/stoplist` | Список остановленных позиций |
| POST | `/api/order` | Создать заказ в iiko |
| GET | `/health` | Health-check |

---

## Поддерживаемые языки

| Код | Язык | Файл |
|-----|------|------|
| `ru` | Русский | `frontend/src/i18n/ru.json` |
| `az` | Azərbaycan | `frontend/src/i18n/az.json` |
| `en` | English | `frontend/src/i18n/en.json` |

Добавить новый язык: создать файл `xx.json` по образцу, добавить в `i18n.js`, добавить кнопку в `LanguageSwitcher.js`.

---

## Лицензия

MIT
