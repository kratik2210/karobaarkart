const { default: mongoose } = require("mongoose");
const Vehicle = require("../Schema/vehicleSchema")
const Auction = require("../Schema/auctionSchema")
const { API_RESP_CODES, ErrorMessages } = require('../Utils/common/error-codes')


exports.oneLiveAuction = async (auctionId, userId) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        let returnResult = { status: false, message: '', data: null };

        const isValidObjectIdUser = mongoose.Types.ObjectId.isValid(userId);
        const isValidObjectIdAuction = mongoose.Types.ObjectId.isValid(auctionId);

        if (!isValidObjectIdUser) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        if (!isValidObjectIdAuction) {
            return { status: false, message: 'Invalid vehicle ID format', data: null };
        }

        const oneAuction = await Auction.find({ _id: auctionId }).populate('vehicleId').populate({
            path: 'vehicleId',
            populate: {
                path: 'brandId',
                model: 'Brand',
                select: 'brandName _id',
            }
        })
            .populate({
                path: 'vehicleId',
                populate: {
                    path: 'modelName',
                    model: 'VehiclePricing',
                    select: 'modelName _id',
                }
            });

        if (!oneAuction) {
            return { status: false, message: API_RESP_CODES.ONE_AUCTION_NOT_FOUND.message, data: null };
        }

        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = API_RESP_CODES.ONE_AUCTION_FOUND.message
        returnResult.data = oneAuction;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}