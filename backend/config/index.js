const path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

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
