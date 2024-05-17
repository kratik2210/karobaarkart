// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const auctionScheduleSchema = new Schema({
//     auctionId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auction'
//     },
//     startTime: {
//         type: Date,
//         required: true
//     },
//     startDate: {
//         type: Date,
//         required: true
//     },
//     endTime: {
//         type: Date,
//         required: true
//     },
//     endDate: {
//         type: Date,
//         required: true
//     }
// });

// const AuctionSchedule = mongoose.model('AuctionSchedule', auctionScheduleSchema);

// module.exports = AuctionSchedule;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionScheduleSchema = new Schema({
    startTime: { type: Date, required: true },
    endTime: {
        type: Date, required: true, validate: {
            validator: function (value) {
                return value > this.startTime;
            },
            message: 'End time must be greater than start time'
        }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

auctionScheduleSchema.index({ startTime: 1, endTime: 1 });

const AuctionSchedule = mongoose.model('AuctionSchedule', auctionScheduleSchema);

module.exports = AuctionSchedule;