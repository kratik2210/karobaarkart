const csvtojsonV2 = require("csvtojson/v2");
const VehiclePricing = require('../Schema/vehiclePricingSchema');
const Vehicle = require('../Schema/vehicleSchema');
const vehicleService = require('../Services/vehicle-service')
const _g = require('../Utils/GlobalFunctions');
const { errorHandler } = require('../Utils/common/api-middleware');
const { API_RESP_CODES, errorCodes, ErrorMessages } = require('../Utils/common/error-codes');
const { validateVehicle, validateEditVehicle } = require('../Utils/common/validator');
const Brand = require("../Schema/brandSchema");
const Wishlist = require("../Schema/wishlistInquirySchema")

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
        const { brandId, modelName, modelYear, modelPrice, modelLocation, description, mileage, fuelType, loadingCapacity, insurance, kmsDriven, category, inquireStatus, tyreCondition, fitness, bodyType } = req.body;

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


// exports.getVehicles = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 6;
//         const category = req.query.category;
//         const sellStatus = req.query.sellStatus;

//         const skip = (page - 1) * limit;
//         let query = {};

//         if (category) {
//             query.category = category;
//         }
//         if (sellStatus) {
//             query.sellStatus = sellStatus;
//         }

//         let vehicles;
//         let totalCount;

//         if (Object.keys(query).length === 0) {
//             vehicles = await Vehicle.find().populate('brandId').skip(skip).limit(limit);
//             totalCount = await Vehicle.countDocuments();

//         } else {
//             vehicles = await Vehicle.find(query).populate('brandId').skip(skip).limit(limit);
//             totalCount = await Vehicle.countDocuments(query);

//         }

//         const totalPages = Math.ceil(totalCount / limit);


//         res.status(200).json({
//             success: true,
//             message: 'Vehicles retrieved successfully',
//             data: vehicles,
//             totalPages: totalPages,
//         });
//     } catch (error) {
//         console.error('Error fetching vehicles:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

exports.getVehicles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const category = req.query.category;
        const sellStatus = req.query.sellStatus;
        const skip = (page - 1) * limit;
        const userType = req.user.userType;
        console.log("🚀 ~ exports.getVehicles= ~ userType:", req.user)

        let query = {};

        if (category) {
            query.category = category;
        }
        if (sellStatus) {
            query.sellStatus = sellStatus;
        }

        let vehicles;
        let totalCount;

        // if (Object.keys(query).length === 0) {
        //     vehicles = await Vehicle.find().populate('brandId').populate({
        //         path: 'modelName',
        //         select: 'modelName _id',
        //     }).skip(skip).limit(limit);
        //     totalCount = await Vehicle.countDocuments();
        // } else {
        //     vehicles = await Vehicle.find(query).populate('brandId').populate({
        //         path: 'modelName',
        //         select: 'modelName _id',
        //     }).skip(skip).limit(limit);
        //     totalCount = await Vehicle.countDocuments(query);
        // }


        if (userType === 'admin') {
            // Admin gets all vehicles
            if (Object.keys(query).length === 0) {
                vehicles = await Vehicle.find()
                    .populate('brandId')
                    .populate({
                        path: 'modelName',
                        select: 'modelName _id',
                    })
                    .skip(skip)
                    .limit(limit);
                totalCount = await Vehicle.countDocuments();
            } else {
                vehicles = await Vehicle.find(query)
                    .populate('brandId')
                    .populate({
                        path: 'modelName',
                        select: 'modelName _id',
                    })
                    .skip(skip)
                    .limit(limit);
                totalCount = await Vehicle.countDocuments(query);
            }
        } else {
            // Non-admin users have specific access rules
            if (category === 'new') {
                // Return vehicles with category 'new' and sellStatus 'sell'
                vehicles = await Vehicle.find({ category: 'new', sellStatus: 'sell' })
                    .populate('brandId')
                    .populate({
                        path: 'modelName',
                        select: 'modelName _id',
                    })
                    .skip(skip)
                    .limit(limit);
                totalCount = await Vehicle.countDocuments({ category: 'new', sellStatus: 'sell' });
            } else if (category === 'used') {
                // Return vehicles with category 'used' and sellStatus 'used'
                vehicles = await Vehicle.find({ category: 'used', sellStatus: 'used' })
                    .populate('brandId')
                    .populate({
                        path: 'modelName',
                        select: 'modelName _id',
                    })
                    .skip(skip)
                    .limit(limit);
                totalCount = await Vehicle.countDocuments({ category: 'used', sellStatus: 'used' });
            } else {
                // Default behavior for non-admin users, show all vehicles matching other criteria
                if (Object.keys(query).length === 0) {
                    vehicles = await Vehicle.find()
                        .populate('brandId')
                        .populate({
                            path: 'modelName',
                            select: 'modelName _id',
                        })
                        .skip(skip)
                        .limit(limit);
                    totalCount = await Vehicle.countDocuments();
                }
            }
        }

        const totalPages = Math.ceil(totalCount / limit);



        let wishlistItems = await Wishlist.find({ userId: req.user._id });

        // Create a map to store vehicleId-wishlistStatus pairs
        const wishlistMap = new Map();
        wishlistItems.forEach(item => {
            wishlistMap.set(item.vehicleId.toString(), item.wishlist);
        });


        vehicles = vehicles && vehicles.map(vehicle => ({
            ...vehicle.toObject(), // Convert Mongoose document to plain JavaScript object
            wishlist: wishlistMap.has(vehicle._id.toString()) ? wishlistMap.get(vehicle._id.toString()) : false // Get wishlist status from the map
        }));

        res.status(200).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: vehicles,
            totalPages: totalPages,
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


