const Vehicle = require('../Schema/vehicleSchema');
const Auction = require('../Schema/auctionSchema');

exports.createAuction = async (req, res) => {
    try {
        const vehicleId = req.query.vehicleId
        const { startTime, endTime, startingBid } = req.body;

        // Find the vehicle by id
        const vehicle = await Vehicle.findById(vehicleId);

        // Check if the vehicle exists and sellStatus is 'auction'
        if (!vehicle || vehicle.sellStatus !== 'auction') {
            return res.status(400).json({ error: 'Invalid vehicle or sellStatus is not "auction"' });
        }

        // Create a new auction
        const newAuction = new Auction({
            vehicleId,
            startTime,
            endTime,
            startingBid,
            createdBy: req.user._id, // Assuming req.user._id contains the authenticated user id
        });

        // Save the auction
        const savedAuction = await newAuction.save();

        res.status(201).json({ message: 'Auction created successfully', data: savedAuction });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', data: error });
    }
};


exports.getAuctions = async (req, res) => {
    try {
        // Retrieve all auctions from the database
        const auctions = await Auction.find().populate('vehicleId').populate({
            path: 'vehicleId',
            populate: {
                path: 'brandId',
                model: 'Brand'
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

        if (!auctions) {
            return res.status(404).json({ message: 'No auctions found' });
        }

        res.status(200).json({ message: 'Auctions retrieved successfully', data: auctions });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', data: error });
    }
};