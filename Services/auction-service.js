const Logger = require("../Utils/logger/log.config");
const AuctionModel = require('../Models/auction-model')

exports.singleLiveAuctionService = function (vehicleId, userId) {
    try {
        return AuctionModel.oneLiveAuctionVehicle(vehicleId, userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::singleLiveAuctionService:${error}`);
        throw error;
    }
}

