const express = require('express');
const router = express.Router();
const passport = require('passport');
const results = require('../../controllers/resultsController');

router.use('/', passport.authenticate('jwt', {session: false}));

router.get('/', results.list);
router.post('/', results.create);

router.get('/:id', results.read);
router.delete('/:id', results.delete);

module.exports = router;
