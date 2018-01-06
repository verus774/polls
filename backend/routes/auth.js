const express = require('express');
const auth = require('../controllers/authController');
const router = express.Router();

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/refresh-token', auth.refreshToken);

module.exports = router;
