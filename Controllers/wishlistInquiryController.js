const _g = require("../Utils/GlobalFunctions");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const WishlistService = require("../Services/wishlist-service");
const { errorHandler } = require("../Utils/common/api-middleware");
const { validateWishlist } = require("../Utils/common/validator");

exports.addToWishlist = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        // const vehicleId = req.body.vehicleId;
        const { error } = validateWishlist({
            ...req.body
        });

        if (error) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: error.details[0].message,
                    data: null,
                });
        }

        const result = await WishlistService.addToWishlistService(req.body, userId);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.VEHICLE_EXIST.message) {
            message = API_RESP_CODES.VEHICLE_EXIST.message;
            statusCode = API_RESP_CODES.VEHICLE_EXIST.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})


exports.removeFromWishlist = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;


        const { error } = validateWishlist({
            ...req.body
        });

        if (error) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: error.details[0].message,
                    data: null,
                });
        }

        let result;

        result = await WishlistService.removeFromWishlistService(req.body, userId);

        let statusCode = errorCodes.DELETED_SUCCESS.Value;
        let message = '';

        if (result && result.success) {
            statusCode = 204;
            message = result.message || 'Vehicle removed from wishlist successfully';
        } else {
            statusCode = result && result.message === API_RESP_CODES.VEHICLE_NOT_EXIST.message ?
                API_RESP_CODES.VEHICLE_NOT_EXIST.status :
                errorCodes.DELETED_SUCCESS.Value;
            message = result && result.message || 'Vehicle removed from wishlist successfully';
        }

        res.status(200).json({ success: true, message: message, data: null });

    } catch (error) {
        errorHandler(res, error);
    }
})


exports.allWishlist = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await WishlistService.allWishlistService(userId);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.WISHLIST_EMPTY.message) {
            message = API_RESP_CODES.WISHLIST_EMPTY.message;
            statusCode = API_RESP_CODES.WISHLIST_EMPTY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})


exports.addToInquiry = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const { error } = validateWishlist({
            ...req.body
        });

        if (error) {

            return res
                .status(400)
                .json({
                    success: false,
                    message: error.details[0].message,
                    data: null,
                });
        }

        const result = await WishlistService.addToInquiryService(req.body, userId);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.VEHICLE_EXIST_INQUIRY.message) {
            message = API_RESP_CODES.VEHICLE_EXIST_INQUIRY.message;
            statusCode = API_RESP_CODES.VEHICLE_EXIST_INQUIRY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})


exports.allInquiry = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await WishlistService.allInquiryService(userId);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.INQUIRES_EMPTY.message) {
            message = API_RESP_CODES.INQUIRES_EMPTY.message;
            statusCode = API_RESP_CODES.INQUIRES_EMPTY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})