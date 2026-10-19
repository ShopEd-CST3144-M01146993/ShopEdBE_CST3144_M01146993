const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { connectDB } = require('./db');
const lessonsRouter = require('./routes/lessons.js');
const ordersRouter = require('./routes/orders.js')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.on('finish', () => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to: ${req.originalUrl} - Status: ${res.statusCode}`);
  });
  next();
});

app.get('/', (req, res) => {
  res.send('ShopEd API is running');
});

app.use('/images', (req, res) => {
  const filePath = path.join(__dirname, 'images', req.url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image file does not exist' });
  }
});

app.use('/lessons', lessonsRouter);

app.use('/orders', ordersRouter)
  
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ShopEd backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
