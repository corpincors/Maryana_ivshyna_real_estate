const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://192.168.5.100:3000', 'https://yourusername.github.io'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Обслуживание статических файлов изображений
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Чтение базы данных
const dbPath = path.join(__dirname, 'db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// API Routes
app.get('/api/properties', (req, res) => {
  res.json(db.properties);
});

app.get('/api/properties/:id', (req, res) => {
  const property = db.properties.find(p => p.id === req.params.id);
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

app.post('/api/properties', express.json(), (req, res) => {
  const newProperty = { ...req.body, id: Date.now().toString() };
  db.properties.push(newProperty);
  
  // Сохранение в файл
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  
  res.status(201).json(newProperty);
});

app.put('/api/properties/:id', express.json(), (req, res) => {
  const index = db.properties.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    db.properties[index] = { ...req.body, id: req.params.id };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json(db.properties[index]);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

app.delete('/api/properties/:id', (req, res) => {
  const index = db.properties.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    db.properties.splice(index, 1);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
  console.log(`📊 API available at: http://localhost:${port}/api`);
  console.log(`🖼️  Images available at: http://localhost:${port}/images`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
});
