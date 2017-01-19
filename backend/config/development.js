module.exports = {
    port: process.env.PORT || 80,
    dbUrl: process.env.DB_URL || 'mongodb://<username>:<password>@<host>:<port>/<db_name>',
    secretKey: process.env.SECRET_KEY || 'mySecretKey',
    tokenExpiresIn: '21d'
};
