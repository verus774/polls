module.exports = {
    port: process.env.PORT || 80,
    dbUrl: process.env.DB_URL,
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    accessTokenExpiresIn: '20m',
    refreshTokenExpiresIn: '30d',
    serveStatic: '../frontend/build'
};
