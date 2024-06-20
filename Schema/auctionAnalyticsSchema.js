const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionAnalyticsSchema = new Schema({
    auctionId: {
        type: Schema.Types.ObjectId,
        ref: 'Auction'
    },
    bidCount: {
        type: Number,
        default: 0
    },
    totalBids: {
        type: Number,
        default: 0
    },
    averageBidAmount: {
        type: Number,
        default: 0
    },
    auctionDuration: {
        type: Number,
        default: 0
    }
});

const AuctionAnalytics = mongoose.model('AuctionAnalytics', auctionAnalyticsSchema);

module.exports = AuctionAnalytics;
