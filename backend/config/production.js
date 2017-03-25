const config = require('./development');

config.tokenExpiresIn = '2d';
config.serveStatic = '../frontend/build';

module.exports = config;
