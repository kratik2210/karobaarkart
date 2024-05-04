
const _g = require("../Utils/GlobalFunctions");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const SearchService = require("../Services/search-services");
const { errorHandler } = require("../Utils/common/api-middleware");
const { validateSearchWishlistInquiry, validateSearchVehicle } = require("../Utils/common/validator");

exports.searchWishlistInquires = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;


        const { error } = validateSearchWishlistInquiry({
            ...req.query
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


        const result = await SearchService.searchWishlistInquiryService(req.query.searchTerm, userId, req.query.type);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.SEARCH_EMPTY.message) {
            message = API_RESP_CODES.SEARCH_EMPTY.message;
            statusCode = API_RESP_CODES.SEARCH_EMPTY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})


exports.searchVehicles = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;

        const { error } = validateSearchVehicle({
            ...req.query
        })


        if (error) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: error.details[0].message,
                    data: null,
                });
        }


        const result = await SearchService.searchVehicleService(req.query.searchTerm, userId, req.query.type);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.SEARCH_EMPTY.message) {
            message = API_RESP_CODES.SEARCH_EMPTY.message;
            statusCode = API_RESP_CODES.SEARCH_EMPTY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})


exports.filterBrand = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const brandId = req.body.brandId
        const result = await SearchService.filterBrandService(userId, req.query.type, brandId);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.SEARCH_EMPTY.message) {
            message = API_RESP_CODES.SEARCH_EMPTY.message;
            statusCode = API_RESP_CODES.SEARCH_EMPTY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})


exports.filterPriceRange = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const minPrice = req.body.minPrice
        const maxPrice = req.body.maxPrice
        const result = await SearchService.filterByPriceRangeService(minPrice, maxPrice, userId);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.SEARCH_EMPTY.message) {
            message = API_RESP_CODES.SEARCH_EMPTY.message;
            statusCode = API_RESP_CODES.SEARCH_EMPTY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})