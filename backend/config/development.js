module.exports = {
    port: 80,
    dbUrl: process.env.DB_URL_DEV,
    secretKey: 'mySecretKey',
    tokenExpiresIn: '21d',
    serveStatic: '../frontend/app'
};
