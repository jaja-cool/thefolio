const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const router = express.Router();

// POST /api/contact - Public endpoint to send contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    const contactMessage = new ContactMessage({ name, email, message });
    await contactMessage.save();
    res.status(201).json({ message: 'Contact message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
