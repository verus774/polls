exports.errorResponse = (res, message = 'Server error', code = 500) => {
    return res.status(code).json({
        status: 'error',
        message
    });
};

exports.successResponse = (res, data = null, meta = {}, code = 200) => {
    if (Array.isArray(data) && data.length === 0) {
        return this.errorResponse(res, 'Items not found', 404);
    }

    return res.status(code).json({
        status: 'success',
        data,
        meta
    });
};
