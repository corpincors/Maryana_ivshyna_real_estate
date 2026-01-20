# Full-Stack Application for Vercel Deployment

This project is set up for deployment on Vercel with a separate backend that can run locally or on a Linux server.

## Project Structure

```
├── frontend/          # Next.js frontend for Vercel deployment
│   ├── pages/         # Next.js pages
│   ├── styles/        # CSS files
│   ├── package.json  # Frontend dependencies
│   └── ...           # Other Next.js files
├── backend/           # Node.js/Express backend
│   ├── server.js      # Main server file
│   ├── Dockerfile     # Docker configuration
│   ├── package.json   # Backend dependencies
│   └── .env.example   # Environment variables template
├── docker-compose.yml # Docker setup for local development
├── vercel.json       # Vercel configuration
└── README.md         # This file
```

## Features

- **Frontend**: Next.js with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express, PostgreSQL database
- **Database**: PostgreSQL with Docker support
- **Deployment**: Ready for Vercel (frontend) and any server (backend)

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd <project-name>

# Setup frontend
cd frontend
npm install
cp .env.local.example .env.local

# Setup backend
cd ../backend
npm install
cp .env.example .env
```

### 2. Start Database (Docker)

```bash
# From project root
docker-compose up -d postgres
```

### 3. Start Backend

```bash
# From backend directory
npm run dev
```

The backend will be available at `http://localhost:3001`

### 4. Start Frontend

```bash
# From frontend directory
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vercel_app
DB_USER=postgres
DB_PASSWORD=password
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL
4. Deploy!

### Backend (Linux Server)

Option 1: Direct deployment
```bash
# On your Linux server
git clone <your-repo-url>
cd <project-name>/backend
npm install --production
cp .env.example .env
# Edit .env with your production values
npm start
```

Option 2: Docker deployment
```bash
# On your Linux server
git clone <your-repo-url>
cd <project-name>
docker-compose up -d
```

### Database

For production, consider using:
- Managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
- Or self-hosted PostgreSQL on your server

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `DELETE /api/users/:id` - Delete a user

## Development Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart backend
docker-compose restart backend
```

## Production Considerations

1. **Security**: Use strong passwords and JWT secrets
2. **Database**: Use managed PostgreSQL for better reliability
3. **HTTPS**: Configure SSL certificates for your backend
4. **Environment**: Never commit sensitive environment variables
5. **Monitoring**: Add logging and monitoring for production

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in .env file
- Verify database exists

### Frontend Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Backend Issues
- Check all environment variables are set
- Ensure port 3001 is available
- Check database connection

## License

MIT License
