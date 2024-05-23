const { default: mongoose } = require("mongoose");
const Vehicle = require("../Schema/vehicleSchema")
const Auction = require("../Schema/auctionSchema")
const { API_RESP_CODES, ErrorMessages } = require('../Utils/common/error-codes');
const Bid = require("../Schema/bidSchema");

const { getIO } = require("../Sockets/socket");


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
            return { status: false, message: 'Invalid auction ID format', data: null };
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
            }).populate({
                path: 'highestBidder',
                model: 'User',
                select: 'userName address',
            })

        const totalBids = await Bid.countDocuments({ auctionId });
        const allLatestBids = await Bid.find({ auctionId })
            .populate({
                path: 'bidderId',
                model: 'User',
                select: 'userName address',
            })
            .sort({ createdAt: -1 })
            .limit(8)


        const sortedBids = allLatestBids


        console.log(sortedBids, 'sortedBids');


        if (!oneAuction || oneAuction.length === 0) {
            return { status: false, message: API_RESP_CODES.ONE_AUCTION_NOT_FOUND.message, data: null };
        }


        let mergedData
        if (oneAuction[0]) {
            mergedData = {
                ...oneAuction[0].toObject(),
                totalBids: totalBids,
                sortedBids: sortedBids
            };
        } else {
            mergedData = {
                ...oneAuction,
                totalBids: totalBids,
                sortedBids: sortedBids
            };
        }



        await session.commitTransaction();

        returnResult.status = true;
        returnResult.message = API_RESP_CODES.ONE_AUCTION_FOUND.message
        returnResult.data = mergedData;


        return returnResult;

    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
}


exports.placeBidModel = async (auctionId, userId, currentBid) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const io = getIO();

        let returnResult = { status: false, message: '', data: null };
        const isValidObjectIdUser = mongoose.Types.ObjectId.isValid(userId);
        const isValidObjectIdAuction = mongoose.Types.ObjectId.isValid(auctionId);

        if (!isValidObjectIdUser) {
            return { status: false, message: 'Invalid user ID format', data: null };
        }

        if (!isValidObjectIdAuction) {
            return { status: false, message: 'Invalid auction ID format', data: null };
        }

        const oneAuction = await Auction.findOne({ _id: auctionId }).session(session);

        if (!oneAuction) {
            return { status: false, message: API_RESP_CODES.ONE_AUCTION_NOT_FOUND.message, data: null };
        }

        // Check if the initial bid is greater than the starting bid
        if (!oneAuction.currentBid && currentBid <= oneAuction.startingBid) {
            io.to(auctionId).emit('bidError', { message: 'Initial bid must be higher than the starting bid' });

            return { status: false, message: 'Initial bid must be higher than the starting bid', data: null };
        }

        // Check if the new bid is higher than the current highest bid
        if (oneAuction.currentBid && currentBid <= oneAuction.currentBid) {
            io.to(auctionId).emit('bidError', { message: 'New bid must be higher than the current highest bid' });

            return { status: false, message: 'New bid must be higher than the current highest bid', data: null };
        }

        // Create a new bid
        const bid = new Bid({ auctionId, bidderId: userId, currentBidAmount: currentBid });
        await bid.save({ session });

        const populatedBid = await bid.populate({
            path: 'bidderId',
            model: 'User',
            select: 'userName address ',
        })

        const totalBids = await Bid.countDocuments({ auctionId }) + 1;
        const allLatestBids = await Bid.find({ auctionId })
            .populate({
                path: 'bidderId',
                model: 'User',
            })
            .sort({ createdAt: -1 })
            .limit(8)


        const sortedBids = [bid, ...allLatestBids]

        const highestBidder = {
            _id: populatedBid.bidderId._id,
            userName: populatedBid.bidderId.userName,
            address: populatedBid.bidderId.address
        };


        oneAuction.currentBid = currentBid;
        oneAuction.highestBidder = userId;
        await oneAuction.save({ session });

        returnResult.status = true;
        returnResult.message = API_RESP_CODES.ONE_AUCTION_FOUND.message;
        returnResult.data = oneAuction;


        // io.emit('joinRoom', { auctionId });
        io.to(auctionId).emit('newHighestBid', { auctionId, currentBid, highestBidder, totalBids, sortedBids });

        await session.commitTransaction();

        return returnResult;
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