// exports.importVehiclePricing = async (req, res) => {
//     try {
//         if (!req.files.excelFile[0]) {
//             return res.status(400).json({ success: false, message: 'No file uploaded' });
//         }
//         const data = await csvtojsonV2().fromFile(req.files.excelFile[0].path)

//         for (const row of data) {
//             const vehiclePricing = {
//                 brand: row.Brand,
//                 models: [{
//                     modelId: row.modelId,
//                     modelName: row.model,
//                     prices: [{
//                         '2010': row['2010'],
//                         '2011': row['2011'],
//                         '2012': row['2012'],
//                         '2013': row['2013'],
//                         '2014': row['2014'],
//                         '2015': row['2015'],
//                         '2016': row['2016'],
//                         '2017': row['2017'],
//                         '2018': row['2018'],
//                         '2019': row['2019'],
//                         '2020': row['2020'],
//                         '2021': row['2021'],
//                         '2022': row['2022'],
//                         '2023': row['2023'],
//                         '2024': row['2024'],
//                     }],
//                     insuranceValidity: {
//                         insuranceValid: row['insurance-valid'],
//                         insuranceInValid: row['insurance-notvalid']
//                     },
//                     fitness: {
//                         fitnessValid: row['fitness-valid'],
//                         fitnessInValid: row['fitness-notvalid']
//                     },
//                     tyreCondition: {
//                         '25%': row['tyre-25%'],
//                         '50%': row['tyre-50%'],
//                         '75%': row['tyre-75%'],
//                         '100%': row['tyre-100%'],
//                     },
//                     bodyTypes: {
//                         chassis: row.chassis,
//                         halfbody: row.halfbody,
//                         fullbody: row.fullbody,
//                         highbuild: row.highbuild,
//                         container: row.container,

//                     }
//                 }]
//             };
//             console.log("🚀 ~ exports.importVehiclePricing= ~ vehiclePricing:", vehiclePricing)

//             // Check if the brand already exists in the database
//             let existingData = await VehiclePricing.find({ brand: row.brand });

//             // If brand exists, append new model data to the existing data
//             if (existingData) {
//                 existingData.models.push(vehiclePricing.models[0]);
//                 await existingData.save();
//             } else {
//                 // Create a new document for the brand
//                 await VehiclePricing.create(vehiclePricing);
//             }
//         }

//         res.status(200).json({ success: true, message: 'Vehicle pricing data imported successfully' });
//     } catch (error) {
//         console.error('Error importing vehicle pricing data:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// exports.importVehiclePricing = async (req, res) => {
//     try {
//         if (!req.files.excelFile || !req.files.excelFile[0]) {
//             return res.status(400).json({ success: false, message: 'No file uploaded' });
//         }

//         const data = await csvtojsonV2().fromFile(req.files.excelFile[0].path);

//         for (const row of data) {
//             const requiredFields = ['brand', 'modelId', 'modelName', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', 'insuranceValid', 'insuranceInValid', 'fitnessValid', 'fitnessInValid', 'tyre-25%', 'tyre-50%', 'tyre-75%', 'tyre-100%', 'chassis', 'halfbody', 'fullbody', 'highbuild', 'container'];
//             const missingFields = requiredFields.filter(field => !Object.keys(row).includes(field));

