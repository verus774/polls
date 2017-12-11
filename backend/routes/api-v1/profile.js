const express = require('express');
const router = express.Router();
const passport = require('passport');
const profile = require('../../controllers/profileController');

router.use('/', passport.authenticate('jwt', {session: false}));

router.get('/', profile.me);
router.put('/', profile.updateMe);

module.exports = router;
