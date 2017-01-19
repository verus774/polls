switch (process.env.NODE_ENV) {
    case 'development':
        module.exports = require('./development');
        break;
    case 'production':
        module.exports = require('./production');
        break;
    default:
        module.exports = require('./development');
}
