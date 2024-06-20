const { default: mongoose } = require("mongoose");
const Vehicle = require("../Schema/vehicleSchema")
const Auction = require("../Schema/auctionSchema")
const User = require("../Schema/usersSchema")
const { API_RESP_CODES, ErrorMessages } = require('../Utils/common/error-codes');
const Bid = require("../Schema/bidSchema");
const logger = require('../Utils/logger/log.config');
const { getIO } = require("../Sockets/socket");
const moment = require('moment-timezone');
const { sendMessage } = require('../Utils/Fcm');


// const message = {
//     message: {
//         token: 'ecmsZXzqQnSGJuSK8BuPPZ:APA91bH20_VtkaRHvMK9dIA6ULsG4uycp8RlyQ269PNvwqrZyLt3QCAwsNRMx40ebxiqHC2jzDNdphil97QhCD8v6HTxV7rySbqivE1U1Tgl53LUyydqPRIyWc8T1wCRbWX7BQZjmToG',
//         notification: {
//             title: 'Test Notification',
//             body: 'This is a test notification'
//         }
//     }
// };

// sendMessage(message);
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


exports.placeBidModel = async (auctionId, userId, currentBid, isPaid) => {

    // if (!isPaid) {
    //     return { status: false, message: 'Bid cannot be placed because payment is not completed', data: null };
    // }
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


        const currentTimeMoment = moment().tz('Asia/Kolkata');
        const currentTimeNoOffset = currentTimeMoment.add(5, 'hours').add(30, 'minutes');

        const currentTime = currentTimeNoOffset.toDate();
        const endTime = oneAuction.endTime;
        if (currentTime > endTime) {
            return { status: false, message: 'Auction has ended', data: null };
        }


        // Check if the initial bid is greater than the starting bid
        if (!oneAuction.currentBid && currentBid <= oneAuction.startingBid) {
            io.to(auctionId).emit('bidError', { message: 'Initial bid must be higher than the starting bid' });

            return { status: false, message: 'Initial bid must be higher than the starting bid', data: null };
        }

        // Check if the new bid is higher than the current highest bid
        if (oneAuction.currentBid && currentBid <= oneAuction.currentBid) {
            io.to(auctionId).emit('bidError', { message: 'New bid must be higher than the current highest bid' });

            return { status: false, message: 'bid must be higher than the current highest bid', data: null };
        }





        // Create a new bid
        const bid = new Bid({ auctionId, bidderId: userId, currentBidAmount: currentBid });

        // bid.updatedAt = new Date(new Date(bid.updatedAt).getTime() - (5 * 60 + 30) * 60000);
        // bid.createdAt = new Date(new Date(bid.updatedAt).getTime() - (5 * 60 + 30) * 60000);

        await bid.save({ session });



        const twoMinutesBeforeEndTime = new Date(endTime.getTime() - 2 * 60 * 1000);
        if (currentTime >= twoMinutesBeforeEndTime && currentTime < endTime) {
            // Extend the end time by two minutes
            oneAuction.endTime = new Date(endTime.getTime() + 2 * 60 * 1000);
        }

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

        // const createdAt = new Date(new Date(bid.createdAt).getTime() - (5 * 60 + 30) * 60000);
        // const updatedAt = new Date(new Date(bid.updatedAt).getTime() - (5 * 60 + 30) * 60000);

        // for (const bid of allLatestBids) {
        //     bid.updatedAt = updatedAt;
        //     bid.createdAt = createdAt;
        // }

        await Promise.all(allLatestBids.map(bid => bid.save()));

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

        const allBidders = await Bid.find({ auctionId, bidderId: { $ne: userId } }).distinct('bidderId');

        const bidderTokens = await User.find({ _id: { $in: allBidders } }).distinct('fcm_token');

        // io.emit('joinRoom', { auctionId });
        io.to(auctionId).emit('newHighestBid', { auctionId, currentBid, highestBidder, totalBids, sortedBids });
        logger.info(`New Highest Bid: Auction ID: ${auctionId}, Current Bid: ${currentBid}, Highest Bidder: ${highestBidder.userName}`); // Log highest bid

        // const message = {
        //     message: {
        //         token: 'ecmsZXzqQnSGJuSK8BuPPZ:APA91bH20_VtkaRHvMK9dIA6ULsG4uycp8RlyQ269PNvwqrZyLt3QCAwsNRMx40ebxiqHC2jzDNdphil97QhCD8v6HTxV7rySbqivE1U1Tgl53LUyydqPRIyWc8T1wCRbWX7BQZjmToG',
        //         notification: {
        //             title: 'Test Notification',
        //             body: 'This is a test notification'
        //         }
        //     }
        // };
        for (const token of bidderTokens) {
            await sendMessage({ message: { token: token, notification: { title: 'New Bid', body: 'A new bid has been placed on the auction' } } });
        }

        await session.commitTransaction();

        return returnResult;
    } catch (error) {
        session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


