const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

app.use(cors());
app.use(express.json());

let db;

async function startServer() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected successfully to MongoDB Atlas database: "${DB_NAME}"`);

    app.listen(PORT, () => {
      console.log(`ShopED backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    process.exit(1);
  }
}

startServer();
