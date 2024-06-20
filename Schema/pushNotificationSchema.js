const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pushNotificationSchema = new Schema({
    recipientIds: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    auctionId: {
        type: Schema.Types.ObjectId,
        ref: 'Auction'
    },
    type: {
        type: String,
        enum: ['auction_start', 'auction_end', 'bid_update', 'outbid'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    bidId: {
        type: Schema.Types.ObjectId,
        ref: 'Bid'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const PushNotification = mongoose.model('PushNotification', pushNotificationSchema);

module.exports = PushNotification;
