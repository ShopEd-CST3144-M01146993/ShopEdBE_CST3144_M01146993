const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const { name, email, phone, lessonIDs, spaces } = req.body || {};

    const nameRegex = /^[A-Za-z][A-Za-z\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]+$/;

    const isNameValid = typeof name === 'string' && nameRegex.test(name.trim());
    const isEmailValid = typeof email === 'string' && emailRegex.test(email.trim());
    const isPhoneValid = (typeof phone === 'string' || typeof phone === 'number') && phoneRegex.test(String(phone).trim());
    const isLessonIDsValid = Array.isArray(lessonIDs) && lessonIDs.length > 0;
    const isSpacesValid = Number.isInteger(spaces) && spaces >= 1;

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isLessonIDsValid || !isSpacesValid) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    const orderDocument = {
      name: name.trim(),
      email: email.trim(),
      phone: String(phone).trim(),
      lessonIDs,
      spaces,
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('orders').insertOne(orderDocument);

    res.status(201).json({
      message: 'Order created',
      orderId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
