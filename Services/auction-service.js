const Logger = require("../Utils/logger/log.config");
const AuctionModel = require('../Models/auction-model')

exports.singleLiveAuctionService = function (auctionId, userId) {
    try {
        return AuctionModel.oneLiveAuction(auctionId, userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::singleLiveAuctionService:${error}`);
        throw error;
    }
}

