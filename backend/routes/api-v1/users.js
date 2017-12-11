const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../../controllers/usersController');
const helper = require('../../controllers/helperController');

function requireRole(role) {
    return (req, res, next) => {
        if (req.user.role === role)
            next();
        else {
            return helper.errorResponse(res, 'Forbidden', 403);
        }
    }
}

router.use('/', passport.authenticate('jwt', {session: false}));

router.get('/', requireRole('admin'), users.list);
router.post('/', requireRole('admin'), users.create);

router.get('/:id', requireRole('admin'), users.read);
router.delete('/:id', requireRole('admin'), users.delete);
router.put('/:id', requireRole('admin'), users.update);

module.exports = router;
