const Logger = require('../logger/log.config')
const { API_RESP_CODES } = require('../common/error-codes')
// Common function to return api PARAM VALIDATION ERROR
exports.validateErrResp = function (res, err) {
    res.status(API_RESP_CODES.HTTP_BAD_REQUEST.status).send({
        status: API_RESP_CODES.APP_PARAM_ERROR.status,
        message: API_RESP_CODES.APP_PARAM_ERROR.message,
        data: { error: err },
    });
}

// Common function to return api INTERNAL SERVER ERROR
exports.internalErrResp = function (res, err, log) {
    Logger.error(` ${new Date()} ${log}:${err}`);
    res.status(API_RESP_CODES.HTTP_SERVER_ERR.status).send({
        status: API_RESP_CODES.HTTP_SERVER_ERR.status,
        message: API_RESP_CODES.HTTP_SERVER_ERR.message,
        data: { error: err },
    });
}

// Common function to return api INTERNAL SERVER ERROR
exports.apiValidResponse = function (res, _data) {
    console.log("_data", _data)
    res.status(API_RESP_CODES.HTTP_SUCCESS.status).send({
        status: API_RESP_CODES.HTTP_SUCCESS.status,
        message: API_RESP_CODES.HTTP_SUCCESS.message,
        data: _data,
    });
}

// Common function to return api INTERNAL SERVER ERROR
exports.apiInvalidValidResponse = function (res, _status, _msg, _data) {
    res.status(API_RESP_CODES.HTTP_UNAUTHORIZED.status).send({
        status: _status,
        message: _msg,
        data: _data,
    });
}

// Middleware function to handle try / catch block repetition
exports.asyncMiddlewareController = function (handler) {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (err) {
            Logger.error(` ${new Date()} "asyncMiddlewareController":${err}`);
            res.status(API_RESP_CODES.HTTP_SERVER_ERR.status).send({
                status: API_RESP_CODES.HTTP_SERVER_ERR.status,
                message: API_RESP_CODES.HTTP_SERVER_ERR.message,
                data: { error: err },
            });
        }
    };
}

const errorHandler = function (res, error) {
    console.log("🚀 ~ errorHandler ~ error:", error.message)
    res.status(API_RESP_CODES.HTTP_SERVER_ERR.status);
    res.json({ status: false, message: error.message, data: null });
}


module.exports = {
    errorHandler
};