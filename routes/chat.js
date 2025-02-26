const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// API to get all chat messages
router.get('/chats', async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load chats' });
  }
});


// API to send a new chat message
router.post('/send-message', async (req, res) => {
  const { fkUserLoginId, name, message } = req.body;

  try {
    const newMessage = new Chat({
      fkUserLoginId,
      name,
      message
    });
    await newMessage.save();
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
  
  
});

module.exports = router;
