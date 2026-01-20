# Realty CRM Backend

## Запуск локально

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Запуск в production
npm start
```

## API Endpoints

- `GET /api/properties` - Получить все объекты
- `GET /api/properties/:id` - Получить объект по ID
- `POST /api/properties` - Создать новый объект
- `PUT /api/properties/:id` - Обновить объект
- `DELETE /api/properties/:id` - Удалить объект
- `GET /images/:filename` - Получить изображение

## Деплой на VPS

1. Скопировать папку backend на сервер
2. Установить зависимости: `npm install`
3. Установить PM2: `npm install -g pm2`
4. Запустить: `pm2 start server.js --name realty-crm-api`
5. Настроить автозапуск: `pm2 startup`
