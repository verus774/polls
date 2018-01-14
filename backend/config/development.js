module.exports = {
    port: 80,
    dbUrl: process.env.DB_URL_DEV,
    accessTokenSecretKey: 'mySecretKey',
    refreshTokenSecretKey: 'mySecretKey2',
    accessTokenExpiresIn: '30s',
    refreshTokenExpiresIn: '30d',
    serveStatic: '../frontend/app'
};
