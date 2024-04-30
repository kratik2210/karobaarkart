const Logger = require("../Utils/logger/log.config");
const WishlistModel = require('../Models/wishlist-model')

exports.addToWishlistService = function (formData, userId) {
    try {
        return WishlistModel.addingToWishlist(formData, userId);
    } catch (error) {
        Logger.error(` ${new Date()} Authentication::verifyOTP:${error}`);
        throw error;
    }
}