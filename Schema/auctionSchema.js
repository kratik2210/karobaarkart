// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const auctionSchema = new Schema({
//     vehicleId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Vehicle',
//         required: true
//     },
//     scheduleStart: {
//         startTime: {
//             type: Date,
//             required: true
//         },
//         startDate: {
//             type: Date,
//             required: true
//         }
//     },
//     scheduleEnd: {
//         endTime: {
//             type: Date,
//             required: true
//         },
//         endDate: {
//             type: Date,
//             required: true
//         }
//     },
//     startingBid: {
//         type: Number,
//         required: true
//     },
//     currentBid: {
//         type: Number
//     },
//     highestBidder: {
//         type: Schema.Types.ObjectId,
//         ref: 'Dealer'
//     },
//     auctionStatus: {
//         type: String,
//         enum: ['ongoing', 'completed', 'cancelled']
//     },
//     createdBy: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedBy: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     },
//     isActive: {
//         type: Boolean,
//         default: true
//     }
// });

// const Auction = mongoose.model('Auction', auctionSchema);

// module.exports = Auction;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    startTime: {
        type: Date,
        required: true,

    }, endTime: {
        type: Date, required: true, validate: {
            validator: function (value) {
                return value > this.startTime;
            },
            message: 'End time must be greater than start time'
        }
    },
    startingBid: { type: Number, required: true },
    currentBid: { type: Number },
    highestBidder: { type: Schema.Types.ObjectId, ref: 'User' },
    auctionStatus: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

auctionSchema.index({ startTime: 1, endTime: 1 });

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;