const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db');
const lessonsRouter = require('./routes/lessons.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/lessons', lessonsRouter);
  
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ShopED backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
