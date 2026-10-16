const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lessons = await req.db.collection('lessons').find({}).toArray();
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
