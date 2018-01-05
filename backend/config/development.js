module.exports = {
    port: 80,
    dbUrl: process.env.DB_URL_DEV,
    accessTokenSecretKey: 'mySecretKey',
    refreshTokenSecretKey: 'mySecretKey2',
    accessTokenExpiresIn: '21d',
    refreshTokenExpiresIn: '60d',
    serveStatic: '../frontend/app'
};
