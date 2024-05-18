const { CronJob } = require('cron'); const _g = require('../Utils/GlobalFunctions');
const Vehicle = require('../Schema/vehicleSchema');
const Auction = require('../Schema/auctionSchema');
const moment = require('moment-timezone');

exports.createAuction = async (req, res) => {
    try {
        const vehicleId = req.query.vehicleId
        const { startTime, endTime, startingBid } = req.body;

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

        const timezone = 'Asia/Kolkata';
        const correctTime = moment().tz(timezone);
        const timezoneOffset = correctTime.utcOffset();
        const correctedStartTime = moment(savedAuction.startTime).tz(timezone).add(timezoneOffset, 'minutes').toDate();
        console.log("🚀 ~ exports.createAuction= ~ correctedStartTime:", correctedStartTime == savedAuction.startTime)


        if (correctedStartTime == savedAuction.startTime) {
            const job = new CronJob(correctedStartTime, async () => {
                const auction = await Auction.findById(savedAuction._id);
                console.log("🚀 ~ job ~ auction:", auction)
                if (auction) {
                    auction.auctionStatus = 'ongoing';
                    await auction.save();
                }
            });

            job.start();
        }



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



exports.singleLiveAuctionVehicle = _g.asyncMiddlewareController(async (req, res) => {
    try {
        const userId = req.user._id;
        const vehicleId = req.query.vehicleId

        const result = await auctionService.singleLiveAuctionService(vehicleId, userId);

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