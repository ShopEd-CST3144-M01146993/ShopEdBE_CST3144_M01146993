const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

let db;
let client;

async function connectDB() {
  if (db) return db;

  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected successfully to MongoDB Atlas database: "${DB_NAME}"`);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Please call connectDB first.');
  }
  return db;
}

module.exports = { connectDB, getDB };
