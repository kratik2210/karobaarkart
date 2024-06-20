
const _g = require("../Utils/GlobalFunctions");
const { errorCodes, API_RESP_CODES } = require("../Utils/common/error-codes");
const SearchService = require("../Services/search-services");
const { errorHandler } = require("../Utils/common/api-middleware");
const { validateSearchWishlistInquiry, validateSearchVehicle } = require("../Utils/common/validator");
const { default: mongoose } = require("mongoose");
const Vehicle = require("../Schema/vehicleSchema");
const Wishlist = require("../Schema/wishlistInquirySchema");

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
        const brandId = req.query.brandId
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
        const minPrice = req.query.minPrice
        const maxPrice = req.query.maxPrice
        const category = req.query.category
        const result = await SearchService.filterByPriceRangeService(minPrice, maxPrice, userId, category);

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


exports.filterVehicles = async (req, res) => {
    try {
        const { brandId, fuelType, seatingCapacity, loadingCapacity, minPrice, maxPrice } = req.query;
        const { category } = req.query;

        let returnResult = { status: false, message: '', data: null };

        let query = { category: category };
        if (brandId) {
            const isValidObjectId = mongoose.Types.ObjectId.isValid(brandId);
            if (!isValidObjectId) {
                return res.status(400).json({ status: false, message: 'Invalid brand ID format', data: null });
            }
            query.brandId = brandId;
        }

        if (fuelType) query.fuelType = fuelType;
        if (seatingCapacity) query.seatingCapacity = seatingCapacity;
        if (loadingCapacity) query.loadingCapacity = loadingCapacity;
        if (minPrice && maxPrice) {
            query.modelPrice = { $gte: minPrice, $lte: maxPrice };
        }

        // Remove undefined or null fields from the query object
        Object.keys(query).forEach(key => query[key] == null && delete query[key]);

        let filteredVehicles = await Vehicle.find(query).populate('brandId').exec();

        const wishlistItems = await Wishlist.find({ userId: req.user._id });

        // Create a map to store vehicleId-wishlistStatus pairs
        const wishlistMap = new Map();
        wishlistItems.forEach(item => {
            wishlistMap.set(item.vehicleId.toString(), item.wishlist);
        });


        filteredVehicles = filteredVehicles.map(vehicle => ({
            ...vehicle.toObject(),
            wishlist: wishlistMap.has(vehicle._id.toString()) ? wishlistMap.get(vehicle._id.toString()) : false
        }));



        if (filteredVehicles.length === 0) {
            return res.status(200).json({ status: true, message: 'No vehicles found with the specified filters', data: null });
        }

        return res.status(200).json({ status: true, message: 'Filtered successfully', data: filteredVehicles });
    } catch (error) {
        console.error('Error filtering vehicles:', error);
        return res.status(500).json({ status: false, message: 'Internal server error', data: null });
    }
};

