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
    wishlist: {
        type: Boolean,
        default: false,
    },
    inquiry: {
        type: Boolean,
        default: false,
    },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;