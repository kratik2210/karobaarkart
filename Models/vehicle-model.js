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


        let returnResult = { status: false, message: '', data: null };

        const brand = await Brands.findOne({ _id: brandId })

        if (!brand) {
            returnResult.message = ErrorMessages.BRAND_NOT_FOUND;
            return returnResult;
        }

        const fitnessBoolean = fitness == 'valid' ? true : false

        const insuranceBoolean = insurance == 'valid' ? true : false

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
            insurance: insuranceBoolean,
            kmsDriven,
            category,
            createdBy,
            modelCoverImage: modelCoverImage,
            modelMultiImages: multiImageIds,
            inquireStatus,
            tyreCondition,
            fitness: fitnessBoolean,
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