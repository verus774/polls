module.exports = {
    port: process.env.PORT || 80,
    dbUrl: process.env.DB_URL,
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    accessTokenExpiresIn: '2d',
    refreshTokenExpiresIn: '60d',
    serveStatic: '../frontend/build'
};
