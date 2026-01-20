# Деплой Realty CRM

## Структура проекта

```
realty-crm/
├── frontend/          # React приложение (для GitHub Pages)
├── backend/           # Node.js API сервер
└── public/images/     # Изображения
```

## 1. Подготовка фронтенда для GitHub Pages

```bash
# Создаем .env.local
echo "VITE_API_URL=http://your-vps-ip:3001/api" > .env.local

# Собираем проект
npm run build

# Деплой на GitHub Pages
npm run deploy
```

## 2. Деплой бэкенда на VPS

### Настройка VPS (Ubuntu/Debian)

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Копирование файлов бэкенда
scp -r backend/ user@your-vps-ip:/home/user/
scp -r public/images/ user@your-vps-ip:/home/user/backend/

# На VPS:
cd backend
npm install
pm2 start server.js --name realty-crm-api
pm2 startup
pm2 save
```

### Настройка Nginx (опционально)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /images/ {
        alias /home/user/backend/public/images/;
    }
}
```

## 3. Переменные окружения

### Локальная разработка
```bash
# .env.local
VITE_API_URL=http://localhost:3001/api
```

### Production
```bash
# .env.production  
VITE_API_URL=http://your-vps-ip:3001/api
```

## 4. Проверка работы

```bash
# Проверка API
curl http://your-vps-ip:3001/health

# Проверка изображений
curl http://your-vps-ip:3001/images/95lnr7obq_1.jpeg
```

## 5. Мониторинг

```bash
# Статус PM2
pm2 status

# Логи
pm2 logs realty-crm-api

# Перезапуск
pm2 restart realty-crm-api
```

## Альтернативные варианты деплоя

### Railway
```bash
# Установка Railway CLI
npm install -g @railway/cli

# Деплой
railway login
railway init
railway up
```

### Render.com
1. Подключить GitHub репозиторий
2. Настроить переменные окружения
3. Автоматический деплой

### Supabase
1. Создать проект
2. Использовать Supabase API
3. Хранить изображения в Supabase Storage
