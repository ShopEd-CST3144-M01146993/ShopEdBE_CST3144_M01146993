const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db');
const logger = require('./middleware/logger.js');
const staticImages = require('./middleware/staticImages.js');
const lessonsRouter = require('./routes/lessons.js');
const ordersRouter = require('./routes/orders.js');
const enrolmentsRouter = require('./routes/enrolment.js')

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ message: 'ShopEd API is running' });
});

app.use('/images', staticImages);
app.use('/lessons', lessonsRouter);
app.use('/orders', ordersRouter);
app.use('/enrolment', enrolmentsRouter);

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
