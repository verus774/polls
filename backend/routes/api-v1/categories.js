const express = require('express');
const router = express.Router();
const passport = require('passport');
const categories = require('../../controllers/categoriesController');

router.use('/', passport.authenticate('jwt', {session: false}));

router.get('/', categories.list);
router.post('/', categories.create);

router.get('/:id', categories.read);
router.delete('/:id', categories.delete);
router.put('/:id', categories.update);

module.exports = router;
