exports.errorResponse = (res, message = 'Server error', code = 500) => {
    return res.status(code).json({
        status: 'error',
        message
    });
};

exports.successResponse = (res, data = {}, meta = {}, code = 200) => {
    return res.status(code).json({
        status: 'success',
        data,
        meta
    });
};
