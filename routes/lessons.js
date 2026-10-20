const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const lessons = await db.collection('lessons').find({}).toArray();
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const lessonId = parseInt(req.params.id, 10);

    if (isNaN(lessonId)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    const allowedFields = ['spaces', 'price', 'subject', 'location', 'image', 'altText'];
    const invalidFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));

    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid field(s): ${invalidFields.join(', ')}` });
    }

    const { spaces, price, subject, location, image, altText } = req.body;

    if (spaces !== undefined && (!Number.isInteger(spaces) || spaces < 0)) {
      return res.status(400).json({ error: 'Spaces must be a non-negative integer' });
    }

    if (price !== undefined && (!Number.isInteger(price) || price < 0)) {
      return res.status(400).json({ error: 'Price must be a positive whole number' });
    }

    if (subject !== undefined && (typeof subject !== 'string' || subject.trim().length < 2)) {
      return res.status(400).json({ error: 'Subject must be at least 2 characters' });
    }

    if (location !== undefined && (typeof location !== 'string' || location.trim().length < 2)) {
      return res.status(400).json({ error: 'Location must be at least 2 characters' });
    }

    if (image !== undefined && (typeof image !== 'string' || image.trim().length < 3)) {
      return res.status(400).json({ error: 'Image path must be at least 3 characters' });
    }

    if (altText !== undefined && (typeof altText !== 'string' || altText.trim().length < 2)) {
      return res.status(400).json({ error: 'Alt text must be at least 2 characters' });
    }

    const updateData = {};
    if (spaces !== undefined) updateData.spaces = spaces;
    if (price !== undefined) updateData.price = price;
    if (subject !== undefined) updateData.subject = subject.trim();
    if (location !== undefined) updateData.location = location.trim();
    if (image !== undefined) updateData.image = image.trim();
    if (altText !== undefined) updateData.altText = altText.trim();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid updatable fields provided' });
    }

    const result = await db.collection('lessons').updateOne(
      { id: lessonId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.status(200).json({ message: 'Lesson updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
