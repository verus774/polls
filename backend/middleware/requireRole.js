const helper = require('../controllers/helperController');

module.exports = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role)
            return helper.errorResponse(res, 'Forbidden123', 403);
        next();
    }
};
