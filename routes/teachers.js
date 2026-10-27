const express = require('express');
const router = express.Router();
const { getDB } = require('../db.js');

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    
    const teachers = await db.collection('teachers').find({}).toArray();
    return res.status(200).json(teachers)
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
});

module.exports = router;