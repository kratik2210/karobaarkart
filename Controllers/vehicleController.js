const Vehicle = require('../Schema/vehicleSchema');
const vehicleService = require('../Services/vehicle-service')
const _g = require('../Utils/GlobalFunctions');
const { errorHandler } = require('../Utils/common/api-middleware');
const { API_RESP_CODES, errorCodes } = require('../Utils/common/error-codes')
exports.createVehicle = async (req, res) => {
    try {
        const { brandId, modelName, modelYear, modelNumber, modelPrice, modelLocation, description, mileage, fuelType, loadingCapacity, insurance, kmsDriven, category, inquireStatus, tyreCondition, fitness, bodyType } = req.body;

        const createdBy = req.user._id;
        const modelCoverImage = req.files.modelCoverImage ? req.files.modelCoverImage[0].path
            : null;

        const multiImageIds = [];

        if (req.files.modelMultiImages) {
            const modelMultiImages = req.files.modelMultiImages;
            for (const image of modelMultiImages) {
                multiImageIds.push(image.path);
            }
        }

        const newVehicle = new Vehicle({
            brandId,
            modelName,
            modelYear,
            modelNumber,
            modelPrice,
            modelLocation,
            description,
            mileage,
            fuelType,
            loadingCapacity,
            insurance,
            kmsDriven,
            category,
            createdBy,
            modelCoverImage: modelCoverImage,
            modelMultiImages: multiImageIds,
            inquireStatus,
            tyreCondition,
            fitness,
            bodyType
        });

        const savedVehicle = await newVehicle.save();

        res.status(201).json({
            success: true,
            message: 'Vehicle created successfully',
            data: savedVehicle,
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            return res.status(400).json({ success: false, message: 'Key already present in the database,Unique key required', error: error.keyValue });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.getVehicles = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;


        const vehicles = await Vehicle.find().populate('brandId').skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: vehicles,
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.vehiclesListing = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;
        const pagination = {
            page: page,
            limit: limit,
            skip: skip
        }

        const result = await vehicleService.vehicleListingService(userId, pagination);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.VEHICLE_LISTING_EMPTY.message) {
            message = API_RESP_CODES.VEHICLE_LISTING_EMPTY.message;
            statusCode = API_RESP_CODES.VEHICLE_LISTING_EMPTY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})


exports.singleVehicleBasedOnId = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const vehicleId = req.query.vehicleId

        const result = await vehicleService.singleVehicleService(vehicleId);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.VEHICLE_LISTING_EMPTY.message) {
            message = API_RESP_CODES.VEHICLE_LISTING_EMPTY.message;
            statusCode = API_RESP_CODES.VEHICLE_LISTING_EMPTY.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})

