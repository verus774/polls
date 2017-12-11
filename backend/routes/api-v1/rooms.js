const express = require('express');
const router = express.Router();
const rooms = require('../../controllers/roomsController');

router.get('/', rooms.list);
router.get('/:id', rooms.read);

module.exports = router;
