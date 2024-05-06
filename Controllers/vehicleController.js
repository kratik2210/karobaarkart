const Vehicle = require('../Schema/vehicleSchema');
const vehicleService = require('../Services/vehicle-service')
const _g = require('../Utils/GlobalFunctions');
const { errorHandler } = require('../Utils/common/api-middleware');
const { API_RESP_CODES, errorCodes, ErrorMessages } = require('../Utils/common/error-codes');
const { validateVehicle } = require('../Utils/common/validator');


// exports.createVehicle = async (req, res) => {
//     try {
//         const { brandId, modelName, modelYear, modelNumber, modelPrice, modelLocation, description, mileage, fuelType, loadingCapacity, insurance, kmsDriven, category, inquireStatus, tyreCondition, fitness, bodyType } = req.body;
//         const createdBy = req.user._id;
//         const modelCoverImage = req.files.modelCoverImage ? req.files.modelCoverImage[0].path
//             : null;

//         const multiImageIds = [];

//         if (req.files.modelMultiImages) {
//             const modelMultiImages = req.files.modelMultiImages;
//             for (const image of modelMultiImages) {
//                 multiImageIds.push(image.path);
//             }
//         }

//         const newVehicle = new Vehicle({
//             brandId,
//             modelName,
//             modelYear,
//             modelNumber,
//             modelPrice,
//             modelLocation,
//             description,
//             mileage,
//             fuelType,
//             loadingCapacity,
//             insurance,
//             kmsDriven,
//             category,
//             createdBy,
//             modelCoverImage: modelCoverImage,
//             modelMultiImages: multiImageIds,
//             inquireStatus,
//             tyreCondition,
//             fitness,
//             bodyType
//         });

//         const savedVehicle = await newVehicle.save();

//         res.status(201).json({
//             success: true,
//             message: 'Vehicle created successfully',
//             data: savedVehicle,
//         });
//     } catch (error) {
//         if (error.code === 11000 && error.keyPattern && error.keyValue) {
//             return res.status(400).json({ success: false, message: 'Key already present in the database,Unique key required', error: error.keyValue });
//         }
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };


exports.createVehicle = async (req, res) => {
    try {
        const { brandId, modelName, modelYear, modelNumber, modelPrice, modelLocation, description, mileage, fuelType, loadingCapacity, insurance, kmsDriven, category, inquireStatus, tyreCondition, fitness, bodyType } = req.body;

        const createdBy = req.user._id;
        const updatedBy = req.user._id;
        const modelCoverImage = req.files.modelCoverImage ? req.files.modelCoverImage[0].path : null;
        const multiImageIds = [];

        if (req.files.modelMultiImages) {
            const modelMultiImages = req.files.modelMultiImages;
            for (const image of modelMultiImages) {
                multiImageIds.push({ img: image.path });
            }
        }

        const { error } = validateVehicle({
            ...req.body,
            modelCoverImage: modelCoverImage,
            multiImageIds: multiImageIds,
            updatedBy,
            createdBy
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

        const formData = {
            ...req.body,
            modelCoverImage: modelCoverImage,
            multiImageIds: multiImageIds,
            updatedBy,
            createdBy
        }

        const result = await vehicleService.vehicleCreation(formData);


        let statusCode = API_RESP_CODES.VEHICLE_CREATION.status;
        let message = result.message;
        let data = result.data;


        if (result.message === ErrorMessages.BRAND_NOT_FOUND) {
            statusCode = 404
            message = ErrorMessages.BRAND_NOT_FOUND;
        }


        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });


    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
            return res.status(400).json({ success: false, message: 'Key already present in the database,Unique key required', error: error.keyValue });
        }

        errorHandler(res, error);
    }
};


exports.getVehicles = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const category = req.query.category;

        const skip = (page - 1) * limit;
        let vehicles = []

        if (!category) {
            vehicles = await Vehicle.find().populate('brandId').skip(skip)
                .limit(limit);
        } else {
            vehicles = await Vehicle.find({ category: category }).populate('brandId').skip(skip)
                .limit(limit);

        }

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


exports.sellStatus = async (req, res) => {
    try {
        const { sellStatus, vehicleId } = req.query;
        const userId = req.user._id
        if (!sellStatus || !vehicleId) {
            return res.status(400).json({ success: false, message: 'sellStatus and vehicleId are required' });
        }

        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: vehicleId },
            {
                sellStatus: sellStatus,
                updatedBy: userId
            },
            { new: true }
        ).populate('brandId');

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Status changed successfully',
            data: vehicle,
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};