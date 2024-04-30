const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    bucketStatus: {
        type: String,
        enum: ['wishlist', 'inquiry'],
    },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;