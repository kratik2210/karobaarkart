const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const bidSchema = new Schema({
    auctionId: {
        type: Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    bidderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentBidAmount: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: () => moment().utcOffset('-05:30').toDate()
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: () => moment().utcOffset('-05:30').toDate()
    }
})

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
