// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const moment = require('moment-timezone');


// const dateString = moment().tz('Asia/Kolkata').format(); // Output: 2024-05-29T23:23:34+05:30
// const dateObject = new Date(dateString.replace(/\+.*/, ''));


// const bidSchema = new Schema({
//     auctionId: {
//         type: Schema.Types.ObjectId,
//         ref: 'Auction',
//         required: true
//     },
//     bidderId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     currentBidAmount: {
//         type: Number,
//         required: true
//     },
//     createdBy: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     createdAt: {
//         type: Date,
//         default: dateObject
//     },
//     updatedBy: {
//         type: Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     updatedAt: {
//         type: Date,
//         default: dateObject
//     }
// })
// console.log(dateObject, 'moment().format()')

// const Bid = mongoose.model('Bid', bidSchema);

// module.exports = Bid;


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
        default: function () {
            return (moment().tz('Asia/Kolkata').add(5, 'hours').add(30, 'minutes')).toDate()
        }
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: function () {
            return (moment().tz('Asia/Kolkata').add(5, 'hours').add(30, 'minutes')).toDate()
        }
    }
});



const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
