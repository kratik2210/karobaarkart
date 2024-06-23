const { default: mongoose } = require("mongoose");
const Vehicle = require("../Schema/vehicleSchema")
const Brands = require('../Schema/brandSchema');
const VehiclePricing = require('../Schema/vehiclePricingSchema');
const _g = require('../Utils/GlobalFunctions');
const { API_RESP_CODES, ErrorMessages } = require('../Utils/common/error-codes')


exports.createVehicle = async (formData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const {
            brandId, modelName, modelYear, modelNumber, modelPrice, modelLocation, description, mileage, fuelType, loadingCapacity, insurance, kmsDriven, category, inquireStatus, tyreCondition, fitness, bodyType, modelCoverImage, multiImageIds, createdBy, seatingCapacity,
            updatedBy, contactNumber

        } = formData;
        console.log("🚀 ~ exports.createVehicle= ~ formData:", insurance, fitness)




        let returnResult = { status: false, message: '', data: null };

        const brand = await Brands.findOne({ _id: brandId })

        if (!brand) {
            returnResult.message = ErrorMessages.BRAND_NOT_FOUND;
            return returnResult;
        }

        // const fitnessBoolean = fitness == 'valid' ? true : false

        // const insuranceBoolean = insurance == 'valid' ? true : false

        const newVehicle = new Vehicle({
            brandId,
            modelName,
            modelYear,
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
            bodyType,
            updatedBy,
            contactNumber,
            seatingCapacity
        });


        const savedVehicle = await newVehicle.save();

        const vehiclePricing = await VehiclePricing.findOne({ _id: modelName });

        if (!vehiclePricing) {
            returnResult.message = ErrorMessages.VEHICLE_PRICING_NOT_FOUND;
            return returnResult;
        }

        let adjustedPrice = vehiclePricing[savedVehicle?.modelYear];



        adjustedPrice -= vehiclePricing[savedVehicle?.insurance == true ? `insuranceValid` : `insuranceInValid`];

        adjustedPrice -= vehiclePricing[savedVehicle.fitness == true ? `fitnessValid` : `fitnessInValid`];

        if (savedVehicle?.bodyType) {
            adjustedPrice -= vehiclePricing[savedVehicle?.bodyType];
        }

        if (savedVehicle?.tyreCondition) {
            adjustedPrice -= vehiclePricing[`tyre-${savedVehicle?.tyreCondition}`];
        }

        savedVehicle.modelPrice = Number(adjustedPrice);
        await savedVehicle.save();



        returnResult.status = true;
        returnResult.message = API_RESP_CODES.VEHICLE_CREATION.message;
        returnResult.data = savedVehicle;
        await session.commitTransaction();
        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}





exports.getAllVehicleListing = async (userId, pagination) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const {
            page, limit, skip
        } = pagination

        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);

        if (!isValidObjectId) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        const allVehicleListings = await Vehicle.find({ createdBy: userId }).populate('brandId').populate({
            path: 'modelName',
            select: 'modelName _id',
        });

        if (!allVehicleListings) {
            return { status: false, message: API_RESP_CODES.VEHICLE_LISTING_EMPTY.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = API_RESP_CODES.VEHICLE_LISTING_SUCCESS.message
        returnResult.data = allVehicleListings;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


exports.getSingleVehicle = async (vehicleId) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        let returnResult = { status: false, message: '', data: null };

        const isValidObjectId = mongoose.Types.ObjectId.isValid(vehicleId);

        if (!isValidObjectId) {
            return { status: false, message: 'Invalid vehicle ID format', data: null };
        }


        const oneVehicle = await Vehicle.findById(vehicleId);

        if (!oneVehicle) {
            return { status: false, message: API_RESP_CODES.VEHICLE_CANT_B_F.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = API_RESP_CODES.VEHICLE_CAN_BE_F.message
        returnResult.data = oneVehicle;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


exports.editVehicleModel = async (vehicleId, formData) => {
    console.log("🚀 ~ exports.editVehicleModel= ~ formData:", formData)
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let returnResult = { status: false, message: '', data: null };

        // Find existing vehicle
        const existingVehicle = await Vehicle.findById(vehicleId).session(session);
        if (!existingVehicle) {
            returnResult.message = ErrorMessages.VEHICLE_NOT_FOUND;
            return returnResult;
        }

        // Check if brand exists if brandId is provided
        if (formData.brandId) {
            const brand = await Brands.findOne({ _id: formData.brandId }).session(session);
            if (!brand) {
                returnResult.message = ErrorMessages.BRAND_NOT_FOUND;
                return returnResult;
            }
        }

        // Update fields only if they are provided in formData
        // Object.keys(formData).forEach(field => {
        //     if (formData[field] !== undefined) {
        //         existingVehicle[field] = formData[field];
        //     }
        // });

        Object.keys(formData).forEach(field => {
            if (formData[field] !== undefined) {
                if (field !== 'modelMultiImages' && field !== 'modelCoverImage') {
                    existingVehicle[field] = formData[field];
                }
            }
        });

        if (formData.modelCoverImage !== null && formData.modelCoverImage !== undefined) {
            existingVehicle.modelCoverImage = formData.modelCoverImage;
        }

        // Update modelMultiImages if new images are provided
        if (formData.multiImageIds) {

            // Convert array of image URLs to array of objects with _id and img properties
            const images = formData?.multiImageIds?.map(imageUrl => ({
                _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for each image
                img: imageUrl.img
            }));

            // If existing images exist, add new images to the array
            if (existingVehicle.modelMultiImages && existingVehicle.modelMultiImages.length > 0) {
                existingVehicle.modelMultiImages.push(...images);
            } else {
                // If no existing images, set the modelMultiImages field to the new array
                existingVehicle.modelMultiImages = images;
            }
        }


        if (formData.fitness === 'valid') {
            existingVehicle.fitness = true;
        } else {
            existingVehicle.fitness = false;
        }

        if (formData.insurance === 'valid') {
            existingVehicle.insurance = true;
        } else {
            existingVehicle.insurance = false;
        }
        const updatedVehicle = await existingVehicle.save();

        if (formData.modelName || formData.modelYear || formData.insurance || formData.fitness || formData.bodyType || formData.tyreCondition) {
            const vehiclePricing = await VehiclePricing.findOne({ _id: updatedVehicle.modelName }).session(session);
            if (!vehiclePricing) {
                returnResult.message = ErrorMessages.VEHICLE_PRICING_NOT_FOUND;
                return returnResult;
            }

            let adjustedPrice = vehiclePricing[updatedVehicle.modelYear];
            adjustedPrice -= vehiclePricing[updatedVehicle.insurance ? `insuranceValid` : `insuranceInValid`];
            adjustedPrice -= vehiclePricing[updatedVehicle.fitness ? `fitnessValid` : `fitnessInValid`];

            if (updatedVehicle.bodyType) {
                adjustedPrice -= vehiclePricing[updatedVehicle.bodyType];
            }

            if (updatedVehicle.tyreCondition) {
                adjustedPrice -= vehiclePricing[`tyre-${updatedVehicle.tyreCondition}`];
            }

            updatedVehicle.modelPrice = Number(adjustedPrice);
            await updatedVehicle.save();
        }

        returnResult.status = true;
        returnResult.message = API_RESP_CODES.VEHICLE_EDIT.message;
        returnResult.data = updatedVehicle;
        await session.commitTransaction();
        return returnResult;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}

