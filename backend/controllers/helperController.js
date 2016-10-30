exports.errorResponse = function (res, message, code) {
    return res.status(code || 500).json({
        status: 'error',
        message: message || 'Server error'
    });
};

exports.successResponse = function (res, data, code) {
    return res.status(code || 200).json({
        status: 'success',
        data: data || null
    });
};
