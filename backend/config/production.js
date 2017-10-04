module.exports = {
    port: process.env.PORT || 80,
    dbUrl: process.env.DB_URL_PROD,
    secretKey: process.env.SECRET_KEY,
    tokenExpiresIn: '2d',
    serveStatic: '../frontend/build'
};