//             if (missingFields.length > 0) {
//                 return res.status(400).json({ success: false, message: 'Missing required fields', missingFields });
//             }

//             try {
//                 // Validate the vehiclePricing object against the schema
//                 await VehiclePricing.validate(row);

//                 // Find the existing data
//                 let existingData = await VehiclePricing.findOne({ brand: row.brand });
//                 if (existingData) {
//                     // Check if the model exists
//                     let existingModel = await VehiclePricing.findOne({ modelId: row.modelId });
//                     if (existingModel) {
//                         let updated = false;
//                         for (const key in row) {
//                             let existingValue = String(existingModel[key]);
//                             let incomingValue = String(row[key]);
//                             if (existingValue !== incomingValue) {
//                                 existingModel[key] = row[key];
//                                 updated = true;
//                             }
//                         }
//                         // Save changes if any values are updated
//                         if (updated) {
//                             await existingModel.save();
//                         }
//                     } else {
//                         // If the model does not exist, create a new one
//                         await VehiclePricing.create(row);
//                     }
//                 } else {
//                     // If existing data does not exist, create a new document
//                     await VehiclePricing.create(row);
//                 }
//             } catch (validationError) {
//                 console.error('Validation error:', validationError);
//                 return res.status(400).json({ success: false, message: 'Validation error', errors: validationError.errors });
//             }
//         }

//         res.status(200).json({ success: true, message: 'Vehicle pricing data imported successfully' });
//     } catch (error) {
//         console.error('Error importing vehicle pricing data:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };


