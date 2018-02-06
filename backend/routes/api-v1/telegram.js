const express = require('express');
const router = express.Router();
const telegram = require('../../controllers/telegramController');

router.post('/', telegram.sendMessage);

module.exports = router;
