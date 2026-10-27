const express = require('express');
const router = express.Router();
const { getDB } = require('../db.js')

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const lessonId = parseInt(req.params.id, 10);
    if (isNaN(lessonId)) {
      return res.status(400).json({ error: 'Invalid Lesson ID' });
    }
    const lesson = await db.collection('lessons').findOne({id: lessonId});

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const orders = await db.collection('orders').find({ lessonIDs: lessonId }).toArray();

    const enrolmentCount = orders.reduce((total, order) => {
      const count = order.lessonIDs.filter(id =>  id === lessonId).length;
      return total + count;
    }, 0);

    return res.status(200).json({
      lessonId: lessonId,
      enrolmentCount: enrolmentCount
    });
    
  } catch (error) {
    console.log('Enrolment error:', error)
    return res.status(500).json({ error: 'Internal server error'})
  }
});

module.exports = router;