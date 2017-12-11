const express = require('express');
const polls = require('../../controllers/pollsController');
const roomRoutes = require('./rooms');
const pollRoutes = require('./polls');
const categoryRoutes = require('./categories');
const resultRoutes = require('./results');
const userRoutes = require('./users');
const profileRoutes = require('./profile');
const router = express.Router();

router.use('/', (req, res, next) => {
    if ('OPTIONS' === req.method) {
        res.sendStatus(204);
    }
    else next();
});

router.route('/active-poll')
    .get(polls.readActive);

router.use('/categories', categoryRoutes);
router.use('/polls', pollRoutes);
router.use('/results', resultRoutes);
router.use('/rooms', roomRoutes);
router.use('/users', userRoutes);
router.use('/me', profileRoutes);

module.exports = router;
