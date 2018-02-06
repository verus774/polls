const config = require('../config');
const http = require('axios');
const helper = require('./helperController');

exports.sendMessage = async (req, res) => {
    const token = config.telegramBotToken;
    const chat = config.telegramChatId;

    const msg = encodeURI(req.body.text);
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat}&parse_mode=html&text=${msg}`;

    try {
        await http.post(url);
        return helper.successResponse(res);
    } catch (err) {
        const {statusText, status} = err.response;
        return helper.errorResponse(res, statusText, status);
    }
};
