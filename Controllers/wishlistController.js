const Users = require("../Schema/usersSchema");
const _g = require("../Utils/GlobalFunctions");
const { expectedParams } = require("../Utils/common/constants");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const { userSignUp, userLogin, validateUser } = require("../Utils/common/validator");
const { getMissingParams, generateOTP } = require("../Utils/common/sharedLib");
const { default: mongoose } = require("mongoose");
const WishlistService = require("../Services/wishlist-service");
const { ErrorMessages } = require("../Utils/common/error-codes");
const { errorHandler } = require("../Utils/common/api-middleware");

exports.addToWishlist = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        // const vehicleId = req.body.vehicleId;

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

