const { CronJob } = require('cron');
const _g = require('../Utils/GlobalFunctions');
const Vehicle = require('../Schema/vehicleSchema');
const Auction = require('../Schema/auctionSchema');
const moment = require('moment-timezone');
const AuctionService = require('../Services/auction-service');
const { errorCodes, API_RESP_CODES } = require('../Utils/common/error-codes');
const { errorHandler } = require('../Utils/common/api-middleware');
const { validateAuctionData } = require('../Utils/common/validator');

exports.createAuction = async (req, res) => {
    try {
        const vehicleId = req.query.vehicleId
        const { startTime, endTime, startingBid, rating } = req.body;

        const { error } = validateAuctionData({ startTime, endTime, startingBid, rating });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }


        const vehicle = await Vehicle.findById(vehicleId);

        if (!vehicle || vehicle.sellStatus !== 'auction') {
            return res.status(400).json({ error: 'Invalid vehicle or sellStatus is not "auction"' });
        }

        const newAuction = new Auction({
            vehicleId,
            startTime,
            endTime,
            startingBid,
            createdBy: req.user._id,
        });

        const savedAuction = await newAuction.save();

        vehicle.rating = rating;
        await vehicle.save();



        const timezone = 'Asia/Kolkata';
        const correctTime = moment().tz(timezone);
        const timezoneOffset = correctTime.utcOffset();
        const correctedStartTime = moment(savedAuction.startTime).tz(timezone).add(timezoneOffset, 'minutes').toDate();
        const adjustedTime = new Date(new Date(savedAuction.startTime).getTime() - (5 * 60 + 30) * 60000);

        const job = new CronJob(adjustedTime, async () => {
            const auction = await Auction.findById(savedAuction._id);
            if (auction) {
                auction.auctionStatus = 'ongoing';
                await auction.save();
            }
        });

        job.start();

        res.status(201).json({ message: 'Auction created successfully', data: savedAuction });
    } catch (error) {
        console.log("🚀 ~ exports.createAuction= ~ error:", error)
        res.status(500).json({ error: 'Internal server error', data: error });
    }
};


exports.getAuctions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const [auctions, totalAuctionsCount] = await Promise.all([
            Auction.find()
                .populate('vehicleId')
                .populate({
                    path: 'vehicleId',
                    populate: { path: 'brandId', model: 'Brand' }
                })
                .populate({
                    path: 'vehicleId',
                    populate: { path: 'modelName', model: 'VehiclePricing', select: 'modelName _id' }
                })
                .skip(skip)
                .limit(limit),
            Auction.countDocuments()
        ]);

        if (!auctions) {
            return res.status(404).json({ success: false, message: 'No auctions found' });
        }

        const totalPages = Math.ceil(totalAuctionsCount / limit);

        res.status(200).json({ success: true, message: 'Auctions retrieved successfully', data: auctions, totalPages });
    } catch (error) {
        res.status(500).json({
            success: false, error: 'Internal server error', data: error
        });
    }
};



exports.singleLiveAuction = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const auctionId = req.query.auctionId

        const result = await AuctionService.singleLiveAuctionService(auctionId, userId);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.ONE_AUCTION_NOT_FOUND.message) {
            message = API_RESP_CODES.ONE_AUCTION_NOT_FOUND.message;
            statusCode = API_RESP_CODES.ONE_AUCTION_NOT_FOUND.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})



exports.placeBid = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const auctionId = req.query.auctionId
        const currentBid = req.body.currentBid

        const result = await AuctionService.placeBidService(auctionId, userId, currentBid);

        let statusCode = errorCodes.SUCCESS.Value;
        let message = result.message;
        let data = result.data;


        if (result.message === API_RESP_CODES.ONE_AUCTION_NOT_FOUND.message) {
            message = API_RESP_CODES.ONE_AUCTION_NOT_FOUND.message;
            statusCode = API_RESP_CODES.ONE_AUCTION_NOT_FOUND.status;
        }

        res.status(statusCode)
            .json({ success: result.status, message: message, data: data });

    } catch (error) {
        errorHandler(res, error);
    }
})


