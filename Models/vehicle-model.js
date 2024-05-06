const { default: mongoose } = require("mongoose");
const Vehicle = require("../Schema/vehicleSchema")
const Brands = require('../Schema/brandSchema');
const _g = require('../Utils/GlobalFunctions');
const { API_RESP_CODES, ErrorMessages } = require('../Utils/common/error-codes')


exports.createVehicle = async (formData) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const {
            brandId, modelName, modelYear, modelNumber, modelPrice, modelLocation, description, mileage, fuelType, loadingCapacity, insurance, kmsDriven, category, inquireStatus, tyreCondition, fitness, bodyType, modelCoverImage, multiImageIds, createdBy,
            updatedBy
        } = formData;


        let returnResult = { status: false, message: '', data: null };

        const brand = await Brands.findOne({ _id: brandId })

        if (!brand) {
            returnResult.message = ErrorMessages.BRAND_NOT_FOUND;
            return returnResult;
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
            bodyType,
            updatedBy
        });

        const savedVehicle = await newVehicle.save();

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

        const allVehicleListings = await Vehicle.find({ createdBy: userId }).populate('brandId').skip(skip)
            .limit(limit);

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