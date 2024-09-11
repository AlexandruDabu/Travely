
const express = require('express');
const { authJWT } = require("../JWT-config");
const { getMessages, newMessage } = require('../controllers/messageController');

const router = express.Router();

router.get('/messages/:senderId/:receiverId/:page', authJWT, getMessages)

router.post('/newMessage', authJWT, newMessage)

module.exports = router;