exports.importVehiclePricing = async (req, res) => {
    try {
        if (!req.files.excelFile || !req.files.excelFile[0]) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const data = await csvtojsonV2().fromFile(req.files.excelFile[0].path);

        for (const row of data) {
            const requiredFields = ['brand', 'modelId', 'modelName', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', 'insuranceValid', 'insuranceInValid', 'fitnessValid', 'fitnessInValid', 'tyre-25%', 'tyre-50%', 'tyre-75%', 'tyre-100%', 'chassis', 'halfbody', 'fullbody', 'highbuild', 'container'];
            const missingFields = requiredFields.filter(field => !Object.keys(row).includes(field));

            if (missingFields.length > 0) {
                return res.status(400).json({ success: false, message: 'Missing required fields', missingFields });
            }

            try {
                // Validate the vehiclePricing object against the schema
                await VehiclePricing.validate(row);

                // Check if the model exists
                let existingModel = await VehiclePricing.findOne({ brand: row.brand, modelId: row.modelId });
                if (existingModel) {
                    let updated = false;
                    for (const key in row) {
                        let existingValue = String(existingModel[key]);
                        let incomingValue = String(row[key]);
                        if (existingValue !== incomingValue) {
                            existingModel[key] = row[key];
                            updated = true;
                        }
                    }
                    // Save changes if any values are updated
                    if (updated) {
                        await existingModel.save();
                    }
                } else {
                    // If the model does not exist, create a new one
                    await VehiclePricing.create(row);
                }
            } catch (validationError) {
                console.error('Validation error:', validationError);
                return res.status(400).json({ success: false, message: 'Validation error', errors: validationError.errors });
            }
        }

        res.status(200).json({ success: true, message: 'Vehicle pricing data imported successfully' });
    } catch (error) {
        console.error('Error importing vehicle pricing data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



exports.postData = async (req, res, next) => {
    try {
        const dataToInsert = req.body;

        // Array to store the inserted documents
        const insertedDocs = [];

        // Iterate over each document in the request body
        for (const item of dataToInsert) {
            const { brand: brandName, ...otherData } = item;

            // Check if the brand exists in the brands collection
            let brandDocument = await Brand.findOne({ brandName });

            if (!brandDocument) {
                // If the brand doesn't exist, create a new brand document
                brandDocument = await Brand.create({ brandName });
            }

            // Use the _id of the brand document when inserting data into the vehiclePricing collection
            const insertedData = { brand: brandDocument._id, ...otherData };
            const insertedItem = await VehiclePricing.create(insertedData);
            insertedDocs.push(insertedItem);
        }

        res.status(200).json({ success: true, message: "Data inserted successfully", data: insertedDocs });
    } catch (error) {
        console.error("Data insertion error: ", error);
        res.status(400).json({ success: false, error: error.message, message: "Data insertion failed" });
    }
};

// exports.updateData = async (req, res, next) => {
//     try {
//         const jokes = req.body;
//         console.log("🚀 ~ router.post ~ req.body:", req.body)

//         const promises = jokes.map(async (item) => {
//             const res = await VehiclePricing.findByIdAndUpdate(item._id, {
//                 $set: { ...item },
//             });

//             return res;
//         });

//         Promise.all(promises)
//             .then(() =>
//                 res.json({ success: true, message: "jokes-bulk-update success" })
//             )
//             .catch((err) => res.status(400).json(err));
//     } catch (err) {
//         console.error("jokes-bulk-update error: ", err);
//         res.status(500).json({ success: false, message: "internal_server_error" });
//     }
// }


exports.updateData = async (req, res, next) => {
    try {
        const updatedData = req.body;
        const promises = [];

        // Iterate over each item in the updated data
        for (const item of updatedData) {
            const { brand: brandName, ...otherData } = item;

            // Check if the brand exists in the brands collection
            let brandDocument = await Brand.findOne({ brandName });

            // If brand doesn't exist, create a new brand
            if (!brandDocument) {
                brandDocument = await Brand.create({ brandName });
            }

            // Update the item with the brand ID
            const updatedItem = { ...otherData, brand: brandDocument._id };

            // Push the update operation into promises array
            promises.push(
                VehiclePricing.findByIdAndUpdate(item._id, { $set: updatedItem })
            );
        }

        // Wait for all update operations to complete
        await Promise.all(promises);

        res.json({ success: true, message: "Bulk update success" });
    } catch (error) {
        console.error("Bulk update error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



exports.readMany = (req, res) => {
    let query = req.query || {};

    VehiclePricing.find(query).populate('brand')
        .then(result => {
            res.status(200).send(result);
        })
        .catch(error => {
            console.log("Error in reading vehicle pricing data:", error.message || error);
            res.status(400).send(error);
        });
};


exports.getAllModelsRelatedToBrands = async (req, res) => {
    try {
        const { brandId } = req.query;

        const vehiclePricingData = await VehiclePricing.find({ brand: brandId }, { modelName: 1, _id: 1 });

        res.status(200).json({ success: true, message: 'Successfully fetched models related to brands', data: vehiclePricingData });
    } catch (error) {
        console.log("Error in reading vehicle pricing data:", error.message || error);
        res.status(400).json({ success: false, error: error.message || error });
    }
};

exports.sortVehicleByPrice = async (req, res) => {
    try {
        const { category } = req.query;

        let sortDirection = 1;
        if (req.query.sort === 'high') {
            sortDirection = -1;
        }
        if (req.query.sort === 'low') {
            sortDirection = 1;
        }

        const query = {
            category: category
        };

        let vehicles = await Vehicle.find(query)
            .sort({ modelPrice: sortDirection }).populate('brandId').populate({
                path: 'modelName',
                select: 'modelName _id',
            }).exec();

        if (!vehicles) {
            return res.status(200).json({ success: false, message: 'No vehicles found' });
        }

        const wishlistItems = await Wishlist.find({ userId: req.user._id });

        const wishlistMap = new Map();
        wishlistItems.forEach(item => {
            wishlistMap.set(item.vehicleId.toString(), item.wishlist);
        });


        vehicles = vehicles.map(vehicle => ({
            ...vehicle.toObject(),
            wishlist: wishlistMap.has(vehicle._id.toString()) ? wishlistMap.get(vehicle._id.toString()) : false
        }));

        res.status(200).json({ success: true, message: 'Vehicles retrieved successfully', data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', data: error });
    }
};



exports.editVehicle = async (req, res) => {
    try {
        const vehicleId = req.query.vehicleId
        const updatedBy = req.user._id;
        const modelCoverImage = req.files?.modelCoverImage ? req.files.modelCoverImage[0].path : null;
        const multiImageIds = [];

        if (req.files?.modelMultiImages) {
            const modelMultiImages = req.files?.modelMultiImages;
            for (const image of modelMultiImages) {
                multiImageIds.push({ img: image.path });
            }
        }

        const { error } = validateEditVehicle({
            ...req.body,
            modelCoverImage: modelCoverImage,
            multiImageIds: multiImageIds,
            updatedBy
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
            updatedBy
        }

        const result = await vehicleService.vehicleEditService(vehicleId, formData);


        let statusCode = API_RESP_CODES.VEHICLE_EDIT.status;
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







