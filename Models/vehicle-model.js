const { default: mongoose } = require("mongoose");
const Vehicle = require("../Schema/vehicleSchema")
const _g = require('../Utils/GlobalFunctions');
const { API_RESP_CODES } = require('../Utils/common/error-codes')

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