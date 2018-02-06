module.exports = {
    port: 80,
    dbUrl: process.env.DB_URL_DEV,
    accessTokenSecretKey: 'mySecretKey',
    refreshTokenSecretKey: 'mySecretKey2',
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN_DEV,
    telegramChatId: process.env.TELEGRAM_CHAT_ID_DEV,
    accessTokenExpiresIn: '30d',
    refreshTokenExpiresIn: '30d',
    serveStatic: '../frontend/app'
};
