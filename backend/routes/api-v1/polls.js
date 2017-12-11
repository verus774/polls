const express = require('express');
const router = express.Router();
const passport = require('passport');
const polls = require('../../controllers/pollsController');

router.use('/', passport.authenticate('jwt', {session: false}));

router.get('/', polls.list);
router.post('/', polls.create);

router.get('/:id', polls.read);
router.delete('/:id', polls.delete);
router.put('/:id', polls.update);

module.exports = router;
