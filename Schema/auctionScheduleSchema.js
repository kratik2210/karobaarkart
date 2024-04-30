const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionScheduleSchema = new Schema({
    auctionId: {
        type: Schema.Types.ObjectId,
        ref: 'Auction'
    },
    startTime: {
        type: Date,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

const AuctionSchedule = mongoose.model('AuctionSchedule', auctionScheduleSchema);

module.exports = AuctionSchedule;
