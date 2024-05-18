const { default: mongoose } = require("mongoose");
const Vehicle = require("../Schema/vehicleSchema")
const Auction = require("../Schema/auctionSchema")
const { API_RESP_CODES, ErrorMessages } = require('../Utils/common/error-codes')


exports.oneLiveAuctionVehicle = async (userId, pagination) => {

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