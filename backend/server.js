const express = require('express');
const cors = require('cors');
const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yourusername.github.io'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Обслуживание статических файлов изображений
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// JSON Server middleware
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

app.use(express.json());
app.use(middlewares);

// API Routes
app.use('/api', router);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
  console.log(`📊 API available at: http://localhost:${port}/api`);
  console.log(`🖼️  Images available at: http://localhost:${port}/images`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
});
